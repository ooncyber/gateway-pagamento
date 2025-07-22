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
var Provider2Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider2Service = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
let Provider2Service = Provider2Service_1 = class Provider2Service {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(Provider2Service_1.name);
        this.baseUrl = "https://run.mocky.io/v3";
    }
    getName() {
        return "Provider2";
    }
    async processPayment(paymentData) {
        try {
            const requestData = {
                amount: paymentData.amount,
                currency: paymentData.currency,
                statementDescriptor: paymentData.description,
                paymentType: "card",
                card: {
                    number: paymentData.paymentMethod.card.number,
                    holder: paymentData.paymentMethod.card.holderName,
                    cvv: paymentData.paymentMethod.card.cvv,
                    expiration: this.convertExpirationDate(paymentData.paymentMethod.card.expirationDate),
                    installmentNumber: paymentData.paymentMethod.card.installments,
                },
            };
            const mockResponse = {
                id: this.generateUuid(),
                date: new Date().toISOString().split("T")[0],
                status: Math.random() > 0.15 ? "paid" : "failed",
                amount: paymentData.amount,
                originalAmount: paymentData.amount,
                currency: paymentData.currency,
                statementDescriptor: paymentData.description,
                paymentType: "card",
                cardId: this.generateUuid(),
            };
            if (mockResponse.status === "failed") {
                throw new Error("Transaction failed by provider");
            }
            const normalizedResponse = {
                id: mockResponse.id,
                createdAt: mockResponse.date,
                status: this.normalizeStatus(mockResponse.status),
                originalAmount: mockResponse.originalAmount,
                currentAmount: mockResponse.amount,
                currency: mockResponse.currency,
                description: mockResponse.statementDescriptor,
                paymentMethod: mockResponse.paymentType,
                cardId: mockResponse.cardId,
            };
            this.logger.log(`Provider2 - Pagamento processado: ${normalizedResponse.id}`);
            return normalizedResponse;
        }
        catch (error) {
            this.logger.error(`Provider2 - Erro no processamento: ${error.message}`);
            throw new common_1.HttpException(`Provider2 falhou: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async processRefund(paymentId, refundData) {
        try {
            const mockResponse = {
                id: paymentId,
                date: new Date().toISOString().split("T")[0],
                status: "voided",
                amount: refundData.amount,
                originalAmount: refundData.amount * 2,
                currency: "BRL",
                statementDescriptor: "Refund processed",
                paymentType: "card",
                cardId: this.generateUuid(),
            };
            const normalizedResponse = {
                id: mockResponse.id,
                createdAt: mockResponse.date,
                status: this.normalizeStatus(mockResponse.status),
                originalAmount: mockResponse.originalAmount,
                currentAmount: mockResponse.amount,
                currency: mockResponse.currency,
                description: mockResponse.statementDescriptor,
                paymentMethod: mockResponse.paymentType,
                cardId: mockResponse.cardId,
            };
            this.logger.log(`Provider2 - Estorno processado: ${paymentId}`);
            return normalizedResponse;
        }
        catch (error) {
            this.logger.error(`Provider2 - Erro no estorno: ${error.message}`);
            throw new common_1.HttpException(`Provider2 void falhou: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async getPayment(paymentId) {
        try {
            const mockResponse = {
                id: paymentId,
                date: new Date().toISOString().split("T")[0],
                status: "paid",
                amount: 10000,
                originalAmount: 10000,
                currency: "BRL",
                statementDescriptor: "Transaction retrieved",
                paymentType: "card",
                cardId: this.generateUuid(),
            };
            const normalizedResponse = {
                id: mockResponse.id,
                createdAt: mockResponse.date,
                status: this.normalizeStatus(mockResponse.status),
                originalAmount: mockResponse.originalAmount,
                currentAmount: mockResponse.amount,
                currency: mockResponse.currency,
                description: mockResponse.statementDescriptor,
                paymentMethod: mockResponse.paymentType,
                cardId: mockResponse.cardId,
            };
            this.logger.log(`Provider2 - Consulta realizada: ${paymentId}`);
            return normalizedResponse;
        }
        catch (error) {
            this.logger.error(`Provider2 - Erro na consulta: ${error.message}`);
            throw new common_1.HttpException(`Provider2 consulta falhou: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    convertExpirationDate(date) {
        const [month, year] = date.split("/");
        return `${month}/${year.slice(-2)}`;
    }
    normalizeStatus(status) {
        const statusMap = {
            paid: "authorized",
            failed: "failed",
            voided: "refunded",
        };
        return statusMap[status] || status;
    }
    generateUuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
};
exports.Provider2Service = Provider2Service;
exports.Provider2Service = Provider2Service = Provider2Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], Provider2Service);
//# sourceMappingURL=provider2.service.js.map