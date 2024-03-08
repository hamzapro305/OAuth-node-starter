import { NextFunction, Request, Response } from "express";
import { inject, singleton } from "tsyringe";
import { TestService } from "../services/TestService";

@singleton()
export class TestController {
    constructor(
        @inject(TestService)
        private readonly _testService: TestService
    ) {}

    public test(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json({ message: "Everything is running!" });
    }
}
