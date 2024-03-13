import { container, inject, singleton } from "tsyringe";
import AuthServices from "../services/AuthServices";
import { NextFunction, Request, Response } from "express";

@singleton()
class AuthController {
    constructor(
        @inject(AuthServices)
        private authServices: AuthServices
    ) {}
    public readonly signup = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { email,name, password } = req.body;

            const status=await this.authServices.signUp({ email,name, password });
            res.status(200).send(status);
        } catch (error) {
            next(error);
        }
    };
}
export default AuthController;
