"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const payments_service_1 = require("../src/payments/payments.service");
const providers_service_1 = require("../src/providers/providers.service");
const common_1 = require("@nestjs/common");
const globals_1 = require("@jest/globals");
describe("PaymentsService", () => {
    let service;
    let providersService;
    const mockProvider = {
        getName: () => "MockProvider",
        processPayment: globals_1.jest.fn(),
        processRefund: globals_1.jest.fn(),
        getPayment: globals_1.jest.fn(),
    };
    const mockProvidersService = {
        getAvailableProviders: globals_1.jest.fn(),
        markProviderAsUnavailable: globals_1.jest.fn(),
        getProviderByName: globals_1.jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                payments_service_1.PaymentsService,
                {
                    provide: providers_service_1.ProvidersService,
                    useValue: mockProvidersService,
                },
            ],
        }).compile();
        service = module.get(payments_service_1.PaymentsService);
        providersService = module.get(providers_service_1.ProvidersService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("processPayment", () => {
        const mockPaymentDto = {
            amount: 10000,
            currency: "BRL",
            description: "Test payment",
            paymentMethod: {
                type: "card",
                card: {
                    number: "4111111111111111",
                    holderName: "John Doe",
                    cvv: "123",
                    expirationDate: "12/2025",
                    installments: 1,
                },
            },
        };
        it("should process payment successfully with first provider", async () => {
            const mockResponse = {
                id: "payment-123",
                createdAt: "2024-01-01",
                status: "authorized",
                originalAmount: 10000,
                currentAmount: 10000,
                currency: "BRL",
                description: "Test payment",
                paymentMethod: "card",
                cardId: "card-123",
            };
            mockProvider.processPayment.mockResolvedValue(mockResponse);
            mockProvidersService.getAvailableProviders.mockReturnValue([mockProvider]);
            const result = await service.processPayment(mockPaymentDto);
            expect(result).toEqual(mockResponse);
            expect(mockProvider.processPayment).toHaveBeenCalledWith(mockPaymentDto);
        });
        it("should fallback to second provider when first fails", async () => {
            const mockProvider2 = {
                getName: () => "MockProvider2",
                processPayment: globals_1.jest.fn(),
                processRefund: globals_1.jest.fn(),
                getPayment: globals_1.jest.fn(),
            };
            const mockResponse = {
                id: "payment-456",
                createdAt: "2024-01-01",
                status: "authorized",
                originalAmount: 10000,
                currentAmount: 10000,
                currency: "BRL",
                description: "Test payment",
                paymentMethod: "card",
                cardId: "card-456",
            };
            mockProvider.processPayment.mockRejectedValue(new Error("Provider 1 failed"));
            mockProvider2.processPayment.mockResolvedValue(mockResponse);
            mockProvidersService.getAvailableProviders.mockReturnValue([mockProvider, mockProvider2]);
            const result = await service.processPayment(mockPaymentDto);
            expect(result).toEqual(mockResponse);
            expect(mockProvider.processPayment).toHaveBeenCalledWith(mockPaymentDto);
            expect(mockProvider2.processPayment).toHaveBeenCalledWith(mockPaymentDto);
            expect(mockProvidersService.markProviderAsUnavailable).toHaveBeenCalledWith("MockProvider");
        });
        it("should throw error when all providers fail", async () => {
            mockProvider.processPayment.mockRejectedValue(new Error("Provider failed"));
            mockProvidersService.getAvailableProviders.mockReturnValue([mockProvider]);
            await expect(service.processPayment(mockPaymentDto)).rejects.toThrow(common_1.HttpException);
            expect(mockProvidersService.markProviderAsUnavailable).toHaveBeenCalledWith("MockProvider");
        });
    });
    describe("getPayment", () => {
        it("should throw error when payment not found", async () => {
            await expect(service.getPayment("non-existent")).rejects.toThrow(new common_1.HttpException("Pagamento não encontrado", common_1.HttpStatus.NOT_FOUND));
        });
    });
});
//# sourceMappingURL=payments.service.spec.js.map