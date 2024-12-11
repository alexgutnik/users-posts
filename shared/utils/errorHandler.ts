import { Response } from 'express';

export class ErrorHandler {
    static handleError(res: Response, statusCode: number, message: string) {
        res.status(statusCode).json({ error: message });
    }
}
