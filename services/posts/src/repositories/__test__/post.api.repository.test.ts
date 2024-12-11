import { PostApiRepository } from '../post.api.repository';
import {HttpClient, IHttpClient} from 'shared/utils/httpClient';
import { PostModel } from '../../models/post.model';
import { ValidationError } from 'shared/exceptions/ValidationError';
import { Post } from '../../types';

describe('PostApiRepository', () => {
    let httpClient: IHttpClient;
    let postApiRepository: PostApiRepository;

    beforeEach(() => {
        httpClient = new HttpClient();
    });

    afterEach(() => {
        httpClient = {} as IHttpClient;
    });

    it('should return a list of posts by user id', async () => {
        const posts: Post[] = [
            { userId: 1, id: 1, title: "Post 1", body: "Post 1 body" },
            { userId: 1, id: 2, title: "Post 2", body: "Post 2 body" },
        ];
        postApiRepository = new PostApiRepository(httpClient);
        jest.spyOn(httpClient, 'get').mockImplementationOnce(() => Promise.resolve(posts));

        const result = await postApiRepository.getPostsByUserId(1) as PostModel[];

        expect(result[0]).toBeInstanceOf(PostModel);
        expect(result[0].id).toBe(posts[0].id);
    });

    it('should return empty array if posts are not found', async () => {
        postApiRepository = new PostApiRepository(httpClient);
        jest.spyOn(httpClient, 'get').mockImplementationOnce(() => Promise.resolve([]));

        const result = await postApiRepository.getPostsByUserId(1);

        expect(result).toHaveLength(0);
    });

    it('should throw ValidationError if posts data is invalid', async () => {
        postApiRepository = new PostApiRepository(httpClient);
        jest.spyOn(httpClient, 'get').mockImplementationOnce(() => Promise.reject(new ValidationError('Invalid post data')));

        await expect(postApiRepository.getPostsByUserId(1)).rejects.toThrow(ValidationError);
    });
});