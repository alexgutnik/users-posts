import { IUserRepository } from "../interfaces/userRepository.interface";
import { PostModel } from "../models/post.model";
import {MockPostRepository} from "./mock.post.repository";

export class PostDbRepository implements IUserRepository {
    async getAllUsers(): Promise<PostModel[]> {
        return (new MockPostRepository()).getAllUsers();
    }

    async getUserById(id: Number): Promise<PostModel|null> {
        return (new MockPostRepository()).getUserById(id);
    }
}
