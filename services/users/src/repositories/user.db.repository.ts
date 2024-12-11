import { IUserRepository } from "../interfaces/userRepository.interface";
import { UserModel } from "../models/user.model";
import {MockUserRepository} from "./mock.user.repository";

export class UserDbRepository implements IUserRepository {
    async getAllUsers(): Promise<UserModel[]> {
        return (new MockUserRepository()).getAllUsers();
    }

    async getUserById(id: Number): Promise<UserModel|null> {
        return (new MockUserRepository()).getUserById(id);
    }
}
