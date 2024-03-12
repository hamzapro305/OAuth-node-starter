import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();
import Middlewares from "./middlewares/Middlewares";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import { TestRouter } from "./routers/TestRouter";
import { AuthRouter } from "./routers/AuthRouter";
import expressSession from "express-session"
import passport from "passport";
import { container } from "tsyringe";
import PassportConfig from "./configs/passportConfig";

const PORT = 8000;

// Middlewares
const app = Middlewares();
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Config
const passportConfig = container.resolve(PassportConfig);

// Routers
app.use("/test/", TestRouter);
app.use("/auth/", AuthRouter);

// Handle Error After Controller
app.use(ErrorMiddleware);


// Run application
app.listen(PORT, () => {
    console.log("listening to port ", PORT);
});

