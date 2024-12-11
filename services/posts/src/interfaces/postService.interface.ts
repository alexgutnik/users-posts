import {PostModel} from "../models/post.model";

export interface IPostService {
    getUserPosts(id: Number): Promise<PostModel[]|null>;
}
