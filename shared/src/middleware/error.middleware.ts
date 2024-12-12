import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/ApiError";

export const errorHandlerMiddleware = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err); // If headers are already sent, delegate to default handler
    }

    const status = err instanceof ApiError ? err.statusCode : 500; // Default to 500 for unknown errors
    const response = {
        success: false,
        error: {
            status,
            message: err.message || "Internal Server Error",
            ...(process.env.NODE_ENV !== 'production' && err instanceof ApiError && err.details && {details: err.details}), // Include details if present
        },
    };

    res.status(status).json(response);
};
