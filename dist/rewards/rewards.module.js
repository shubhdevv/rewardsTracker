"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const rewards_controller_1 = require("./rewards.controller");
const rewards_service_1 = require("./rewards.service");
const reward_schema_1 = require("./schemas/reward.schema");
const transaction_schema_1 = require("./schemas/transaction.schema");
const redemption_schema_1 = require("./schemas/redemption.schema");
const users_module_1 = require("../users/users.module");
let RewardsModule = class RewardsModule {
};
exports.RewardsModule = RewardsModule;
exports.RewardsModule = RewardsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: reward_schema_1.Reward.name, schema: reward_schema_1.RewardSchema },
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: redemption_schema_1.Redemption.name, schema: redemption_schema_1.RedemptionSchema },
            ]),
            users_module_1.UsersModule,
        ],
        controllers: [rewards_controller_1.RewardsController],
        providers: [rewards_service_1.RewardsService],
    })
], RewardsModule);
//# sourceMappingURL=rewards.module.js.map