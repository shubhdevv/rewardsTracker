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
exports.RewardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rewards_service_1 = require("./rewards.service");
const redeem_points_dto_1 = require("./dto/redeem-points.dto");
const pagination_dto_1 = require("./dto/pagination.dto");
const api_response_decorator_1 = require("../common/decorators/api-response.decorator");
let RewardsController = class RewardsController {
    constructor(rewardsService) {
        this.rewardsService = rewardsService;
    }
    async getPoints(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required');
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
    async getTransactions(userId, paginationDto) {
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required');
        }
        const result = await this.rewardsService.getTransactions(userId, paginationDto);
        return {
            success: true,
            data: result,
        };
    }
    async redeemPoints(redeemPointsDto) {
        const result = await this.rewardsService.redeemPoints(redeemPointsDto);
        return {
            success: true,
            data: result,
        };
    }
    async getRewardOptions() {
        const options = await this.rewardsService.getRewardOptions();
        return {
            success: true,
            data: options,
        };
    }
};
exports.RewardsController = RewardsController;
__decorate([
    (0, common_1.Get)('points'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total reward points for a user' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', description: 'User ID', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Total points retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, api_response_decorator_1.ApiResponseDecorator)(),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RewardsController.prototype, "getPoints", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', description: 'User ID', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'page', description: 'Page number', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Items per page', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transactions retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, api_response_decorator_1.ApiResponseDecorator)(),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], RewardsController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Post)('redeem'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem reward points' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Points redeemed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient points or invalid request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, api_response_decorator_1.ApiResponseDecorator)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [redeem_points_dto_1.RedeemPointsDto]),
    __metadata("design:returntype", Promise)
], RewardsController.prototype, "redeemPoints", null);
__decorate([
    (0, common_1.Get)('options'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available reward options' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reward options retrieved successfully' }),
    (0, api_response_decorator_1.ApiResponseDecorator)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RewardsController.prototype, "getRewardOptions", null);
exports.RewardsController = RewardsController = __decorate([
    (0, swagger_1.ApiTags)('rewards'),
    (0, common_1.Controller)('rewards'),
    __metadata("design:paramtypes", [rewards_service_1.RewardsService])
], RewardsController);
//# sourceMappingURL=rewards.controller.js.map