import {PostModel} from "../models/post.model";

export interface IPostRepository {
    getPostsByUserId(id: Number): Promise<PostModel[]|null>;
}
