import express, { Application } from "express";
import cors from "cors";

const Middlewares = () => {
    const app: Application = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({}));
    
    return app;
};

export default Middlewares;
