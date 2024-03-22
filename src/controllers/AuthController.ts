import { container, inject, singleton } from "tsyringe";
import AuthServices from "../services/AuthServices";
import { NextFunction, Request, Response } from "express";
import JWT_Utils from "../utils/JWT_Utils";

@singleton()
class AuthController {
    constructor(
        @inject(AuthServices)
        private authServices: AuthServices,

        @inject(JWT_Utils)
        private jwtUtils:JWT_Utils
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
    public readonly fetchUserDetails = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            console.log("fetching user details...")
            const accessToken=this.jwtUtils.extractToken(req)
            const user=this.jwtUtils.verifyToken(accessToken)
            res.status(200).send(user);
        } catch (error) {
            next(error);
        }
    };

    public readonly verifyAccessToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { accessToken } = req.body;

            const status=await this.authServices.verifyAccessToken(accessToken);
            res.status(200).send(status);
        } catch (error) {
            next(error);
        }
    };
}
export default AuthController;
