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
exports.CreatePaymentDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CardDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "4111111111111111" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CardDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "João Silva" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CardDto.prototype, "holderName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "123" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CardDto.prototype, "cvv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "12/2025" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CardDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CardDto.prototype, "installments", void 0);
class PaymentMethodDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "card" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CardDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CardDto),
    __metadata("design:type", CardDto)
], PaymentMethodDto.prototype, "card", void 0);
class CreatePaymentDto {
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "BRL" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Compra no e-commerce" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaymentMethodDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentMethodDto),
    __metadata("design:type", PaymentMethodDto)
], CreatePaymentDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=create-payment.dto.js.map