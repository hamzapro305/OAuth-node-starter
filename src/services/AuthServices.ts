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
            // Todo link different strategies
            const existingUser = await this.authRepository.getUserByEmail(
                email
            );
            if (existingUser) {
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
    public readonly getUser = async () => {
        try {
            const users = await this.authRepository.getUserByEmail(
                "Jake@gmail.com"
            );
            return users;
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
            const existingUser = await this.authRepository.getUserByEmail(
                email
            );
            const salt = bcrypt.genSaltSync(10);
            const hashedPwd = bcrypt.hashSync(password, salt);

            if (existingUser) {
                throw new CustomError(
                    "User Already Exists",
                    HttpStatusCode.CONFLICT
                );
            }

            const user = await this.authRepository.createUser({
                email,
                password: hashedPwd,
            });
            return user;
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
