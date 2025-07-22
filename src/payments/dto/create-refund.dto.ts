import { IsNumber, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateRefundDto {
  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(1)
  amount: number
}
