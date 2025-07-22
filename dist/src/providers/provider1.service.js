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
var Provider1Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider1Service = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
let Provider1Service = Provider1Service_1 = class Provider1Service {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(Provider1Service_1.name);
        this.baseUrl = "https://run.mocky.io/v3";
    }
    getName() {
        return "Provider1";
    }
    async processPayment(paymentData) {
        try {
            const requestData = {
                amount: paymentData.amount,
                currency: paymentData.currency,
                description: paymentData.description,
                paymentMethod: {
                    type: paymentData.paymentMethod.type,
                    card: {
                        number: paymentData.paymentMethod.card.number,
                        holderName: paymentData.paymentMethod.card.holderName,
                        cvv: paymentData.paymentMethod.card.cvv,
                        expirationDate: paymentData.paymentMethod.card.expirationDate,
                        installments: paymentData.paymentMethod.card.installments,
                    },
                },
            };
            const mockResponse = {
                id: this.generateUuid(),
                createdAt: new Date().toISOString().split("T")[0],
                status: Math.random() > 0.1 ? "authorized" : "failed",
                originalAmount: paymentData.amount,
                currentAmount: paymentData.amount,
                currency: paymentData.currency,
                description: paymentData.description,
                paymentMethod: "card",
                cardId: this.generateUuid(),
            };
            if (mockResponse.status === "failed") {
                throw new Error("Payment failed by provider");
            }
            this.logger.log(`Provider1 - Pagamento processado: ${mockResponse.id}`);
            return mockResponse;
        }
        catch (error) {
            this.logger.error(`Provider1 - Erro no processamento: ${error.message}`);
            throw new common_1.HttpException(`Provider1 falhou: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async processRefund(paymentId, refundData) {
        try {
            const mockResponse = {
                id: paymentId,
                createdAt: new Date().toISOString().split("T")[0],
                status: "refunded",
                originalAmount: refundData.amount * 2,
                currentAmount: refundData.amount,
                currency: "BRL",
                description: "Refund processed",
                paymentMethod: "card",
                cardId: this.generateUuid(),
            };
            this.logger.log(`Provider1 - Estorno processado: ${paymentId}`);
            return mockResponse;
        }
        catch (error) {
            this.logger.error(`Provider1 - Erro no estorno: ${error.message}`);
            throw new common_1.HttpException(`Provider1 refund falhou: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async getPayment(paymentId) {
        try {
            const mockResponse = {
                id: paymentId,
                createdAt: new Date().toISOString().split("T")[0],
                status: "authorized",
                originalAmount: 10000,
                currentAmount: 10000,
                currency: "BRL",
                description: "Payment retrieved",
                paymentMethod: "card",
                cardId: this.generateUuid(),
            };
            this.logger.log(`Provider1 - Consulta realizada: ${paymentId}`);
            return mockResponse;
        }
        catch (error) {
            this.logger.error(`Provider1 - Erro na consulta: ${error.message}`);
            throw new common_1.HttpException(`Provider1 consulta falhou: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    generateUuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
};
exports.Provider1Service = Provider1Service;
exports.Provider1Service = Provider1Service = Provider1Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], Provider1Service);
//# sourceMappingURL=provider1.service.js.map