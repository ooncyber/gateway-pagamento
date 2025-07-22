import { Test, type TestingModule } from "@nestjs/testing"
import { PaymentsService } from "../src/payments/payments.service"
import { ProvidersService } from "../src/providers/providers.service"
import type { CreatePaymentDto } from "../src/payments/dto/create-payment.dto"
import { HttpException, HttpStatus } from "@nestjs/common"
import { jest } from "@jest/globals"

describe("PaymentsService", () => {
  let service: PaymentsService
  let providersService: ProvidersService

  const mockProvider = {
    getName: () => "MockProvider",
    processPayment: jest.fn() as any,
    processRefund: jest.fn() as any,
    getPayment: jest.fn() as any,
  }

  const mockProvidersService = {
    getAvailableProviders: jest.fn(),
    markProviderAsUnavailable: jest.fn(),
    getProviderByName: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: ProvidersService,
          useValue: mockProvidersService,
        },
      ],
    }).compile()

    service = module.get<PaymentsService>(PaymentsService)
    providersService = module.get<ProvidersService>(ProvidersService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("processPayment", () => {
    const mockPaymentDto: CreatePaymentDto = {
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
    }

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
      }

      mockProvider.processPayment.mockResolvedValue(mockResponse)
      mockProvidersService.getAvailableProviders.mockReturnValue([mockProvider])

      const result = await service.processPayment(mockPaymentDto)

      expect(result).toEqual(mockResponse)
      expect(mockProvider.processPayment).toHaveBeenCalledWith(mockPaymentDto)
    })

    it("should fallback to second provider when first fails", async () => {
      const mockProvider2 = {
        getName: () => "MockProvider2",
        processPayment: jest.fn()  as any,
        processRefund: jest.fn()  as any,
        getPayment: jest.fn()  as any,
      }

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
      }

      mockProvider.processPayment.mockRejectedValue(new Error("Provider 1 failed"))
      mockProvider2.processPayment.mockResolvedValue(mockResponse)
      mockProvidersService.getAvailableProviders.mockReturnValue([mockProvider, mockProvider2])

      const result = await service.processPayment(mockPaymentDto)

      expect(result).toEqual(mockResponse)
      expect(mockProvider.processPayment).toHaveBeenCalledWith(mockPaymentDto)
      expect(mockProvider2.processPayment).toHaveBeenCalledWith(mockPaymentDto)
      expect(mockProvidersService.markProviderAsUnavailable).toHaveBeenCalledWith("MockProvider")
    })

    it("should throw error when all providers fail", async () => {
      mockProvider.processPayment.mockRejectedValue(new Error("Provider failed"))
      mockProvidersService.getAvailableProviders.mockReturnValue([mockProvider])

      await expect(service.processPayment(mockPaymentDto)).rejects.toThrow(HttpException)
      expect(mockProvidersService.markProviderAsUnavailable).toHaveBeenCalledWith("MockProvider")
    })
  })

  describe("getPayment", () => {
    it("should throw error when payment not found", async () => {
      await expect(service.getPayment("non-existent")).rejects.toThrow(
        new HttpException("Pagamento não encontrado", HttpStatus.NOT_FOUND),
      )
    })
  })
})
