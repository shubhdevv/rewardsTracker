import { IsString, IsNumber, IsNotEmpty, Min, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RedeemPointsDto {
  @ApiProperty({ 
    description: 'User ID requesting redemption',
    example: '507f1f77bcf86cd799439011'
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ 
    description: 'Number of points to redeem',
    example: 500,
    minimum: 1
  })
  @IsNumber()
  @Min(1, { message: 'Points to redeem must be at least 1' })
  pointsToRedeem: number;

  @ApiProperty({ 
    description: 'Type of reward to redeem',
    example: 'cashback',
    enum: ['cashback', 'voucher_amazon', 'voucher_starbucks', 'discount_coupon']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['cashback', 'voucher_amazon', 'voucher_starbucks', 'discount_coupon'], {
    message: 'Invalid reward type'
  })
  rewardType: string;
}
