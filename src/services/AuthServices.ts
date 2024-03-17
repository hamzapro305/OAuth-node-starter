import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import AuthRepository from "../repository/AuthRepository";
import UserServices from "./UserServices";
import { CustomError } from "../exception/CustomError";
import HttpStatusCode from "../utils/HttpStatusCode";
import { IVerifyOptions } from "passport-local";
import https from "https";
import axios, { AxiosError } from "axios";

@singleton()
class AuthServices {
    constructor(
        @inject(AuthRepository)
        private readonly authRepository: AuthRepository,

        @inject(UserServices)
        private readonly userServices: UserServices
    ) {}
    public readonly authenticateStrategy = async ({
        id,
        email,
        name,
        strategy,
        accessToken,
        refreshToken,
    }: {
        id: string;
        email: string;
        name: string;
        strategy: "GOOGLE" | "FACEBOOK";
        accessToken: string;
        refreshToken: string;
    }) => {
        try {
            // login karte waqt yeh dekho k user ka strategy account exist krta ya nhi if user exists
            const existingUser = await this.userServices.getUserByEmail({
                email,
            });
            if (existingUser) {
                switch (strategy) {
                    case "GOOGLE":
                        if (!existingUser.googleId) {
                            // If user is not connected with google, connect him to google
                            await this.authRepository.connectToGoogle({
                                documentId: existingUser.id,
                                googleId: id,
                                strategies: existingUser.strategies,
                                accessToken,
                                refreshToken,
                            });
                        }
                        break;
                    case "FACEBOOK":
                        if (!existingUser.facebookId) {
                            // If user is not connected with facebook, connect him to facebook
                            await this.authRepository.connectToFacebook({
                                documentId: existingUser.id,
                                facebookID: id,
                                strategies: existingUser.strategies,
                                accessToken,
                                refreshToken,
                            });
                        }
                        break;

                    default:
                        break;
                }
                return existingUser;
            }
            let newUser;
            switch (strategy) {
                case "GOOGLE":
                    newUser = await this.authRepository.createGoogleUser({
                        email,
                        googleID: id,
                        name,
                        accessToken,
                        refreshToken,
                    });
                    break;
                case "FACEBOOK":
                    newUser = await this.authRepository.createFacebookUser({
                        email,
                        facebookID: id,
                        name,
                        accessToken,
                        refreshToken,
                    });
                    break;

                default:
                    break;
            }
            return { ...newUser, accessToken };
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public readonly signUp = async ({
        email,
        name,
        password,
    }: {
        email: string;
        name: string;
        password: string;
    }) => {
        try {
            // Signup krte waqt yeh dekho k user ka koi strategy id exist krta already tou ussi se connect krdo
            const existingUser = await this.userServices.getUserByEmail({
                email,
            });
            const salt = bcrypt.genSaltSync(10);
            const hashedPwd = bcrypt.hashSync(password, salt);

            if (!existingUser) {
                // If user does not exist make then simply create a new user using local signup
                await this.authRepository.createUser({
                    email,
                    name,
                    password: hashedPwd,
                });
                return "User Successfully Added...";
            }

            if (existingUser.strategies) {
                // If User has previously signed up using a strategy then connect that to his local account.
                await this.authRepository.connectLocalAccount({
                    documentId: existingUser.id,
                    password: hashedPwd,
                });
                return "Connected to strategy account.";
            }

            throw new CustomError(
                "User Already Exists",
                HttpStatusCode.CONFLICT
            );
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public readonly login = async (
        {
            email,
            password,
        }: {
            email: string;
            password: string;
        },
        done: (
            error: any,
            user?: false | Express.User | undefined,
            options?: IVerifyOptions | undefined
        ) => void
    ) => {
        try {
            const user = await this.userServices.getUserByEmail({ email });

            if (!user) {
                return done(
                    new CustomError("User Not Found", HttpStatusCode.NOT_FOUND),
                    false
                );
            }
            const userPassword = await this.authRepository.getUserPassword(
                email
            );
            if (!userPassword) {
                return done(
                    new CustomError(
                        "You didn't signed up using email...",
                        HttpStatusCode.BAD_REQUEST
                    ),
                    false
                );
            }
            if (!bcrypt.compareSync(password, userPassword)) {
                return done(
                    new CustomError(
                        "Password incorrect",
                        HttpStatusCode.BAD_REQUEST
                    ),
                    false
                );
            }
            console.log(user)
            return done(null,user);
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };

    public readonly verifyAccessToken = async (accessToken: string) => {
        type TokenResponse = {
            aud: string;
            sub: string;
            error?: string;
        };
        try {
            const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`;
            const response = await new Promise<TokenResponse>(
                (resolve, reject) => {
                    https
                        .get(url, (res) => {
                            let data = "";
                            res.on("data", (chunk) => {
                                data += chunk;
                            });
                            res.on("end", () => {
                                try {
                                    const parsedResponse = JSON.parse(
                                        data
                                    ) as TokenResponse;
                                    resolve(parsedResponse);
                                } catch (error) {
                                    reject(
                                        new Error(
                                            "Failed to parse token response"
                                        )
                                    );
                                }
                            });
                        })
                        .on("error", (error) => {
                            reject(
                                new Error(
                                    "Network error during token verification"
                                )
                            );
                        });
                }
            );

            if (
                response.aud === process.env.GOOGLE_CLIENT_ID &&
                !response.error
            ) {
                return { userId: response.sub };
            } else {
                throw new Error("Invalid access token");
            }
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };

    public readonly getGoogleProfile = async ({
        accessToken,
    }: {
        accessToken: string;
    }) => {
        try {
            // const status= await this.verifyAccessToken(accessToken)
            // console.log(status)
            // const people=google.people({version:"v1"})
            // const res= await people.people.get({ resourceName:"people/*",access_token:accessToken , personFields: 'email,names,photos' });

            // console.log(accessToken, "THis is access token");
            // const res = await axios.get(
            //     "https://people.googleapis.com/v1/{resourceName=people/*}",
            //     {
            //         headers: {
            //             Authorization: `${accessToken}`,
            //         },
            //     }
            // );
            const res = await axios.get(
                `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
            );
            console.log(res, "this is response");
            return res;
        } catch (error: any) {
            if (error instanceof AxiosError) {
                throw new CustomError(
                    error.response?.data.message,
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            } else {
                // console.log(error);
                throw new CustomError(
                    (error?.message as string) || "Internal Server Error",
                    error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }
        }
    };
    public readonly getFacebookProfile = async ({
        accessToken,
    }: {
        accessToken: string;
    }) => {
        try {
            const response = await axios.get(
                `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
            );
            console.log(response.data)
            return response.data;
        } catch (error: any) {
            if (error instanceof AxiosError) {
                throw new CustomError(
                    error.response?.data.message,
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            } else {
                // console.log(error);
                throw new CustomError(
                    (error?.message as string) || "Internal Server Error",
                    error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }
        }
    };
}
export default AuthServices;
