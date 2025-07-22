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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const providers_service_1 = require("../providers/providers.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(providersService) {
        this.providersService = providersService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        this.paymentHistory = new Map();
    }
    async processPayment(createPaymentDto) {
        this.logger.log(`Iniciando processamento de pagamento: ${JSON.stringify(createPaymentDto)}`);
        const providers = this.providersService.getAvailableProviders();
        for (const provider of providers) {
            try {
                this.logger.log(`Tentando processar pagamento com provedor: ${provider.getName()}`);
                const result = await provider.processPayment(createPaymentDto);
                this.paymentHistory.set(result.id, {
                    ...result,
                    provider: provider.getName(),
                    originalRequest: createPaymentDto,
                });
                this.logger.log(`Pagamento processado com sucesso pelo provedor ${provider.getName()}: ${result.id}`);
                return result;
            }
            catch (error) {
                this.logger.error(`Falha no provedor ${provider.getName()}: ${error.message}`);
                this.providersService.markProviderAsUnavailable(provider.getName());
                continue;
            }
        }
        this.logger.error("Todos os provedores falharam");
        throw new common_1.HttpException("Todos os provedores de pagamento estão indisponíveis", common_1.HttpStatus.SERVICE_UNAVAILABLE);
    }
    async processRefund(paymentId, createRefundDto) {
        this.logger.log(`Iniciando estorno para pagamento: ${paymentId}`);
        const paymentRecord = this.paymentHistory.get(paymentId);
        if (!paymentRecord) {
            throw new common_1.HttpException("Pagamento não encontrado", common_1.HttpStatus.NOT_FOUND);
        }
        const provider = this.providersService.getProviderByName(paymentRecord.provider);
        if (!provider) {
            throw new common_1.HttpException("Provedor original não disponível", common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        try {
            const result = await provider.processRefund(paymentId, createRefundDto);
            this.paymentHistory.set(paymentId, {
                ...paymentRecord,
                ...result,
                refunded: true,
            });
            this.logger.log(`Estorno processado com sucesso: ${paymentId}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Falha no estorno: ${error.message}`);
            throw new common_1.HttpException(`Erro ao processar estorno: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPayment(paymentId) {
        this.logger.log(`Consultando pagamento: ${paymentId}`);
        const paymentRecord = this.paymentHistory.get(paymentId);
        if (!paymentRecord) {
            throw new common_1.HttpException("Pagamento não encontrado", common_1.HttpStatus.NOT_FOUND);
        }
        const provider = this.providersService.getProviderByName(paymentRecord.provider);
        if (!provider) {
            return paymentRecord;
        }
        try {
            const result = await provider.getPayment(paymentId);
            this.logger.log(`Consulta realizada com sucesso: ${paymentId}`);
            return result;
        }
        catch (error) {
            this.logger.warn(`Falha na consulta, retornando dados do cache: ${error.message}`);
            return paymentRecord;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map