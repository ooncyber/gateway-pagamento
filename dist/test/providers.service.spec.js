"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const providers_service_1 = require("../src/providers/providers.service");
const provider1_service_1 = require("../src/providers/provider1.service");
const provider2_service_1 = require("../src/providers/provider2.service");
const globals_1 = require("@jest/globals");
describe("ProvidersService", () => {
    let service;
    const mockProvider1 = {
        getName: () => "Provider1",
        processPayment: globals_1.jest.fn(),
        processRefund: globals_1.jest.fn(),
        getPayment: globals_1.jest.fn(),
    };
    const mockProvider2 = {
        getName: () => "Provider2",
        processPayment: globals_1.jest.fn(),
        processRefund: globals_1.jest.fn(),
        getPayment: globals_1.jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                providers_service_1.ProvidersService,
                {
                    provide: provider1_service_1.Provider1Service,
                    useValue: mockProvider1,
                },
                {
                    provide: provider2_service_1.Provider2Service,
                    useValue: mockProvider2,
                },
            ],
        }).compile();
        service = module.get(providers_service_1.ProvidersService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    it("should return all providers when none are unavailable", () => {
        const providers = service.getAvailableProviders();
        expect(providers).toHaveLength(2);
        expect(providers[0].getName()).toBe("Provider1");
        expect(providers[1].getName()).toBe("Provider2");
    });
    it("should exclude unavailable providers", () => {
        service.markProviderAsUnavailable("Provider1");
        const providers = service.getAvailableProviders();
        expect(providers).toHaveLength(1);
        expect(providers[0].getName()).toBe("Provider2");
    });
    it("should return all providers when all are marked unavailable", () => {
        service.markProviderAsUnavailable("Provider1");
        service.markProviderAsUnavailable("Provider2");
        const providers = service.getAvailableProviders();
        expect(providers).toHaveLength(2);
    });
    it("should find provider by name", () => {
        const provider = service.getProviderByName("Provider1");
        expect(provider).toBeDefined();
        expect(provider?.getName()).toBe("Provider1");
    });
    it("should return undefined for non-existent provider", () => {
        const provider = service.getProviderByName("NonExistent");
        expect(provider).toBeUndefined();
    });
});
//# sourceMappingURL=providers.service.spec.js.map