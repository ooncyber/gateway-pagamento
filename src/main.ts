import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("API Pay - Payment Gateway")
    .setDescription("Gateway de pagamentos com redundância de provedores")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  await app.listen(3000)
  console.log("🚀 API Pay rodando na porta 3000")
  console.log("📚 Documentação disponível em: http://localhost:3000/api/docs")
}

bootstrap()
