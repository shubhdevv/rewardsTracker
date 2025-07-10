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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const reward_schema_1 = require("../rewards/schemas/reward.schema");
const transaction_schema_1 = require("../rewards/schemas/transaction.schema");
let SeedService = class SeedService {
    constructor(userModel, rewardModel, transactionModel) {
        this.userModel = userModel;
        this.rewardModel = rewardModel;
        this.transactionModel = transactionModel;
    }
    async onModuleInit() {
        await this.seedData();
    }
    async seedData() {
        const existingUsers = await this.userModel.countDocuments();
        if (existingUsers > 0) {
            console.log('Seed data already exists, skipping...');
            return;
        }
        console.log('Seeding initial data...');
        const users = await this.userModel.insertMany([
            { name: 'John Doe', email: 'john.doe@example.com' },
            { name: 'Jane Smith', email: 'jane.smith@example.com' },
            { name: 'Bob Johnson', email: 'bob.johnson@example.com' },
        ]);
        const rewards = await this.rewardModel.insertMany([
            { userId: users[0]._id, totalPoints: 1500, updatedAt: new Date() },
            { userId: users[1]._id, totalPoints: 2300, updatedAt: new Date() },
            { userId: users[2]._id, totalPoints: 800, updatedAt: new Date() },
        ]);
        const transactions = [];
        const categories = ['shopping', 'dining', 'travel', 'entertainment', 'groceries'];
        for (const user of users) {
            for (let i = 0; i < 10; i++) {
                const amount = Math.floor(Math.random() * 500) + 50;
                const pointsEarned = Math.floor(amount * 0.1);
                const category = categories[Math.floor(Math.random() * categories.length)];
                transactions.push({
                    userId: user._id,
                    amount,
                    category,
                    pointsEarned,
                    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                });
            }
        }
        await this.transactionModel.insertMany(transactions);
        console.log('Seed data created successfully!');
        console.log(`Created ${users.length} users`);
        console.log(`Created ${rewards.length} reward records`);
        console.log(`Created ${transactions.length} transactions`);
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(reward_schema_1.Reward.name)),
    __param(2, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SeedService);
//# sourceMappingURL=seed.service.js.map