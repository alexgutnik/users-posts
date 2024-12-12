export class ApiError extends Error {
    public statusCode: number;
    public details?: any;

    constructor(statusCode: number, message: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = "ApiError";

        // Ensure the prototype chain is correct for `instanceof`
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
