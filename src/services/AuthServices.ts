import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import AuthRepository from "../repository/AuthRepository";
import { CustomError } from "../exception/CustomError";
import HttpStatusCode from "../utils/HttpStatusCode";
import { IVerifyOptions } from "passport-local";

@singleton()
class AuthServices {
    constructor(
        @inject(AuthRepository)
        private readonly authRepository: AuthRepository
    ) {}
    public readonly authenticateStrategy = async ({
        id,
        email,
        name,
        profilePic,
        strategy,
    }: {
        id: string;
        email: string;
        name: string;
        profilePic: string;
        strategy: "GOOGLE" | "FACEBOOK";
    }) => {
        try {
            // login karte waqt yeh dekho k user ka strategy id exist krta ya nhi if user exists
            const existingUser = await this.authRepository.getUserByEmail(
                email
            );
            if (existingUser) {
                if (!existingUser.googleID) {
                    // If user is not connected with google, connect him to google
                    await this.authRepository.connectToGoogle({
                        documentId: existingUser.id,
                        googleID: id,
                        name,
                        profilePic,
                    });
                }
                return existingUser;
            }
            const user = await this.authRepository.createGoogleUser({
                email,
                googleID: id,
                name,
                profilePic,
            });
            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public readonly signUp = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        try {
            // Signup krte waqt yeh dekho k user ka koi strategy id exist krta already tou ussi se connect krdo
            const existingUser = await this.authRepository.getUserByEmail(
                email
            );
            const salt = bcrypt.genSaltSync(10);
            const hashedPwd = bcrypt.hashSync(password, salt);

            if (!existingUser) {
                // If user does not exist make then simply create a new user using local signup
                await this.authRepository.createUser({
                    email,
                    password: hashedPwd,
                });
                return "User Successfully Added...";
            }

            if (existingUser.googleID || existingUser.facebookID) {
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
            const user = await this.authRepository.getUserByEmail(email);

            if (!user) {
                return done(
                    new CustomError("User Not Found", HttpStatusCode.NOT_FOUND),
                    false
                );
            }
            if (!user.password) {
                return done(
                    new CustomError("You didn't signed up using email...", HttpStatusCode.BAD_REQUEST),
                    false
                );
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(
                    new CustomError(
                        "Password incorrect",
                        HttpStatusCode.BAD_REQUEST
                    ),
                    false
                );
            }
            return done(null, user);
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
}
export default AuthServices;
