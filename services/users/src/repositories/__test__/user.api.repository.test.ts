import { UserApiRepository } from '../user.api.repository';
import { HttpClient, IHttpClient, ValidationError } from '@sweetch/shared';
import { UserModel } from '../../models/user.model';
import { User } from '../../types';

describe('UserApiRepository', () => {
    let httpClient: IHttpClient;
    let userApiRepository: UserApiRepository;

    beforeEach(() => {
        httpClient = new HttpClient();
    });

    afterEach(() => {
        httpClient = {} as IHttpClient;
    });

    it('should return all users', async () => {
        const users: User[] = [
            { id: 1, name: 'John Doe', username: 'johndoe', email: 'john@example.com', phone: '123-456-7890', website: 'http://example.com', address: { street: '123 Main St', suite: 'Apt 1', city: 'Anytown', zipcode: '12345', geo: { lat: '0.0', lng: '0.0' } }, company: { name: 'Example Inc.', catchPhrase: 'Exemplary service', bs: 'business stuff' } },
            { id: 2, name: 'Jane Doe', username: 'janedoe', email: 'jane@example.com', phone: '123-456-7890', website: 'http://example.com', address: { street: '456 Main St', suite: 'Apt 2', city: 'Anytown', zipcode: '12345', geo: { lat: '0.0', lng: '0.0' } }, company: { name: 'Example Inc.', catchPhrase: 'Exemplary service', bs: 'business stuff' } }
        ];

        userApiRepository = new UserApiRepository(httpClient);
        jest.spyOn(httpClient, 'get').mockImplementationOnce(() => Promise.resolve(users));

        const result = await userApiRepository.getAllUsers();

        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(UserModel);
        expect(result[1]).toBeInstanceOf(UserModel);
    });

    it('should throw ValidationError if users data is invalid', async () => {
        userApiRepository = new UserApiRepository(httpClient);
        jest.spyOn(httpClient, 'get').mockImplementationOnce(() => Promise.reject(new ValidationError('Invalid User data')));

        await expect(userApiRepository.getAllUsers()).rejects.toThrow(ValidationError);
    });

    it('should return a user by id', async () => {
        const user: User = { id: 1, name: 'John Doe', username: 'johndoe', email: 'john@example.com', phone: '123-456-7890', website: 'http://example.com', address: { street: '123 Main St', suite: 'Apt 1', city: 'Anytown', zipcode: '12345', geo: { lat: '0.0', lng: '0.0' } }, company: { name: 'Example Inc.', catchPhrase: 'Exemplary service', bs: 'business stuff' } };
        userApiRepository = new UserApiRepository(httpClient);
        jest.spyOn(httpClient, 'get').mockImplementationOnce(() => Promise.resolve(user));

        const result = await userApiRepository.getUserById(1);

        expect(result).toBeInstanceOf(UserModel);
        expect(result?.id).toBe(user.id);
    });

    it('should return null if user is not found', async () => {
        userApiRepository = new UserApiRepository(httpClient);
        jest.spyOn(httpClient, 'get').mockImplementationOnce(() => Promise.resolve(null));

        const result = await userApiRepository.getUserById(1);

        expect(result).toBeNull();
    });
});