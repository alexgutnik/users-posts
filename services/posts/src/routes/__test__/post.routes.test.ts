import request from "supertest";
import express from "express";
import {faker} from "@faker-js/faker";
import postRoutes, { postService } from "../post.routes";
import {PostService} from "../../services/post.service";
import {Post} from "../../types";

const app = express();

app.use(express.json());
app.use(postRoutes);

const mockPosts = () => {
    const userId = faker.number.int({min: 1, max: 10000});

    return [
        {
            userId: userId,
            id: faker.number.int({min: 1, max: 10000}),
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph()
        },
        {
            userId: userId,
            id: faker.number.int({min: 1, max: 10000}),
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph()
        }
    ] as unknown as Post[];
}

describe("Post routes", () => {
   describe("GET /users/:id/posts", () => {
       it("should return a list of posts by user id", async () => {
              const posts = mockPosts();

              console.log(posts);

              jest.spyOn(postService, "getUserPosts").mockImplementationOnce(() => Promise.resolve(posts));

              const response = await request(app)
                .get(`/users/${posts[0].userId}/posts`)
                .set("Accept", "application/json");

              expect(response.status).toBe(200);
              expect(response.body).toEqual(posts);
       });

       it("should return an empty array for unknown user id", async () => {
              jest.spyOn(postService, "getUserPosts").mockImplementationOnce(() => Promise.resolve([]));

              const response = await request(app)
                .get(`/users/9999999999999/posts`)
                .set("Accept", "application/json");

              expect(response.status).toBe(200);
              expect(response.body).toEqual([]);
       });
   });
});