export class ValidationError extends Error {
    public statusCode = 400;
    public details: any;

    constructor(message: string, details?: any) {
        super(message);
        this.name = "ValidationError";
        this.details = details;

        // Ensure the prototype chain is correct for `instanceof`
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
