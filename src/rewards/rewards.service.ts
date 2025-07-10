import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { Redemption, RedemptionDocument } from './schemas/redemption.schema';
import { UsersService } from '../users/users.service';
import { RedeemPointsDto } from './dto/redeem-points.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Redemption.name) private redemptionModel: Model<RedemptionDocument>,
    private usersService: UsersService,
  ) {}

  async getTotalPoints(userId: string): Promise<number> {
    // Validate user exists
    const userExists = await this.usersService.userExists(userId);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const reward = await this.rewardModel.findOne({ userId }).exec();
    return reward ? reward.totalPoints : 0;
  }

  async getTransactions(userId: string, paginationDto: PaginationDto) {
    // Validate user exists
    const userExists = await this.usersService.userExists(userId);
    if (!userExists) {
      throw new NotFoundException('User not found');
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

  async redeemPoints(redeemPointsDto: RedeemPointsDto) {
    const { userId, pointsToRedeem, rewardType } = redeemPointsDto;

    // Validate user exists
    const userExists = await this.usersService.userExists(userId);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    // Validate reward option exists
    const rewardOptions = await this.getRewardOptions();
    const selectedOption = rewardOptions.find(option => option.type === rewardType);
    if (!selectedOption) {
      throw new BadRequestException('Invalid reward type');
    }

    // Check if user has enough points
    const currentPoints = await this.getTotalPoints(userId);
    if (currentPoints < pointsToRedeem) {
      throw new BadRequestException(
        `Insufficient points. Available: ${currentPoints}, Required: ${pointsToRedeem}`
      );
    }

    // Validate minimum redemption amount
    if (pointsToRedeem < selectedOption.minPoints) {
      throw new BadRequestException(
        `Minimum redemption for ${rewardType} is ${selectedOption.minPoints} points`
      );
    }

    // Create redemption record
    const redemption = new this.redemptionModel({
      userId,
      pointsRedeemed: pointsToRedeem,
      rewardType,
      timestamp: new Date(),
    });

    // Update user's total points
    await this.updateUserPoints(userId, -pointsToRedeem);

    // Save redemption
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
        conversionRate: 0.01, // 1 point = $0.01
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

  async updateUserPoints(userId: string, pointsChange: number): Promise<void> {
    const existingReward = await this.rewardModel.findOne({ userId }).exec();

    if (existingReward) {
      existingReward.totalPoints += pointsChange;
      existingReward.updatedAt = new Date();
      await existingReward.save();
    } else {
      // Create new reward record if it doesn't exist
      const newReward = new this.rewardModel({
        userId,
        totalPoints: Math.max(0, pointsChange),
        updatedAt: new Date(),
      });
      await newReward.save();
    }
  }

  async addTransaction(userId: string, amount: number, category: string, pointsEarned: number): Promise<Transaction> {
    const transaction = new this.transactionModel({
      userId,
      amount,
      category,
      pointsEarned,
      timestamp: new Date(),
    });

    await transaction.save();
    
    // Update user's total points
    await this.updateUserPoints(userId, pointsEarned);

    return transaction;
  }
}
