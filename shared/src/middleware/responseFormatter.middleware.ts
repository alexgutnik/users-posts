import { Request, Response, NextFunction } from "express";

export const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
    // Wrap the `res.json` method to enforce the response structure
    const originalJson = res.json.bind(res);

    res.json = (data: any) => {
        const formattedResponse = {
            success: true,
            data,
        };
        return originalJson(formattedResponse);
    };

    next();
};