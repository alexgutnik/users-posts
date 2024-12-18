import express from "express";
import { UserService } from "../services/user.service";
import { UserApiRepository } from "../repositories/user.api.repository";
import { ApiError, HttpClient } from "@sweetch/shared";

const router = express.Router();
const httpClient = new HttpClient();
const userRepo = new UserApiRepository(httpClient);

export const userService = new UserService(userRepo);

router.get("/users", async (req, res, next) => {
    try {
        const userData = await userService.getAllUsers();
        res.send(userData);
    } catch (error) {
        next(error);
    }
});

router.get("/users/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new ApiError(400, "Invalid user ID");
        }

        const userData = await userService.getUserById(id);
        if (userData === null) {
            throw new ApiError(404, "User not found");
        }

        res.status(200).send(userData);
    } catch (error) {
        next(error);
    }
});

export default router;
