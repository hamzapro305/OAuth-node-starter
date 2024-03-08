import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../exception/ErrorHandler";

const ErrorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 3. Lastly, handle the error
    const errorHandler = new ErrorHandler();
    errorHandler.handleError(err, res);
};

export default ErrorMiddleware;
