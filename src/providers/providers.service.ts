import { Injectable, Logger } from "@nestjs/common"
import  { PaymentProvider } from "./interfaces/payment-provider.interface"
import { Provider1Service } from "./provider1.service"
import { Provider2Service } from "./provider2.service"

@Injectable()
export class ProvidersService {
  private readonly logger = new Logger(ProvidersService.name)
  private readonly providers: PaymentProvider[]
  private readonly unavailableProviders = new Set<string>()

  constructor(
    private readonly provider1Service: Provider1Service,
    private readonly provider2Service: Provider2Service,
  ) {
    this.providers = [provider1Service, provider2Service]
  }

  getAvailableProviders(): PaymentProvider[] {
    const available = this.providers.filter((provider) => !this.unavailableProviders.has(provider.getName()))

    if (available.length === 0) {
      this.logger.warn("Todos os provedores indisponíveis, resetando status")
      this.unavailableProviders.clear()
      return this.providers
    }

    return available
  }

  getProviderByName(name: string): PaymentProvider | undefined {
    return this.providers.find((provider) => provider.getName() === name)
  }

  markProviderAsUnavailable(name: string): void {
    this.unavailableProviders.add(name)
    this.logger.warn(`Provedor ${name} marcado como indisponível`)

    // Auto-recovery após 5 minutos
    setTimeout(
      () => {
        this.unavailableProviders.delete(name)
        this.logger.log(`Provedor ${name} reabilitado automaticamente`)
      },
      5 * 60 * 1000,
    )
  }
}
