import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import axiosRetry from "axios-retry";
import {ApiError} from "../exceptions/ApiError";

export interface IHttpClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

type ErrorResponse = {
    status: number;
    message: string;
};

export class HttpClient implements IHttpClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            timeout: process.env.API_REQUEST_TIMEOUT || 5000,
        } as AxiosRequestConfig);

        axiosRetry(this.client, {
            retries: Number(process.env.API_RETRY_NUMBER) || 3,
            retryDelay: axiosRetry.exponentialDelay,
        })
    }

    async get<T>(url: string, config?: any): Promise<T> {
        try {
            const response = await this.client.get<T>(url, config);
            return response.data;
        } catch (error) {
            return Promise.reject(this.handleError(error, url));
        }
    }

    public handleError(error: unknown, url: string): never {
        if (axios.isAxiosError(error)) {
            // Handle Axios-specific errors
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const errorData = error.response.data as ErrorResponse;

                switch (status) {
                    case 400:
                        throw new ApiError(status, 'Bad Request: Invalid parameters');
                    case 401:
                        throw new ApiError(status, 'Unauthorized: Authentication required');
                    case 403:
                        throw new ApiError(status, 'Forbidden: Insufficient permissions');
                    case 404:
                        throw new ApiError(status, `Not Found: Resource at ${url} doesn't exist`);
                    case 429:
                        throw new ApiError(status, 'Rate Limited: Too many requests');
                    default:
                        throw new ApiError(
                            status,
                            errorData?.message ||
                            `Server Error: ${error.response.statusText || 'Unknown error occurred'}`
                        );
                }
            }

            // Handle specific network errors
            if (error.code === 'ECONNABORTED') {
                throw new ApiError(
                    504,
                    `Request Timeout: The request to ${url} took too long to respond`
                );
            }

            // No response received (network error)
            if (!error.request) {
                throw new ApiError(
                    503,
                    `Network Error: No response received from ${url}`
                );
            }

            // Other axios errors
            throw new ApiError(
                500,
                `Request Failed: ${error.message || 'Unknown axios error occurred'}`
            );
        }

        // Handle non-axios errors
        if (error instanceof Error) {
            throw new ApiError(500, `Unexpected Error: ${error.message}`);
        }

        // Handle unknown errors
        throw new ApiError(500, 'Unknown Error: An unexpected error occurred');
    }
}
