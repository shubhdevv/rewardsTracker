import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { RewardsModule } from './rewards/rewards.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    RewardsModule,
    SeedModule,
  ],
})
export class AppModule {}
