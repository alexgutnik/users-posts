import { IPostRepository } from "../interfaces/postRepository.interface";
import { PostModel } from "../models/post.model";
import { MockPostRepository } from "./mock.post.repository";

export class PostDbRepository implements IPostRepository {
    async getPostsByUserId(id: Number): Promise<PostModel[]|null> {
        return (new MockPostRepository()).getPostsByUserId(id);
    }
}
