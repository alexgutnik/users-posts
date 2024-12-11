import {User} from "../types";
import {UserModel} from "../models/user.model";

const mockUsers: User[] = [
    {id: 1, name: "John Doe", username: "johndoe", email: "john@doe.com", address: {street: "1234 Elm St", suite: "Apt 123", city: "Springfield", zipcode: "12345", geo: {lat: "12", lng: "13"},}, phone: "1234567890", website: "johndoe.com", company: {name: "John Doe Inc", catchPhrase: "Hello World", bs: "BS"}},
    {id: 2, name: "Jane Doe", username: "janedoe", email: "jane@doe.com", address: {street: "1234 Elm St", suite: "Apt 123", city: "Springfield", zipcode: "12345", geo: {lat: "12", lng: "13"},}, phone: "1234567890", website: "janedoe.com", company: {name: "Jane Doe Inc", catchPhrase: "Hello World", bs: "BS"}}
];

export class MockUserRepository {
    async getAllUsers(): Promise<UserModel[]> {
        return mockUsers;
    }

    async getUserById(id: Number): Promise<UserModel|null> {
        return mockUsers.find(user => user.id === id) || null;
    }
}