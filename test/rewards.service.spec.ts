import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardsService } from '../src/rewards/rewards.service';
import { UsersService } from '../src/users/users.service';
import { Reward } from '../src/rewards/schemas/reward.schema';
import { Transaction } from '../src/rewards/schemas/transaction.schema';
import { Redemption } from '../src/rewards/schemas/redemption.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RewardsService', () => {
  let service: RewardsService;
  let rewardModel: Model<Reward>;
  let transactionModel: Model<Transaction>;
  let redemptionModel: Model<Redemption>;
  let usersService: UsersService;

  const mockRewardModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  const mockTransactionModel = {
    find: jest.fn(),
    countDocuments: jest.fn(),
    sort: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
    exec: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRedemptionModel = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUsersService = {
    userExists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        {
          provide: getModelToken(Reward.name),
          useValue: mockRewardModel,
        },
        {
          provide: getModelToken(Transaction.name),
          useValue: mockTransactionModel,
        },
        {
          provide: getModelToken(Redemption.name),
          useValue: mockRedemptionModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    rewardModel = module.get<Model<Reward>>(getModelToken(Reward.name));
    transactionModel = module.get<Model<Transaction>>(getModelToken(Transaction.name));
    redemptionModel = module.get<Model<Redemption>>(getModelToken(Redemption.name));
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTotalPoints', () => {
    it('should return total points for existing user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockReward = { userId, totalPoints: 1500 };

      mockUsersService.userExists.mockResolvedValue(true);
      mockRewardModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockReward),
      });

      const result = await service.getTotalPoints(userId);

      expect(result).toBe(1500);
      expect(mockUsersService.userExists).toHaveBeenCalledWith(userId);
      expect(mockRewardModel.findOne).toHaveBeenCalledWith({ userId });
    });

    it('should return 0 for user with no rewards', async () => {
      const userId = '507f1f77bcf86cd799439011';

      mockUsersService.userExists.mockResolvedValue(true);
      mockRewardModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.getTotalPoints(userId);

      expect(result).toBe(0);
    });

    it('should throw NotFoundException for non-existing user', async () => {
      const userId = '507f1f77bcf86cd799439011';

      mockUsersService.userExists.mockResolvedValue(false);

      await expect(service.getTotalPoints(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTransactions', () => {
    it('should return paginated transactions', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const paginationDto = { page: 1, limit: 5 };
      const mockTransactions = [
        { userId, amount: 100, category: 'shopping', pointsEarned: 10, timestamp: new Date() },
      ];

      mockUsersService.userExists.mockResolvedValue(true);
      
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockTransactions),
      };

      mockTransactionModel.find.mockReturnValue(mockQuery);
      mockTransactionModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.getTransactions(userId, paginationDto);

      expect(result.transactions).toEqual(mockTransactions);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(5);
    });
  });

  describe('redeemPoints', () => {
    it('should redeem points successfully', async () => {
      const redeemDto = {
        userId: '507f1f77bcf86cd799439011',
        pointsToRedeem: 500,
        rewardType: 'cashback',
      };

      const mockReward = { userId: redeemDto.userId, totalPoints: 1500, save: jest.fn() };
      const mockRedemption = { _id: '507f1f77bcf86cd799439012', ...redeemDto, timestamp: new Date(), save: jest.fn() };

      mockUsersService.userExists.mockResolvedValue(true);
      mockRewardModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockReward),
      });
      mockRedemptionModel.create = jest.fn().mockImplementation((data) => ({
        ...mockRedemption,
        ...data,
        save: jest.fn().mockResolvedValue(mockRedemption),
      }));

      // Mock the constructor behavior
      (mockRedemptionModel as any).mockImplementation = jest.fn().mockImplementation((data) => ({
        ...mockRedemption,
        ...data,
        save: jest.fn().mockResolvedValue(mockRedemption),
      }));

      const result = await service.redeemPoints(redeemDto);

      expect(result.pointsRedeemed).toBe(500);
      expect(result.rewardType).toBe('cashback');
      expect(result.remainingPoints).toBe(1000);
    });

    it('should throw BadRequestException for insufficient points', async () => {
      const redeemDto = {
        userId: '507f1f77bcf86cd799439011',
        pointsToRedeem: 5000,
        rewardType: 'cashback',
      };

      mockUsersService.userExists.mockResolvedValue(true);
      mockRewardModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ userId: redeemDto.userId, totalPoints: 1500 }),
      });

      await expect(service.redeemPoints(redeemDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid reward type', async () => {
      const redeemDto = {
        userId: '507f1f77bcf86cd799439011',
        pointsToRedeem: 500,
        rewardType: 'invalid_type',
      };

      mockUsersService.userExists.mockResolvedValue(true);

      await expect(service.redeemPoints(redeemDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getRewardOptions', () => {
    it('should return available reward options', async () => {
      const result = await service.getRewardOptions();

      expect(result).toHaveLength(4);
      expect(result[0].type).toBe('cashback');
      expect(result[1].type).toBe('voucher_amazon');
      expect(result[2].type).toBe('voucher_starbucks');
      expect(result[3].type).toBe('discount_coupon');
    });
  });
});
