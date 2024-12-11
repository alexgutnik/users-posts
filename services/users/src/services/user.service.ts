import { IUserService } from "../interfaces/userService.interface";
import { IUserRepository } from "../interfaces/userRepository.interface";
import { User } from '../types';


export class UserService implements IUserService {
    private _repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this._repository = repository
    }

    getAllUsers(): Promise<User[]> {
        return this._repository.getAllUsers();
    }

    getUserById(id: Number): Promise<User|null> {
        return this._repository.getUserById(id);
    }
}