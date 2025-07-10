import { Controller, Get, Post, Body, Query, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { RedeemPointsDto } from './dto/redeem-points.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ApiResponseDecorator } from '../common/decorators/api-response.decorator';

@ApiTags('rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('points')
  @ApiOperation({ summary: 'Get total reward points for a user' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Total points retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponseDecorator()
  async getPoints(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const points = await this.rewardsService.getTotalPoints(userId);
    return {
      success: true,
      data: {
        userId,
        totalPoints: points,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history with pagination' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: 'Items per page', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponseDecorator()
  async getTransactions(
    @Query('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const paginationDto = new PaginationDto();
    if (page !== undefined) paginationDto.page = page;
    if (limit !== undefined) paginationDto.limit = limit;

    const result = await this.rewardsService.getTransactions(userId, paginationDto);
    return {
      success: true,
      data: result,
    };
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem reward points' })
  @ApiResponse({ status: 200, description: 'Points redeemed successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient points or invalid request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponseDecorator()
  async redeemPoints(@Body() redeemPointsDto: RedeemPointsDto) {
    const result = await this.rewardsService.redeemPoints(redeemPointsDto);
    return {
      success: true,
      data: result,
    };
  }

  @Get('options')
  @ApiOperation({ summary: 'Get available reward options' })
  @ApiResponse({ status: 200, description: 'Reward options retrieved successfully' })
  @ApiResponseDecorator()
  async getRewardOptions() {
    const options = await this.rewardsService.getRewardOptions();
    return {
      success: true,
      data: options,
    };
  }
}
