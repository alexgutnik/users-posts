import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import axiosRetry from "axios-retry";
import {ApiError} from "../exceptions/ApiError";

export interface IHttpClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

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

    private handleError(error: unknown, url: string): never {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with a status other than 2xx
                const status = error.response.status;
                const message = `HTTP GET Error: ${error.response.status} - ${error.response.statusText || "Unknown Status"}`;
                throw new ApiError(status, message);
            } else if (error.request) {
                // No response received
                throw new ApiError(503, `Service Unavailable: No response from ${url}`);
            } else if (error.code === 'ECONNABORTED') {
                // Timeout error
                throw new ApiError(504, `Timeout Error: ${error.message}`);
            } else {
                throw new ApiError(500, `HTTP GET Error: ${error.message}`);
            }
        }

        // Unknown or unexpected error
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        throw new ApiError(500, `Unexpected Error: ${message}`);
    }
}
