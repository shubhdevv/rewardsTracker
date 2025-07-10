import { Model } from 'mongoose';
import { RewardDocument } from './schemas/reward.schema';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { RedemptionDocument } from './schemas/redemption.schema';
import { UsersService } from '../users/users.service';
import { RedeemPointsDto } from './dto/redeem-points.dto';
import { PaginationDto } from './dto/pagination.dto';
export declare class RewardsService {
    private rewardModel;
    private transactionModel;
    private redemptionModel;
    private usersService;
    constructor(rewardModel: Model<RewardDocument>, transactionModel: Model<TransactionDocument>, redemptionModel: Model<RedemptionDocument>, usersService: UsersService);
    getTotalPoints(userId: string): Promise<number>;
    getTransactions(userId: string, paginationDto: PaginationDto): Promise<{
        transactions: (import("mongoose").Document<unknown, {}, TransactionDocument, {}> & Transaction & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    redeemPoints(redeemPointsDto: RedeemPointsDto): Promise<{
        redemptionId: unknown;
        userId: string;
        pointsRedeemed: number;
        rewardType: string;
        remainingPoints: number;
        timestamp: Date;
    }>;
    getRewardOptions(): Promise<{
        type: string;
        name: string;
        description: string;
        minPoints: number;
        conversionRate: number;
        maxRedemption: number;
    }[]>;
    updateUserPoints(userId: string, pointsChange: number): Promise<void>;
    addTransaction(userId: string, amount: number, category: string, pointsEarned: number): Promise<Transaction>;
}
