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
exports.RedemptionSchema = exports.Redemption = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Redemption = class Redemption {
};
exports.Redemption = Redemption;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Redemption.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Redemption.prototype, "pointsRedeemed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Redemption.prototype, "rewardType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Redemption.prototype, "timestamp", void 0);
exports.Redemption = Redemption = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Redemption);
exports.RedemptionSchema = mongoose_1.SchemaFactory.createForClass(Redemption);
exports.RedemptionSchema.index({ userId: 1, timestamp: -1 });
exports.RedemptionSchema.index({ rewardType: 1 });
//# sourceMappingURL=redemption.schema.js.map