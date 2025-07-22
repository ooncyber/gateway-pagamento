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
var ProvidersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const provider1_service_1 = require("./provider1.service");
const provider2_service_1 = require("./provider2.service");
let ProvidersService = ProvidersService_1 = class ProvidersService {
    constructor(provider1Service, provider2Service) {
        this.provider1Service = provider1Service;
        this.provider2Service = provider2Service;
        this.logger = new common_1.Logger(ProvidersService_1.name);
        this.unavailableProviders = new Set();
        this.providers = [provider1Service, provider2Service];
    }
    getAvailableProviders() {
        const available = this.providers.filter((provider) => !this.unavailableProviders.has(provider.getName()));
        if (available.length === 0) {
            this.logger.warn("Todos os provedores indisponíveis, resetando status");
            this.unavailableProviders.clear();
            return this.providers;
        }
        return available;
    }
    getProviderByName(name) {
        return this.providers.find((provider) => provider.getName() === name);
    }
    markProviderAsUnavailable(name) {
        this.unavailableProviders.add(name);
        this.logger.warn(`Provedor ${name} marcado como indisponível`);
        setTimeout(() => {
            this.unavailableProviders.delete(name);
            this.logger.log(`Provedor ${name} reabilitado automaticamente`);
        }, 5 * 60 * 1000);
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = ProvidersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [provider1_service_1.Provider1Service,
        provider2_service_1.Provider2Service])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map