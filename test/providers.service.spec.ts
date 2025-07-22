import { Test, type TestingModule } from "@nestjs/testing"
import { ProvidersService } from "../src/providers/providers.service"
import { Provider1Service } from "../src/providers/provider1.service"
import { Provider2Service } from "../src/providers/provider2.service"
import { jest } from "@jest/globals"

describe("ProvidersService", () => {
  let service: ProvidersService

  const mockProvider1 = {
    getName: () => "Provider1",
    processPayment: jest.fn(),
    processRefund: jest.fn(),
    getPayment: jest.fn(),
  }

  const mockProvider2 = {
    getName: () => "Provider2",
    processPayment: jest.fn(),
    processRefund: jest.fn(),
    getPayment: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        {
          provide: Provider1Service,
          useValue: mockProvider1,
        },
        {
          provide: Provider2Service,
          useValue: mockProvider2,
        },
      ],
    }).compile()

    service = module.get<ProvidersService>(ProvidersService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should return all providers when none are unavailable", () => {
    const providers = service.getAvailableProviders()
    expect(providers).toHaveLength(2)
    expect(providers[0].getName()).toBe("Provider1")
    expect(providers[1].getName()).toBe("Provider2")
  })

  it("should exclude unavailable providers", () => {
    service.markProviderAsUnavailable("Provider1")
    const providers = service.getAvailableProviders()
    expect(providers).toHaveLength(1)
    expect(providers[0].getName()).toBe("Provider2")
  })

  it("should return all providers when all are marked unavailable", () => {
    service.markProviderAsUnavailable("Provider1")
    service.markProviderAsUnavailable("Provider2")
    const providers = service.getAvailableProviders()
    expect(providers).toHaveLength(2) 
  })

  it("should find provider by name", () => {
    const provider = service.getProviderByName("Provider1")
    expect(provider).toBeDefined()
    expect(provider?.getName()).toBe("Provider1")
  })

  it("should return undefined for non-existent provider", () => {
    const provider = service.getProviderByName("NonExistent")
    expect(provider).toBeUndefined()
  })
})
