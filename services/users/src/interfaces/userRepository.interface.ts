import {UserModel} from "../models/user.model";

export interface IUserRepository {
    getAllUsers(): Promise<UserModel[]>;
    getUserById(id: Number): Promise<UserModel|null>;
}
