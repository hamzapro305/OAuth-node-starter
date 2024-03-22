import { Router } from "express";
import { container } from "tsyringe";
import AuthController from "../controllers/AuthController";
import passport from "passport";
import JWT_Utils from "../utils/JWT_Utils";

const AuthRouter = Router();

const authController = container.resolve(AuthController);
const jwtUtils = container.resolve(JWT_Utils);

AuthRouter.post("/get-user", authController.fetchUserDetails);
AuthRouter.post("/signup", authController.signup);
AuthRouter.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    function (req, res) {
        res.json(req.user);
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
AuthRouter.post("/verify/access-token", authController.verifyAccessToken);

// Handle Callback from Google Authentication
AuthRouter.get('/google/redirect', function(req, res, next) {
    passport.authenticate('google', function(err:any, user:any, info:any, status:any) {
      if (err) { return next(err) }
      if (!user) { return res.redirect('/signin') }
      const token = jwtUtils.generateToken(user);
      console.log("herererere")
      res.render("GoogleLoginSuccess.ejs", {
          token: token,
      });
    })(req, res, next);
  });
// Handle Callback from Facebook Authentication
AuthRouter.get(
    "/facebook/redirect",
    passport.authenticate("facebook"),
    (req, res) => {
        res.json(req.user);
    }
);

AuthRouter.get("/google/success-login", (req, res) => {
    console.log(req.user)

    res.status(200).json({
        success: true,
        message: "successful",
        user: req.user,
    });
});

export { AuthRouter };


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
