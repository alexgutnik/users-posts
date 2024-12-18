import {ApiError} from "./ApiError";

export class InvalidApiResponseError extends ApiError {
    constructor(details: any) {
        super(502, "Invalid API response format", details);
    }
}