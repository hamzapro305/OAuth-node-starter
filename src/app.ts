import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();
import Middlewares from "./middlewares/Middlewares";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import { TestRouter } from "./routers/TestRouter";
import { AuthRouter } from "./routers/AuthRouter";
import expressSession from "express-session";
import passport from "passport";
import express from "express";
import { container } from "tsyringe";
import PassportConfig from "./configs/passportConfig";
import { UserRouter } from "./routers/UserRouter";
import path from "path";

const PORT = 8000;

// Middlewares
const app = Middlewares();
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

// Config
container.resolve(PassportConfig);
app.use(express.static(__dirname + "/assets/public"));
app.set("views", path.join(__dirname, "./assets/templates"));
app.set("view engine", "ejs");

// Routers
app.use("/test/", TestRouter);
app.use("/auth/", AuthRouter);
app.use("/user/", UserRouter);

// Handle Error After Controller
app.use(ErrorMiddleware);

// Run application
app.listen(PORT, () => {
    console.log("listening to port ", PORT);
});
