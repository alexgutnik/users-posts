import { PostModel } from '../post.model';
import { ValidationError } from '@sweetch/shared';
import { Post } from '../../types';

describe('PostModel', () => {
    it('should create a valid post model', () => {
        const post: Post = {
            userId: 1,
            id: 1,
            title: 'Post Title',
            body: 'Post Body'
        };

        const postModel = new PostModel(post);

        expect(postModel).toBeInstanceOf(PostModel);
        expect(postModel.userId).toBe(post.userId);
        expect(postModel.id).toBe(post.id);
        expect(postModel.title).toBe(post.title);
        expect(postModel.body).toBe(post.body);
    });

    it('should throw ValidationError for invalid post data', () => {
        const invalidPost = {
            userId: 'invalid_userId',
            id: 1,
            title: 'Post Title',
            body: 'Post Body'
        };

        expect(() => new PostModel(invalidPost as any)).toThrow(ValidationError);
    });

    it('should validate a valid post', () => {
        const post: Post = {
            userId: 1,
            id: 1,
            title: 'Post Title',
            body: 'Post Body'
        };

        expect(PostModel.isValidPost(post)).toBe(true);
    });

    it('should invalidate an invalid post', () => {
        const invalidPost = {
            userId: 'invalid_userId',
            id: 1,
            title: 'Post Title',
            body: 'Post Body'
        };

        expect(PostModel.isValidPost(invalidPost as any)).toBe(false);
    });

    it('should throw ValidationError if post is missing required fields', () => {
        const invalidPost = {
            userId: 1,
            title: 'Post Title'
        };

        expect(() => new PostModel(invalidPost as any)).toThrow(ValidationError);
    });
});