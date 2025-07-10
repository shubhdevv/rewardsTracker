import { Test, TestingModule } from '@nestjs/testing';
import { RewardsController } from '../src/rewards/rewards.controller';
import { RewardsService } from '../src/rewards/rewards.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RewardsController', () => {
  let controller: RewardsController;
  let service: RewardsService;

  const mockRewardsService = {
    getTotalPoints: jest.fn(),
    getTransactions: jest.fn(),
    redeemPoints: jest.fn(),
    getRewardOptions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardsController],
      providers: [
        {
          provide: RewardsService,
          useValue: mockRewardsService,
        },
      ],
    }).compile();

    controller = module.get<RewardsController>(RewardsController);
    service = module.get<RewardsService>(RewardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPoints', () => {
    it('should return total points for a valid user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const totalPoints = 1500;
      
      mockRewardsService.getTotalPoints.mockResolvedValue(totalPoints);

      const result = await controller.getPoints(userId);

      expect(result.success).toBe(true);
      expect(result.data.totalPoints).toBe(totalPoints);
      expect(result.data.userId).toBe(userId);
      expect(service.getTotalPoints).toHaveBeenCalledWith(userId);
    });

    it('should throw BadRequestException if userId is not provided', async () => {
      await expect(controller.getPoints('')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = '507f1f77bcf86cd799439011';
      
      mockRewardsService.getTotalPoints.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.getPoints(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTransactions', () => {
    it('should return transactions with pagination', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const paginationDto = { page: 1, limit: 5 };
      const mockTransactions = {
        transactions: [
          { userId, amount: 100, category: 'shopping', pointsEarned: 10, timestamp: new Date() },
        ],
        pagination: { page: 1, limit: 5, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
      };

      mockRewardsService.getTransactions.mockResolvedValue(mockTransactions);

      const result = await controller.getTransactions(userId, paginationDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTransactions);
      expect(service.getTransactions).toHaveBeenCalledWith(userId, paginationDto);
    });

    it('should throw BadRequestException if userId is not provided', async () => {
      await expect(controller.getTransactions('', { page: 1, limit: 5 })).rejects.toThrow(BadRequestException);
    });
  });

  describe('redeemPoints', () => {
    it('should redeem points successfully', async () => {
      const redeemDto = {
        userId: '507f1f77bcf86cd799439011',
        pointsToRedeem: 500,
        rewardType: 'cashback',
      };
      
      const mockRedemption = {
        redemptionId: '507f1f77bcf86cd799439012',
        userId: redeemDto.userId,
        pointsRedeemed: redeemDto.pointsToRedeem,
        rewardType: redeemDto.rewardType,
        remainingPoints: 1000,
        timestamp: new Date(),
      };

      mockRewardsService.redeemPoints.mockResolvedValue(mockRedemption);

      const result = await controller.redeemPoints(redeemDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockRedemption);
      expect(service.redeemPoints).toHaveBeenCalledWith(redeemDto);
    });

    it('should throw BadRequestException for insufficient points', async () => {
      const redeemDto = {
        userId: '507f1f77bcf86cd799439011',
        pointsToRedeem: 5000,
        rewardType: 'cashback',
      };

      mockRewardsService.redeemPoints.mockRejectedValue(
        new BadRequestException('Insufficient points. Available: 1500, Required: 5000')
      );

      await expect(controller.redeemPoints(redeemDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getRewardOptions', () => {
    it('should return available reward options', async () => {
      const mockOptions = [
        {
          type: 'cashback',
          name: 'Cashback',
          description: 'Convert points to cash rewards',
          minPoints: 100,
          conversionRate: 0.01,
          maxRedemption: 10000,
        },
      ];

      mockRewardsService.getRewardOptions.mockResolvedValue(mockOptions);

      const result = await controller.getRewardOptions();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockOptions);
      expect(service.getRewardOptions).toHaveBeenCalled();
    });
  });
});
