import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findById(userId: string): Promise<User | null> {
    try {
      return this.userModel.findById(userId).exec();
    } catch (error) {
      return null;
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async userExists(userId: string): Promise<boolean> {
    try {
      const user = await this.userModel.findById(userId).exec();
      return !!user;
    } catch (error) {
      return false;
    }
  }
}
