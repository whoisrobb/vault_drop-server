import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { getErrorMessage } from "../utils/utils";

const errorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({ message: error.message });
    } else {
        console.error(error);
        res.status(500).json({ message: getErrorMessage(error) });
    }
};

export default errorHandler;