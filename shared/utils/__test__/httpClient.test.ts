import axiosMockAdapter from "axios-mock-adapter";
import { HttpClient } from "../httpClient";
import { ApiError } from "../../exceptions/ApiError";

describe("HttpClient", () => {
    let httpClient: HttpClient;
    let mock: axiosMockAdapter;

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

    it("should return data for a successful GET request", async () => {
        const url = "http://example.com";
        const mockData = { id: 1, name: "Test" };

        mock.onGet(url).reply(200, mockData);

        const result = await httpClient.get(url);
        expect(result).toEqual(mockData);
    });

    it("should throw an ApiError for a 404 response", async () => {
        const url = "http://example.com/not-found";

        mock.onGet(url).reply(404);

        await expect(httpClient.get(url)).rejects.toThrow(ApiError);
        await expect(httpClient.get(url)).rejects.toMatchObject({
            statusCode: 404,
            message: `HTTP GET Error: 404 - Unknown Status`,
        });
    });

    it.skip("should throw an ApiError for a network error", async () => {
        const url = "http://example.com";

        mock.onGet(url).networkError();

        await expect(httpClient.get(url)).rejects.toThrow(ApiError);
        await expect(httpClient.get(url)).rejects.toMatchObject({
            statusCode: 503,
            message: `Service Unavailable: No response from ${url}`,
        });
    });

    it("should throw an ApiError for a timeout error", async () => {
        const url = "http://example.com";

        mock.onGet(url).timeout();

        await expect(httpClient.get(url)).rejects.toThrow(ApiError);
        await expect(httpClient.get(url)).rejects.toMatchObject({
            statusCode: 504,
            message: `Timeout Error: timeout of ${process.env.API_REQUEST_TIMEOUT}ms exceeded`,
        });
    });

    it.skip("should throw an ApiError for unexpected errors", async () => {
        const url = "http://example.com";

        mock.onGet(url).reply(500, { message: "Unexpected error" });

        await expect(httpClient.get(url)).rejects.toThrow(ApiError);
        await expect(httpClient.get(url)).rejects.toMatchObject({
            statusCode: 500,
            message: "Unexpected Error: Unexpected error",
        });
    });

    it("should retry the API call the specified number of times if the external service returns an error", async () => {
        const url = "http://example.com";
        const retryNumber = Number(process.env.API_RETRY_NUMBER);

        mock.onGet(url).reply(500);

        await expect(httpClient.get(url)).rejects.toThrow(ApiError);
        expect(mock.history.get.length).toBe(retryNumber + 1); // Initial request + retries
    });

    it("should retry the API call the specified number of times if the external service is not available", async () => {
        const url = "http://example.com";
        const retryNumber = Number(process.env.API_RETRY_NUMBER);

        mock.onGet(url).networkError();

        await expect(httpClient.get(url)).rejects.toThrow(ApiError);
        expect(mock.history.get.length).toBe(retryNumber + 1); // Initial request + retries
    });

});
