import { IsNumber, IsString, IsObject, ValidateNested, Min } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

class CardDto {
  @ApiProperty({ example: "4111111111111111" })
  @IsString()
  number: string

  @ApiProperty({ example: "João Silva" })
  @IsString()
  holderName: string

  @ApiProperty({ example: "123" })
  @IsString()
  cvv: string

  @ApiProperty({ example: "12/2025" })
  @IsString()
  expirationDate: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  installments: number
}

class PaymentMethodDto {
  @ApiProperty({ example: "card" })
  @IsString()
  type: string

  @ApiProperty({ type: CardDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto
}

export class CreatePaymentDto {
  @ApiProperty({ example: 10000 })
  @IsNumber()
  @Min(1)
  amount: number

  @ApiProperty({ example: "BRL" })
  @IsString()
  currency: string

  @ApiProperty({ example: "Compra no e-commerce" })
  @IsString()
  description: string

  @ApiProperty({ type: PaymentMethodDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto
}
