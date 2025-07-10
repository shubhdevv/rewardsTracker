import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Reward, RewardDocument } from '../rewards/schemas/reward.schema';
import { Transaction, TransactionDocument } from '../rewards/schemas/transaction.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  async seedData() {
    // Check if data already exists
    const existingUsers = await this.userModel.countDocuments();
    if (existingUsers > 0) {
      console.log('Seed data already exists, skipping...');
      return;
    }

    console.log('Seeding initial data...');

    // Create mock users
    const users = await this.userModel.insertMany([
      { name: 'John Doe', email: 'john.doe@example.com' },
      { name: 'Jane Smith', email: 'jane.smith@example.com' },
      { name: 'Bob Johnson', email: 'bob.johnson@example.com' },
    ]);

    // Create initial rewards
    const rewards = await this.rewardModel.insertMany([
      { userId: users[0]._id, totalPoints: 1500, updatedAt: new Date() },
      { userId: users[1]._id, totalPoints: 2300, updatedAt: new Date() },
      { userId: users[2]._id, totalPoints: 800, updatedAt: new Date() },
    ]);

    // Create sample transactions
    const transactions = [];
    const categories = ['shopping', 'dining', 'travel', 'entertainment', 'groceries'];
    
    for (const user of users) {
      for (let i = 0; i < 10; i++) {
        const amount = Math.floor(Math.random() * 500) + 50;
        const pointsEarned = Math.floor(amount * 0.1); // 10% of amount as points
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        transactions.push({
          userId: user._id,
          amount,
          category,
          pointsEarned,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        });
      }
    }

    await this.transactionModel.insertMany(transactions);

    console.log('Seed data created successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${rewards.length} reward records`);
    console.log(`Created ${transactions.length} transactions`);
  }
}
