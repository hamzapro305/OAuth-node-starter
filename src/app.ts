import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();
import Middlewares from "./middlewares/Middlewares";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import appConfig from "./configs/appConfig";
import { TestRouter } from "./routers/TestRouter";
import { AuthRouter } from "./routers/AuthRouter";
import { UserRouter } from "./routers/UserRouter";

const PORT = 8000;

// Middlewares
const app = Middlewares();

// Config
appConfig(app)

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
