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
        res.redirect("/auth/local/redirect");
    }
);
AuthRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
);
AuthRouter.get("/facebook", passport.authenticate("facebook"));


// Test Routes
AuthRouter.post("/verify/access-token",authController.verifyAccessToken)

// Handle Callback from Google Authentication
AuthRouter.get(
    "/google/redirect",
    passport.authenticate("google"),
    (req, res) => {
        res.json(req.user);
    }
);
// Handle Callback from Facebook Authentication
AuthRouter.get(
    "/facebook/redirect",
    passport.authenticate("facebook"),
    (req, res) => {
        res.send("you reached the redirect URI");
    }
);
// Handle Callback from Local Authentication
AuthRouter.post("/local/redirect", (req, res) => {
    res.send("you reached the local redirect URI");
});

export { AuthRouter };
