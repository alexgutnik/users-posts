import axiosMockAdapter from "axios-mock-adapter";
import { HttpClient } from "../httpClient";
import { ApiError } from "../../exceptions/ApiError";
import { AxiosError, AxiosRequestHeaders } from "axios";

describe("HttpClient", () => {
    let httpClient: HttpClient;
    let mock: axiosMockAdapter;
    const baseURL = 'http://api.example.com';

    beforeAll(() => {
        // Set environment variables for the tests
        process.env.API_REQUEST_TIMEOUT = "5000";
        process.env.API_RETRY_NUMBER = "3";
    })

    beforeEach(() => {
        httpClient = new HttpClient();
        mock = new axiosMockAdapter((httpClient as any).client);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        // Reset environment variables after tests
        delete process.env.API_REQUEST_TIMEOUT;
        delete process.env.API_RETRY_NUMBER;
    });

    describe("GET requests", () => {
        const endpoint = "/users";
        const url = `${baseURL}${endpoint}`;
        const mockData = { id: 1, name: 'John Doe' };

        it("should return data for a successful GET request", async () => {
            mock.onGet(url).reply(200, mockData);

            const result = await httpClient.get(url);
            expect(result).toEqual(mockData);
        });

        it('should handle empty response', async () => {
            mock.onGet(endpoint).reply(200, null);

            const result = await httpClient.get(endpoint);
            expect(result).toBeNull();
        });

        it('should handle 400 Bad Request', async () => {
            mock.onGet(endpoint).reply(400, { message: 'Invalid parameters' });

            await expect(httpClient.get(endpoint))
                .rejects
                .toThrow(new ApiError(400, 'Bad Request: Invalid parameters'));
        });

        it('should handle 401 Unauthorized', async () => {
            mock.onGet(endpoint).reply(401, { message: 'Unauthorized access' });

            await expect(httpClient.get(endpoint))
                .rejects
                .toThrow(new ApiError(401, 'Unauthorized: Authentication required'));
        });

        it('should handle 403 Forbidden', async () => {
            mock.onGet(endpoint).reply(403, { message: 'Forbidden access' });

            await expect(httpClient.get(endpoint))
                .rejects
                .toThrow(new ApiError(403, 'Forbidden: Insufficient permissions'));
        });

        it('should handle 404 Not Found', async () => {
            mock.onGet(endpoint).reply(404);

            await expect(httpClient.get(endpoint))
                .rejects
                .toThrow(new ApiError(404, `Not Found: Resource at ${endpoint} doesn't exist`));
        });

        it('should handle 429 Too Many Requests', async () => {
            mock.onGet(endpoint).reply(429, { message: 'Rate limit exceeded' });

            await expect(httpClient.get(endpoint))
                .rejects
                .toThrow(new ApiError(429, 'Rate Limited: Too many requests'));
        });

        it('should handle 500 Internal Server Error', async () => {
            mock.onGet(endpoint).reply(500, { message: 'Internal server error' });

            await expect(httpClient.get(endpoint))
                .rejects
                .toThrow(ApiError);
        });

        it('should handle 503 Service Unavailable', async () => {
            mock.onGet(endpoint).reply(503);

            await expect(httpClient.get(endpoint))
                .rejects
                .toThrow(new ApiError(503, `Server Error: Unknown error occurred`));
        });

        it("should throw an ApiError for unexpected errors", async () => {
            mock.onGet(url).reply(500, { message: "Unexpected error" });

            await expect(httpClient.get(url)).rejects.toThrow(new ApiError(500, "Unexpected error"));
        });

        it('should handle axios error without response', async () => {
            const error = new AxiosError(
                'Request Failed: Network Error',
                'NETWORK_ERROR',
                { headers: {} as AxiosRequestHeaders },
                {},
                undefined);

            try {
                httpClient.handleError(error, url);
            } catch (error: any) {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.statusCode).toBe(500);
                expect(error.message).toBe('Request Failed: Request Failed: Network Error');
            }

        });

        // Network Errors
        it('should handle network timeout', async () => {
            mock.onGet(endpoint).timeout();

            await expect(httpClient.get(endpoint))
                .rejects
                .toThrow(new ApiError(504, `Request Timeout: The request to ${endpoint} took too long to respond`));
        });

        it('should handle network error', async () => {
            mock.onGet(endpoint).networkError();

            await expect(httpClient.get(endpoint))
                .rejects
                .toThrow(new ApiError(503, `Network Error: No response received from ${endpoint}`));
        });

        it('should handle non-axios errors', async () => {
            const error = new Error('Some unexpected error');
            try {
                httpClient.handleError(error, url);
            } catch (err: any) {
                expect(err).toBeInstanceOf(ApiError);
                expect(err.statusCode).toBe(500);
                expect(err.message).toBe('Unexpected Error: Some unexpected error');
            }
        });

        it('should handle non-axios errors - unknown error', async () => {
            const error = 'Some unexpected error';
            try {
                httpClient.handleError(error, url);
            } catch (err: any) {
                expect(err).toBeInstanceOf(ApiError);
                expect(err.statusCode).toBe(500);
                expect(err.message).toBe('Unknown Error: An unexpected error occurred');
            }
        });

        // Request Configuration
        it('should handle requests with query parameters', async () => {
            const params = { userId: 1 };
            mock.onGet(endpoint, { params }).reply(200, mockData);

            const result = await httpClient.get(endpoint, { params });
            expect(result).toEqual(mockData);
        });
    });

});
