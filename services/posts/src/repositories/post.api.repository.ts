import { Post } from "../types";
import { IHttpClient } from "shared/utils/httpClient";
import { PostModel } from "../models/post.model";
import {IPostRepository} from "../interfaces/postRepository.interface";
import {InvalidApiResponseError} from "shared/exceptions/InvalidApiResponseError";

export class PostApiRepository implements IPostRepository {
    private _httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this._httpClient = httpClient;
    }

    async getPostsByUserId(id: Number): Promise<PostModel[]|null> {
        const posts = await this._httpClient.get<Post[]>(`${process.env.API_URL}/posts/?userId=${id}`);
        if (!Array.isArray(posts)) {
            throw new InvalidApiResponseError(posts);
        }
        return posts.map(post => new PostModel(post));
    }
}
