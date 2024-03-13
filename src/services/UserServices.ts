import { inject, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import UserRepository from "../repository/UserRepository";
import { CustomError } from "../exception/CustomError";
import HttpStatusCode from "../utils/HttpStatusCode";

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
                throw new CustomError(
                    "User Not Found...",
                    HttpStatusCode.NOT_FOUND
                );
            }
            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
}
export default UserServices;
