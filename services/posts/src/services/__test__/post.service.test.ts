import { faker } from "@faker-js/faker";
import {IPostRepository} from "../../interfaces/postRepository.interface";
import {IPostService} from "../../interfaces/postService.interface";
import {PostService} from "../post.service";
import {MockPostRepository} from "../../repositories/mock.post.repository";
import {PostModel} from "../../models/post.model";
import {Post} from "../../types";

const mockPost = () => {
    const post = {
        userId: faker.number.int({min: 1, max: 10000}),
        id: faker.number.int({min: 1, max: 10000}),
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraph()
    } as unknown as Post;

    return [new PostModel(post)];
}

describe("PostService", () => {
    let postRepository: IPostRepository;
    let postService: IPostService;

    beforeEach(() => {
        postRepository = new MockPostRepository();
    });

    afterEach(() => {
        postRepository = {} as IPostRepository;
    });

    it("should return a list of posts by user id", async () => {
        const posts = mockPost();
        postService = new PostService(postRepository);

        jest.spyOn(postRepository, "getPostsByUserId")
            .mockImplementationOnce(() => Promise.resolve(posts as PostModel[]));

        const result = await postService.getUserPosts(posts[0].userId);

        expect(result).toEqual(posts);
    });

    it("should return empty array of posts if user is not found", async () => {
        const posts = mockPost();
        postService = new PostService(postRepository);

        jest.spyOn(postRepository, "getPostsByUserId")
            .mockImplementationOnce(() => Promise.resolve([]));

        const result = await postService.getUserPosts(posts[0].userId);

        expect(result).toHaveLength(0);
    });
});