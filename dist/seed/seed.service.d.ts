import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { RewardDocument } from '../rewards/schemas/reward.schema';
import { TransactionDocument } from '../rewards/schemas/transaction.schema';
export declare class SeedService implements OnModuleInit {
    private userModel;
    private rewardModel;
    private transactionModel;
    constructor(userModel: Model<UserDocument>, rewardModel: Model<RewardDocument>, transactionModel: Model<TransactionDocument>);
    onModuleInit(): Promise<void>;
    seedData(): Promise<void>;
}
