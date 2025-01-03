import { IUserRepository } from "../interfaces/userRepository.interface";
import { User } from "../types";
import { IHttpClient, InvalidApiResponseError, ValidationError } from "@sweetch/shared";
import { UserModel } from "../models/user.model";

export class UserApiRepository implements IUserRepository {
    private _httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this._httpClient = httpClient;
    }

    async getAllUsers(): Promise<UserModel[]> {
        try {
            const users = await this._httpClient.get<User[]>(`${process.env.API_URL}/users`);
            if (!Array.isArray(users)) {
                throw new ValidationError("Invalid User data", users);
            }
            return users.map((user) => new UserModel(user));
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new InvalidApiResponseError(error);
            }
            throw error;
        }
    }

    async getUserById(id: Number): Promise<UserModel|null> {
        try {
            const user = await this._httpClient.get<User>(`${process.env.API_URL}/users/${id}`);
            return user ? new UserModel(user) : null;
        } catch (error: any) {
            if (error instanceof ValidationError) {
                throw new InvalidApiResponseError(error);
            }

            if (error?.statusCode === 404) {
                return null;
            }

            throw error;
        }
    }
}
