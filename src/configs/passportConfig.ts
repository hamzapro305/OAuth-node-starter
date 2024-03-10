import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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
            this.configLocalStrategy();
        } catch (error) {
            console.log(error);
        }
    }
    public readonly configSerializeUser = () => {
        passport.serializeUser(function (user: any, cb) {
            process.nextTick(function () {
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
