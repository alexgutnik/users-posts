import { User } from '../types';

export interface IUserService {
    getAllUsers(): Promise<User[]>;
    getUserById(id: Number): Promise<User|null>;
}
