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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemPointsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RedeemPointsDto {
}
exports.RedeemPointsDto = RedeemPointsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID requesting redemption',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RedeemPointsDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of points to redeem',
        example: 500,
        minimum: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Points to redeem must be at least 1' }),
    __metadata("design:type", Number)
], RedeemPointsDto.prototype, "pointsToRedeem", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of reward to redeem',
        example: 'cashback',
        enum: ['cashback', 'voucher_amazon', 'voucher_starbucks', 'discount_coupon']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['cashback', 'voucher_amazon', 'voucher_starbucks', 'discount_coupon'], {
        message: 'Invalid reward type'
    }),
    __metadata("design:type", String)
], RedeemPointsDto.prototype, "rewardType", void 0);
//# sourceMappingURL=redeem-points.dto.js.map