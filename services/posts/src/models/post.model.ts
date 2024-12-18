import { Post } from "../types";
import { ValidationError } from "@sweetch/shared";

export class PostModel implements Post {
    userId: number;
    id: number;
    title: string;
    body: string;

    constructor(post: Post) {
        if (!PostModel.isValidPost(post)) {
            throw new ValidationError("Invalid post data", post);
        }

        this.userId = post.userId;
        this.id = post.id;
        this.title = post.title;
        this.body = post.body;
    }

    static isValidPost(post: any): post is Post {
        return (
            typeof post.userId === "number" &&
            typeof post.id === "number" &&
            typeof post.title === "string" &&
            typeof post.body === "string"
        );
    }
}
