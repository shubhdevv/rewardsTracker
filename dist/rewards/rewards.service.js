"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reward_schema_1 = require("./schemas/reward.schema");
const transaction_schema_1 = require("./schemas/transaction.schema");
const redemption_schema_1 = require("./schemas/redemption.schema");
const users_service_1 = require("../users/users.service");
let RewardsService = class RewardsService {
    constructor(rewardModel, transactionModel, redemptionModel, usersService) {
        this.rewardModel = rewardModel;
        this.transactionModel = transactionModel;
        this.redemptionModel = redemptionModel;
        this.usersService = usersService;
    }
    async getTotalPoints(userId) {
        const userExists = await this.usersService.userExists(userId);
        if (!userExists) {
            throw new common_1.NotFoundException('User not found');
        }
        const reward = await this.rewardModel.findOne({ userId }).exec();
        return reward ? reward.totalPoints : 0;
    }
    async getTransactions(userId, paginationDto) {
        const userExists = await this.usersService.userExists(userId);
        if (!userExists) {
            throw new common_1.NotFoundException('User not found');
        }
        const { page = 1, limit = 5 } = paginationDto;
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            this.transactionModel
                .find({ userId })
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.transactionModel.countDocuments({ userId }).exec(),
        ]);
        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        };
    }
    async redeemPoints(redeemPointsDto) {
        const { userId, pointsToRedeem, rewardType } = redeemPointsDto;
        const userExists = await this.usersService.userExists(userId);
        if (!userExists) {
            throw new common_1.NotFoundException('User not found');
        }
        const rewardOptions = await this.getRewardOptions();
        const selectedOption = rewardOptions.find(option => option.type === rewardType);
        if (!selectedOption) {
            throw new common_1.BadRequestException('Invalid reward type');
        }
        const currentPoints = await this.getTotalPoints(userId);
        if (currentPoints < pointsToRedeem) {
            throw new common_1.BadRequestException(`Insufficient points. Available: ${currentPoints}, Required: ${pointsToRedeem}`);
        }
        if (pointsToRedeem < selectedOption.minPoints) {
            throw new common_1.BadRequestException(`Minimum redemption for ${rewardType} is ${selectedOption.minPoints} points`);
        }
        const redemption = new this.redemptionModel({
            userId,
            pointsRedeemed: pointsToRedeem,
            rewardType,
            timestamp: new Date(),
        });
        await this.updateUserPoints(userId, -pointsToRedeem);
        await redemption.save();
        return {
            redemptionId: redemption._id,
            userId,
            pointsRedeemed: pointsToRedeem,
            rewardType,
            remainingPoints: currentPoints - pointsToRedeem,
            timestamp: redemption.timestamp,
        };
    }
    async getRewardOptions() {
        return [
            {
                type: 'cashback',
                name: 'Cashback',
                description: 'Convert points to cash rewards',
                minPoints: 100,
                conversionRate: 0.01,
                maxRedemption: 10000,
            },
            {
                type: 'voucher_amazon',
                name: 'Amazon Gift Card',
                description: 'Amazon shopping voucher',
                minPoints: 500,
                conversionRate: 0.01,
                maxRedemption: 5000,
            },
            {
                type: 'voucher_starbucks',
                name: 'Starbucks Gift Card',
                description: 'Starbucks coffee voucher',
                minPoints: 250,
                conversionRate: 0.01,
                maxRedemption: 2500,
            },
            {
                type: 'discount_coupon',
                name: 'Discount Coupon',
                description: 'Platform discount coupon',
                minPoints: 50,
                conversionRate: 0.02,
                maxRedemption: 1000,
            },
        ];
    }
    async updateUserPoints(userId, pointsChange) {
        const existingReward = await this.rewardModel.findOne({ userId }).exec();
        if (existingReward) {
            existingReward.totalPoints += pointsChange;
            existingReward.updatedAt = new Date();
            await existingReward.save();
        }
        else {
            const newReward = new this.rewardModel({
                userId,
                totalPoints: Math.max(0, pointsChange),
                updatedAt: new Date(),
            });
            await newReward.save();
        }
    }
    async addTransaction(userId, amount, category, pointsEarned) {
        const transaction = new this.transactionModel({
            userId,
            amount,
            category,
            pointsEarned,
            timestamp: new Date(),
        });
        await transaction.save();
        await this.updateUserPoints(userId, pointsEarned);
        return transaction;
    }
};
exports.RewardsService = RewardsService;
exports.RewardsService = RewardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reward_schema_1.Reward.name)),
    __param(1, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(2, (0, mongoose_1.InjectModel)(redemption_schema_1.Redemption.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService])
], RewardsService);
//# sourceMappingURL=rewards.service.js.map