import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import Middlewares from "./middlewares/Middlewares";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import { TestRouter } from "./routers/TestRouter";
import { AuthRouter } from "./routers/AuthRouter";
import passport from "passport";

const PORT = 8000;

// Middlewares
const app = Middlewares();
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Config

// Routers
app.use("/test/", TestRouter);
app.use("/auth/", AuthRouter);

// Handle Error After Controller
app.use(ErrorMiddleware);

// Run application
app.listen(PORT, () => {
    console.log("listening to port ", PORT);
});

