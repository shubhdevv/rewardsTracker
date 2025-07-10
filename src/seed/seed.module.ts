import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Reward, RewardSchema } from '../rewards/schemas/reward.schema';
import { Transaction, TransactionSchema } from '../rewards/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
