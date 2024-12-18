import { UserModel } from "../user.model";
import { ValidationError } from "@sweetch/shared";
import { User } from "../../types";

describe('UserModel', () => {
    it('should create a valid user model', () => {
        const user: User = {
            id: 1,
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            phone: '123-456-7890',
            website: 'http://example.com',
            address: {
                street: '123 Main St',
                suite: 'Apt 1',
                city: 'Anytown',
                zipcode: '12345',
                geo: { lat: '0.0', lng: '0.0' }
            },
            company: {
                name: 'Example Inc.',
                catchPhrase: 'Exemplary service',
                bs: 'business stuff'
            }
        } as User;

        const userModel = new UserModel(user);

        expect(userModel).toBeInstanceOf(UserModel);
        expect(userModel.id).toBe(user.id);
        expect(userModel.name).toBe(user.name);
        expect(userModel.username).toBe(user.username);
        expect(userModel.email).toBe(user.email);
        expect(userModel.phone).toBe(user.phone);
        expect(userModel.website).toBe(user.website);
        expect(userModel.address).toEqual(user.address);
        expect(userModel.company).toEqual(user.company);
    });

    it('should throw ValidationError for invalid user data', () => {
        const invalidUser = {
            id: 'invalid_id',
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            phone: '123-456-7890',
            website: 'http://example.com'
        };

        expect(() => new UserModel(invalidUser as any)).toThrow(ValidationError);
    });

    it('should create a user model without optional fields', () => {
        const user: User = {
            id: 1,
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            phone: '123-456-7890',
            website: 'http://example.com'
        } as User;

        const userModel = new UserModel(user);

        expect(userModel).toBeInstanceOf(UserModel);
        expect(userModel.id).toBe(user.id);
        expect(userModel.name).toBe(user.name);
        expect(userModel.username).toBe(user.username);
        expect(userModel.email).toBe(user.email);
        expect(userModel.phone).toBe(user.phone);
        expect(userModel.website).toBe(user.website);
        expect(userModel.address).toBeUndefined();
        expect(userModel.company).toBeUndefined();
    });

    it('should validate a valid user', () => {
        const user: User = {
            id: 1,
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            phone: '123-456-7890',
            website: 'http://example.com'
        } as User;

        expect(UserModel.isValidUser(user)).toBe(true);
    });

    it('should invalidate an invalid user', () => {
        const invalidUser = {
            id: 'invalid_id',
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            phone: '123-456-7890',
            website: 'http://example.com'
        };

        expect(UserModel.isValidUser(invalidUser as any)).toBe(false);
    });
});