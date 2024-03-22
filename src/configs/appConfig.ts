import express,{ Application } from "express";
import PassportConfig from "./passportConfig";
import { container } from "tsyringe";
import path from "path";

const appConfig = (app: Application) => {
    try {
        container.resolve(PassportConfig);
        const staticPath = path.join(__dirname, '..');
        app.use(express.static(staticPath + "/assets/public"));
        app.set("views", path.join(staticPath, "/assets/templates"));
        app.set("view engine", "ejs");
    } catch (error) {}
};

export default appConfig;