import request from "supertest";
import express from "express";
import {faker} from "@faker-js/faker";
import userRoutes, { userService } from "../user.routes";
import {User} from "../../types";
import {UserModel} from "../../models/user.model";

const app = express();

app.use(express.json());
app.use(userRoutes);

const mockUser = () => {
    const user = {
        id: faker.number.int({min: 1, max: 10000}),
        name: faker.person.fullName(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        address: {
            street: faker.location.streetAddress(),
            suite: faker.location.secondaryAddress(),
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
            geo: {
                lat: faker.location.latitude().toString(),
                lng: faker.location.longitude().toString()
            }
        },
        phone: faker.phone.number(),
        website: faker.internet.url(),
        company: {
            name: faker.company.name(),
            catchPhrase: faker.company.catchPhrase(),
            bs: faker.word.words({ count: { min : 1, max: 5 } })
        }
    } as unknown as User;

    return new UserModel(user);
}

describe("User routes", () => {
   describe("GET /users", () => {
       it("should return a list of users", async () => {
              const users = [mockUser(), mockUser()];

              jest.spyOn(userService, "getAllUsers").mockImplementationOnce(() => Promise.resolve(users));

              const response = await request(app)
                .get(`/users`)
                .set("Accept", "application/json");

              expect(response.status).toBe(200);
              expect(response.body).toEqual(users);
       });
   });

    describe('GET /users/:id', () => {
        it('should return a user by id', async () => {
            const user = mockUser();

            jest.spyOn(userService, 'getUserById').mockImplementationOnce(() => Promise.resolve(user));

            const response = await request(app)
                .get(`/users/${user.id}`)
                .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(user);
        });

        it('should return 404 if user is not found', async () => {
            jest.spyOn(userService, 'getUserById').mockImplementationOnce(() => Promise.resolve(null));

            const response = await request(app)
                .get('/users/9999999999999')
                .set('Accept', 'application/json');

            expect(response.status).toBe(404);
        });

        it.skip('should return 400 if user id is not a number', async () => {
            const response = await request(app)
                .get('/users/abc')
                .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({message: 'Invalid user ID'});
        });
    });
});