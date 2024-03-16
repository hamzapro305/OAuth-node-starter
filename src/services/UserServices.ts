import { delay, inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import UserRepository from "../repository/UserRepository";
import { CustomError } from "../exception/CustomError";
import HttpStatusCode from "../utils/HttpStatusCode";
import google from "googleapis/build/src/apis/people";
import axios, { AxiosError } from "axios";
import https from "https";
import AuthServices from "./AuthServices";

@singleton()
class UserServices {
    constructor(
        @inject(UserRepository)
        private readonly userRepository: UserRepository,

        @inject(delay(() => AuthServices))
        private readonly authServices: AuthServices
    ) {}

    public readonly getUserByEmail = async ({ email }: { email: string }) => {
        try {
            const user = await this.userRepository.getUserByEmail(email);
            if (!user) {
                return null;
            }
            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };

    public readonly getUserProfile = async ({
        googleAccessToken,
    }: {
        googleAccessToken?: string;
    }) => {
        try {
            if (googleAccessToken) {
                const user = await this.authServices.getGoogleProfile({
                    accessToken: googleAccessToken,
                });
                const profile=await this.getUserByEmail({email:user.data.email})
                return {...user.data,profile};
            }
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
}
export default UserServices;
