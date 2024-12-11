import { faker } from "@faker-js/faker";
import {IUserRepository} from "../../interfaces/userRepository.interface";
import {IUserService} from "../../interfaces/userService.interface";
import {UserService} from "../user.service";
import {MockUserRepository} from "../../repositories/mock.user.repository";
import {UserModel} from "../../models/user.model";
import {User} from "../../types";

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

describe("UserService", () => {
    let userRepository: IUserRepository;
    let userService: IUserService;

    beforeEach(() => {
        userRepository = new MockUserRepository();
    });

    afterEach(() => {
        userRepository = {} as IUserRepository;
    });

    it("should return all users", async () => {
        const users = [mockUser(), mockUser()];
        userService = new UserService(userRepository);

        jest.spyOn(userRepository, "getAllUsers")
            .mockImplementationOnce(() => Promise.resolve(users as UserModel[]));

        const result = await userService.getAllUsers();

        expect(result).toEqual(users);
        expect(userRepository.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it("should return a user by id", async () => {
        const user = mockUser();
        userService = new UserService(userRepository);

        jest.spyOn(userRepository, "getUserById")
            .mockImplementationOnce(() => Promise.resolve(user as UserModel));

        const result = await userService.getUserById(user.id);

        expect(result).toMatchObject(user);
        expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
        expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    });

    it("should return null if user is not found", async () => {
        const user = mockUser();
        userService = new UserService(userRepository);

        jest.spyOn(userRepository, "getUserById")
            .mockImplementationOnce(() => Promise.resolve(null));

        const result = await userService.getUserById(user.id);

        expect(result).toBeNull();
        expect(userRepository.getUserById).toHaveBeenCalledTimes(1);
        expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    });
});