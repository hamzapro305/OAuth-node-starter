import express, { Application } from "express";
import cors from "cors";
import expressSession from "express-session";
import passport from "passport";

const Middlewares = () => {
    const app: Application = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({}));
    app.use(
        expressSession({
            secret: "keyboard cat",
            resave: true,
            saveUninitialized: true,
            cookie: { secure: false },
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(passport.authenticate("session"));

    return app;
};

export default Middlewares;
