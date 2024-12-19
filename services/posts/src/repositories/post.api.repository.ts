import { Post } from "../types";
import { IHttpClient, InvalidApiResponseError, ValidationError } from "@sweetch/shared";
import { PostModel } from "../models/post.model";
import { IPostRepository } from "../interfaces/postRepository.interface";

export class PostApiRepository implements IPostRepository {
    private _httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this._httpClient = httpClient;
    }

    async getPostsByUserId(id: Number): Promise<PostModel[]|null> {
        try {
            const posts = await this._httpClient.get<Post[]>(`${process.env.API_URL}/posts/?userId=${id}`);

            if (!Array.isArray(posts)) {
                throw new ValidationError("Invalid Post data", posts);
            }
            return posts.map(post => new PostModel(post));
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new InvalidApiResponseError(error);
            }
            throw error;
        }
    }
}
