import express, { Request, Response, NextFunction} from "express";
import { UserService } from "../services/user.service";
import { UserApiRepository } from "../repositories/user.api.repository";
import { HttpClient } from "shared/utils/httpClient";

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
            res.status(400).send({ message: "Invalid user ID" });
            return next();
        }

        const userData = await userService.getUserById(id);
        if (userData === null) {
            res.status(404);
            return next();
        }

        res.status(200).send(userData);
    } catch (error) {
        next(error);
    }
});

export default router;
