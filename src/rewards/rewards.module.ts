import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { Redemption, RedemptionSchema } from './schemas/redemption.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Redemption.name, schema: RedemptionSchema },
    ]),
    UsersModule,
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
