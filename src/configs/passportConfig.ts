import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { inject, singleton } from "tsyringe";
import AuthServices from "../services/AuthServices";
// import User from "../models/user-model";
// import createUser from "../services/userService";

@singleton()
export default class PassportConfig {
    constructor(
        @inject(AuthServices)
        private authServices: AuthServices
    ) {
        try {
            passport.serializeUser(function(user:any, cb) {
                process.nextTick(function() {
                  cb(null, { id: user.id, name: user.name,email:user.email });
                });
              });
              
              passport.deserializeUser(function(user:any, cb) {
                process.nextTick(function() {
                  return cb(null, user);
                });
              });
            passport.use(
                new GoogleStrategy(
                    {
                        // options for google strategy
                        clientID: process.env.googleClientID as string,
                        clientSecret: process.env.googleClientSecret as string,
                        callbackURL: "/auth/google/redirect",
                    },
                    async (accessToken, refreshToken, profile, done) => {
                        console.log(profile);
                        const user = await this.authServices.authenticateStrategy({
                            id: profile.id,
                            email: profile._json.email as string,
                            name: profile._json.name as string,
                            profilePic: profile._json.picture as string,
                            strategy: "GOOGLE",
                        });
                        done(null, user);
                    }
                )
            );
        } catch (error) {
            console.log(error);
        }
    }
}
