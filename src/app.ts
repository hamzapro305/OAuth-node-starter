import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();
import Middlewares from "./middlewares/Middlewares";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import { TestRouter } from "./routers/TestRouter";
import { AuthRouter } from "./routers/AuthRouter";

const PORT = 3000;

// Middlewares
const app = Middlewares();

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

