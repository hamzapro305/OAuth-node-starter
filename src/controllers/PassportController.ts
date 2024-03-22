import { inject, singleton } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import JWT_Utils from "../utils/JWT_Utils";
import passport from "passport";

@singleton()
class PassportController {
    constructor(
        @inject(JWT_Utils)
        private jwtUtils: JWT_Utils
    ) {}
    public readonly authenticateLocal = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            passport.authenticate("local", { failureRedirect: "/login" })(
                req,
                res,
                next
            );
        } catch (error) {
            next(error);
        }
    };
    public readonly authenticateGoogle = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            passport.authenticate("google", {
                scope: ["email", "profile"],
            })(req, res, next);
        } catch (error) {
            next(error);
        }
    };
    public readonly authenticateFacebook = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            passport.authenticate("facebook")(req, res, next);
        } catch (error) {
            next(error);
        }
    };
    public readonly handleGoogleCallback = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            passport.authenticate(
                "google",
                (err: any, user: any, info: any, status: any) => {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return res.redirect("/signin");
                    }
                    const token = this.jwtUtils.generateToken(user);
                    res.render("LoginSuccess.ejs", {
                        token: token,
                    });
                }
            )(req, res, next);
        } catch (error) {
            next(error);
        }
    };
    public readonly handleFacebookCallback = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            passport.authenticate(
                "facebook",
                (err: any, user: any, info: any, status: any) => {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return res.redirect("/signin");
                    }
                    const token = this.jwtUtils.generateToken(user);
                    res.render("LoginSuccess.ejs", {
                        token: token,
                    });
                }
            )(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}
export default PassportController;
