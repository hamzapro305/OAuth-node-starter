import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import UserRepository from "../repository/UserRepository";
import { CustomError } from "../exception/CustomError";
import HttpStatusCode from "../utils/HttpStatusCode";
import google from "googleapis/build/src/apis/people";
import axios, { AxiosError } from "axios";
import https from "https";

@singleton()
class UserServices {
    constructor(
        @inject(UserRepository)
        private readonly userRepository: UserRepository
    ) {}

    public readonly getUserByEmail = async ({ email }: { email: string }) => {
        try {
            const user = await this.userRepository.getUserByEmail(email);
            if (!user) {
                return null
            }
            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };

    // public readonly verifyAccessToken=(accessToken:string)=> {
    //     const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`;
    //     return new Promise((resolve, reject) => {
    //       https.get(url, (res) => {
    //         let data = '';
    //         res.on('data', (chunk) => {
    //           data += chunk;
    //         });
    //         res.on('end', () => {
    //           try {
    //             const response = JSON.parse(data);
    //             if (response.aud === process.env.GOOGLE_CLIENT_ID && !response.error) {
    //               resolve(response.sub); // User's Google ID
    //             } else {
    //               reject(new Error('Invalid access token'));
    //             }
    //           } catch (error) {
    //             reject(error);
    //           }
    //         });
    //       }).on('error', (error) => {
    //         reject(error);
    //       });
    //     });
    //   }

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
            console.log(error)
            if (error instanceof AxiosError) {
                throw new CustomError(
                    error.response?.data.message,
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            } else {
                console.log(error);
                throw new CustomError(
                    (error?.message as string) || "Internal Server Error",
                    error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }
        }
    };
    public readonly getUserProfile = async ({
        googleAccessToken,
    }: {
        googleAccessToken?: string;
    }) => {
        try {
            if (googleAccessToken) {
                const profile = await this.getGoogleProfile({
                    accessToken: googleAccessToken,
                });
                return profile.data;
            }
        } catch (error: any) {
            if (error instanceof AxiosError) {
                throw new CustomError(
                    error.response?.data.message,
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new CustomError(
                    (error?.message as string) || "Internal Server Error",
                    error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }
        }
    };
}
export default UserServices;
