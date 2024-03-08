import { container, inject, singleton } from "tsyringe";
import AuthServices from "../services/AuthServices";
import { NextFunction, Request, Response } from "express";

@singleton()
class AuthController {
    constructor(
        @inject(AuthServices)
        private authServices: AuthServices,
    ) {}
    public readonly getUser=async(req: Request, res: Response, next: NextFunction)=> {
        try {
            const users = await this.authServices.getUser();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
}
export default AuthController;
