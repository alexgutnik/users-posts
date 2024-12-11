import express from "express";
import { PostApiRepository } from "../repositories/post.api.repository";
import { HttpClient } from "shared/utils/httpClient";
import {ValidationError} from "shared/exceptions/ValidationError";
import { PostService } from "../services/post.service";

const router = express.Router();
const httpClient = new HttpClient();
const postRepo = new PostApiRepository(httpClient);

export const postService = new PostService(postRepo);

router.get("/users/:id/posts", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            res.status(400).send({ message: "Invalid user ID" });
            return next();
        }

        const postsData = await postService.getUserPosts(id);

        res.status(200).json(postsData);
    } catch (error) {
        next(error);
    }
});

export default router;
