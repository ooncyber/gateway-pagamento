import { Controller, Post, Get, Param, Body, HttpStatus, HttpException } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import  { PaymentsService } from "./payments.service"
import  { CreatePaymentDto } from "./dto/create-payment.dto"
import  { CreateRefundDto } from "./dto/create-refund.dto"
import { PaymentResponseDto } from "./dto/payment-response.dto"

@ApiTags("payments")
@Controller("payments")
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    @ApiOperation({ summary: "Processar um pagamento" })
    @ApiResponse({
        status: 201,
        description: "Pagamento processado com sucesso",
        type: PaymentResponseDto,
    })
    async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
        try {
            return await this.paymentsService.processPayment(createPaymentDto)
        } catch (error) {
            throw new HttpException(
                error.message || "Erro interno do servidor",
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    @Post("refunds/:id")
    @ApiOperation({ summary: "Realizar estorno de um pagamento" })
    @ApiResponse({
        status: 201,
        description: "Estorno processado com sucesso",
        type: PaymentResponseDto,
    })
    async createRefund(@Param('id') paymentId: string, @Body() createRefundDto: CreateRefundDto): Promise<PaymentResponseDto> {
        try {
            return await this.paymentsService.processRefund(paymentId, createRefundDto)
        } catch (error) {
            throw new HttpException(
                error.message || "Erro interno do servidor",
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter informações de uma transação' })
    @ApiResponse({
        status: 200,
        description: 'Transação encontrada',
        type: PaymentResponseDto
    })
    async getPayment(@Param('id') paymentId: string): Promise<PaymentResponseDto> {
        try {
            return await this.paymentsService.getPayment(paymentId);
        } catch (error) {
            throw new HttpException(
                error.message || 'Erro interno do servidor',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
