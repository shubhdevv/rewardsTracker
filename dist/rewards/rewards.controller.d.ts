import { RewardsService } from './rewards.service';
import { RedeemPointsDto } from './dto/redeem-points.dto';
import { PaginationDto } from './dto/pagination.dto';
export declare class RewardsController {
    private readonly rewardsService;
    constructor(rewardsService: RewardsService);
    getPoints(userId: string): Promise<{
        success: boolean;
        data: {
            userId: string;
            totalPoints: number;
            timestamp: string;
        };
    }>;
    getTransactions(userId: string, paginationDto: PaginationDto): Promise<{
        success: boolean;
        data: {
            transactions: (import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").TransactionDocument, {}> & import("./schemas/transaction.schema").Transaction & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
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
        };
    }>;
    redeemPoints(redeemPointsDto: RedeemPointsDto): Promise<{
        success: boolean;
        data: {
            redemptionId: unknown;
            userId: string;
            pointsRedeemed: number;
            rewardType: string;
            remainingPoints: number;
            timestamp: Date;
        };
    }>;
    getRewardOptions(): Promise<{
        success: boolean;
        data: {
            type: string;
            name: string;
            description: string;
            minPoints: number;
            conversionRate: number;
            maxRedemption: number;
        }[];
    }>;
}
