import { PaymentProvider } from "./interfaces/payment-provider.interface";
import { Provider1Service } from "./provider1.service";
import { Provider2Service } from "./provider2.service";
export declare class ProvidersService {
    private readonly provider1Service;
    private readonly provider2Service;
    private readonly logger;
    private readonly providers;
    private readonly unavailableProviders;
    constructor(provider1Service: Provider1Service, provider2Service: Provider2Service);
    getAvailableProviders(): PaymentProvider[];
    getProviderByName(name: string): PaymentProvider | undefined;
    markProviderAsUnavailable(name: string): void;
}
