import { Router } from "express";
import { container } from "tsyringe";
import AuthController from "../controllers/AuthController";
import PassportController from "../controllers/PassportController";

const AuthRouter = Router();

const authController = container.resolve(AuthController);
const passportController = container.resolve(PassportController);

AuthRouter.post("/get-user", authController.fetchUserDetails);
AuthRouter.post("/signup", authController.signup);
AuthRouter.post("/login", passportController.authenticateLocal, (req, res) => {
    res.json(req.user);
});
AuthRouter.get("/google", passportController.authenticateGoogle);
AuthRouter.get("/facebook", passportController.authenticateFacebook);

// Handle Callback from Google Authentication
AuthRouter.get("/google/redirect", passportController.handleGoogleCallback);

// Handle Callback from Facebook Authentication
AuthRouter.get("/facebook/redirect", passportController.handleFacebookCallback);

export { AuthRouter };

// AuthRouter.get("/google/success-login", (req, res) => {
//     console.log(req.user);

//     res.status(200).json({
//         success: true,
//         message: "successful",
//         user: req.user,
//     });
// });
// AuthRouter.get('/google/redirect', function(req, res, next) {
//     passport.authenticate('google', function(err:any, user:any, info:any, status:any) {
//       if (err) { return next(err) }
//       if (!user) { return res.redirect('/signin') }
//       res.redirect('http://localhost:4200/login-success');
//     })(req, res, next);
//   });
// AuthRouter.get(
//     "/google/redirect",
//     passport.authenticate(
//         "google",
//         {
//             successRedirect: "http://localhost:4200/login-success",
//         },
//     )
// );
