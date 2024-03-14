import { Router } from "express";
import { container } from "tsyringe";
import UserController from "../controllers/UserController";

const UserRouter=Router();
const userController = container.resolve(UserController);


UserRouter.get("/:email",userController.getUserByEmail)
UserRouter.post("/profile",userController.getUserProfile)

export {UserRouter}