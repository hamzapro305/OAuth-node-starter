import { Router } from "express";
import { container } from "tsyringe";
import AuthController from "../controllers/AuthController";

const AuthRouter = Router();

const authController = container.resolve(AuthController);

AuthRouter.post("/get-users", authController.getUser);

export { AuthRouter };
