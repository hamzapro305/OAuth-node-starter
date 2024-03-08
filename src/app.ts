import "reflect-metadata";

import dotenv from "dotenv";
import Middlewares from "./middlewares/Middlewares";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import { TestRouter } from "./routers/TestRouter";

dotenv.config();
const PORT = 8000;

// Middlewares
const app = Middlewares();

// Config

// Routers
app.use("/test/", TestRouter);

// Handle Error After Controller
app.use(ErrorMiddleware);

// Run application
app.listen(PORT, () => {
    console.log("listening to port ", PORT);
});
