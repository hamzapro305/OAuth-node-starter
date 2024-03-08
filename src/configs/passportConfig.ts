import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import User from "../models/user-model";
// import createUser from "../services/userService";

export const passportSetup = () => {
    try {
        console.log(process.env.googleClientID)
        passport.use(
            new GoogleStrategy(
                {
                    // options for google strategy
                    clientID: process.env.googleClientID as string,
                    clientSecret: process.env.googleClientSecret as string,
                    callbackURL: "/auth/google/redirect",
                },
                (accessToken, refreshToken, profile, done) => {
                    console.log("herere");
                    // createUser(profile.id, profile.displayName);
                }
            )
        );
    } catch (error) {
        console.log(error);
    }
};
