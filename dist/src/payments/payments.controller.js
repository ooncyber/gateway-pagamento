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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const create_refund_dto_1 = require("./dto/create-refund.dto");
const payment_response_dto_1 = require("./dto/payment-response.dto");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createPayment(createPaymentDto) {
        try {
            return await this.paymentsService.processPayment(createPaymentDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Erro interno do servidor", error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createRefund(paymentId, createRefundDto) {
        try {
            return await this.paymentsService.processRefund(paymentId, createRefundDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || "Erro interno do servidor", error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPayment(paymentId) {
        try {
            return await this.paymentsService.getPayment(paymentId);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Erro interno do servidor', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Processar um pagamento" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Pagamento processado com sucesso",
        type: payment_response_dto_1.PaymentResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)("refunds/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Realizar estorno de um pagamento" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Estorno processado com sucesso",
        type: payment_response_dto_1.PaymentResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_refund_dto_1.CreateRefundDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createRefund", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter informações de uma transação' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transação encontrada',
        type: payment_response_dto_1.PaymentResponseDto
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)("payments"),
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map