import express from "express";
import { PostApiRepository } from "../repositories/post.api.repository";
import { ApiError, HttpClient } from "@sweetch/shared";
import { PostService } from "../services/post.service";

const router = express.Router();
const httpClient = new HttpClient();
const postRepo = new PostApiRepository(httpClient);

export const postService = new PostService(postRepo);

router.get("/users/:id/posts", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new ApiError(400, "Invalid user ID");
        }

        const postsData = await postService.getUserPosts(id);

        res.status(200).json(postsData);
    } catch (error) {
        next(error);
    }
});

export default router;
