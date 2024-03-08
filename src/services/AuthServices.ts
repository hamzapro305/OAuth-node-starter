import { inject, singleton } from "tsyringe";
import AuthRepository from "../repository/AuthRepository";
import { CustomError } from "../exception/CustomError";
import HttpStatusCode from "../utils/HttpStatusCode";

@singleton()
class AuthServices {
    constructor(
        @inject(AuthRepository)
        private readonly authRepository: AuthRepository
    ) {}
    public readonly getUser=async()=> {
        try {
            const users = await this.authRepository.getUser();
            return users;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}
export default AuthServices;
