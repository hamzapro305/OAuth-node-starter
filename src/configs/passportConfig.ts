import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as LocalStrategy } from "passport-local";
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
            // Serialize User
            this.configSerializeUser();

            // De Serialize User
            this.configDeSerializeUser();

            // Google Strategy
            this.configGoogleStrategy();

            // Facebook Strategy
            this.configFacebookStrategy();

            // Local Strategy
            this.configLocalStrategy();
        } catch (error) {
            console.log(error);
        }
    }
    public readonly configSerializeUser = () => {
        passport.serializeUser(function (user: any, cb) {
            console.log("start");
            process.nextTick(function () {
                console.log("Next tick Called");
                cb(null, {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                });
            });
        });
    };
    public readonly configDeSerializeUser = () => {
        passport.deserializeUser(function (user: any, cb) {
            process.nextTick(function () {
                return cb(null, user);
            });
        });
    };
    public readonly configGoogleStrategy = () => {
        passport.use(
            new GoogleStrategy(
                {
                    // options for google strategy
                    clientID: process.env.GOOGLE_CLIENT_ID as string,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                    callbackURL: "/auth/google/redirect",
                },
                async (accessToken, refreshToken, profile, done) => {
                    console.log(accessToken);
                    const user = await this.authServices.authenticateStrategy({
                        id: profile.id,
                        email: profile._json.email as string,
                        name: profile._json.name as string,
                        strategy: "GOOGLE",
                        accessToken,
                        refreshToken,
                    });
                    done(null, {...profile,strategy:"GOOGLE"});
                }
            )
        );
    };
    public readonly configFacebookStrategy = () => {
        passport.use(
            new FacebookStrategy(
                {
                    clientID: process.env.FACEBOOK_APP_ID as string,
                    clientSecret: process.env.FACEBOOK_APP_SECRET as string,
                    callbackURL: "http://localhost:8000/auth/facebook/redirect",
                    profileFields: ["id", "displayName", "photos", "email"],
                    scope: ["email"],
                },
                async (accessToken, refreshToken, profile, done: any) => {
                    console.log(accessToken);
                    const user = await this.authServices.authenticateStrategy({
                        id: profile.id,
                        email: profile._json.email as string,
                        name: profile._json.name as string,
                        strategy: "FACEBOOK",
                        accessToken,
                        refreshToken,
                    });
                    done(null, {...profile,strategy:"FACEBOOK"});
                }
            )
        );
    };
    public readonly configLocalStrategy = () => {
        passport.use(
            new LocalStrategy(
                {
                    usernameField: "email",
                },
                async (email, password, done) => {
                    const user = await this.authServices.login(
                        {
                            email,
                            password,
                        },
                        done
                    );
                }
            )
        );
    };
}
