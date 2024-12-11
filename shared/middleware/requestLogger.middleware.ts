import { Request, Response, NextFunction } from "express";
import logger from "shared/utils/logger";

/**
 * Middleware to log incoming requests.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incoming Request: ${req.method} ${req.url}`);
    next();
};