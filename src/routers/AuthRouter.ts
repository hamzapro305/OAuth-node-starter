import { Router } from "express";
import { container } from "tsyringe";
import AuthController from "../controllers/AuthController";
import  PassportConfig  from "../configs/passportConfig";
import passport from "passport";

const AuthRouter = Router();

const authController = container.resolve(AuthController);
const passportConfig = container.resolve(PassportConfig);

AuthRouter.post("/get-users", authController.getUser);
AuthRouter.post("/signup", authController.signup);
AuthRouter.get("/google", passport.authenticate('google', {
    scope: ['email','profile']
}));


// Handle Callback from Google Authentication
AuthRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('you reached the redirect URI');
});

export { AuthRouter };
