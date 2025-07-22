import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PaymentsModule } from "./payments/payments.module"
import { ProvidersModule } from "./providers/providers.module"
import { LoggerModule } from "./logger/logger.module"
import { ProvidersService } from "./providers/providers.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    ProvidersModule,
    PaymentsModule,
  ],
})
export class AppModule {}
