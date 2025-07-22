import { Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
import { ProvidersService } from "./providers.service"
import { Provider1Service } from "./provider1.service"
import { Provider2Service } from "./provider2.service"

@Module({
  imports: [HttpModule,],
  providers: [ProvidersService, Provider1Service, Provider2Service],
  exports: [ProvidersService],
})
export class ProvidersModule {}
