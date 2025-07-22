import { ApiProperty } from "@nestjs/swagger"

export class PaymentResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  status: string

  @ApiProperty()
  originalAmount: number

  @ApiProperty()
  currentAmount: number

  @ApiProperty()
  currency: string

  @ApiProperty()
  description: string

  @ApiProperty()
  paymentMethod: string

  @ApiProperty()
  cardId: string
}
