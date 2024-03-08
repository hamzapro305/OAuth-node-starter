import { Router } from "express";
import { container } from "tsyringe";
import { TestController } from "../controllers/TestController";

const TestRouter = Router();

// Getting Controller Using
const testController = container.resolve(TestController);

TestRouter.get("/", testController.test);

export { TestRouter };
