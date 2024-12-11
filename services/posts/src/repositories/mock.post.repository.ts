import { Post } from "../types";
import { PostModel } from "../models/post.model";
import {IPostRepository} from "../interfaces/postRepository.interface";

const mockPosts: Post[] = [
    { userId: 1, id: 1, title: "Post 1", body: "Post 1 body" },
    { userId: 1, id: 2, title: "Post 2", body: "Post 2 body" },
    { userId: 2, id: 3, title: "Post 3", body: "Post 3 body" },
    { userId: 2, id: 4, title: "Post 4", body: "Post 4 body" },
    { userId: 3, id: 5, title: "Post 5", body: "Post 5 body" },
    { userId: 3, id: 6, title: "Post 6", body: "Post 6 body" },
];

export class MockPostRepository implements IPostRepository {
    async getPostsByUserId(id: Number): Promise<PostModel[]|null> {
        console.log("getPostsByUserId", id);
        return Promise.resolve(mockPosts.filter(post => post.userId === id) || []);
    }
}