import { Router } from "express";
import { container } from "tsyringe";
import AuthController from "../controllers/AuthController";
import passport from "passport";

const AuthRouter = Router();

const authController = container.resolve(AuthController);

AuthRouter.post("/signup", authController.signup);
AuthRouter.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/local/redirect");
    }
);
AuthRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
);

// Handle Callback from Google Authentication
AuthRouter.get(
    "/google/redirect",
    passport.authenticate("google"),
    (req, res) => {
        res.send("you reached the redirect URI");
    }
);

export { AuthRouter };
