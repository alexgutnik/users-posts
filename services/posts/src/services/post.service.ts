import {IPostService } from "../interfaces/postService.interface";
import { IPostRepository } from "../interfaces/postRepository.interface";
import {PostModel} from "../models/post.model";


export class PostService implements IPostService {
    private _repository: IPostRepository;

    constructor(repository: IPostRepository) {
        this._repository = repository
    }

    async getUserPosts(id: Number): Promise<PostModel[]|null> {
        return await this._repository.getPostsByUserId(id);
    }
}