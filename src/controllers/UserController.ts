import { container, inject, singleton } from "tsyringe";
import UserServices from "../services/UserServices";
import { NextFunction, Request, Response } from "express";

@singleton()
class UserController {
    constructor(
        @inject(UserServices)
        private userServices: UserServices
    ) {}
    public readonly getUserByEmail = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { email } = req.params;

            const status = await this.userServices.getUserByEmail({ email });
            res.status(200).send(status);
        } catch (error) {
            next(error);
        }
    };

    public readonly getUserProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { googleAccessToken,facebookAccessToken } = req.body;
            const profile = await this.userServices.getUserProfile({ googleAccessToken,facebookAccessToken });
            res.status(200).send(profile);
        } catch (error) {
            next(error);
        }
    };
}
export default UserController;
