import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findById(userId: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
    userExists(userId: string): Promise<boolean>;
}
