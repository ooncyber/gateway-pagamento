import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { PaymentProvider } from "./interfaces/payment-provider.interface"
import { CreatePaymentDto } from "../payments/dto/create-payment.dto"
import { CreateRefundDto } from "../payments/dto/create-refund.dto"
import { PaymentResponseDto } from "../payments/dto/payment-response.dto"

@Injectable()
export class Provider1Service implements PaymentProvider {
    private readonly logger = new Logger(Provider1Service.name)
    private readonly baseUrl = "https://run.mocky.io/v3" // Mock API

    constructor(private readonly httpService: HttpService) { }

    getName(): string {
        return "Provider1"
    }

    async processPayment(paymentData: CreatePaymentDto): Promise<PaymentResponseDto> {
        try {
            const requestData = {
                amount: paymentData.amount,
                currency: paymentData.currency,
                description: paymentData.description,
                paymentMethod: {
                    type: paymentData.paymentMethod.type,
                    card: {
                        number: paymentData.paymentMethod.card.number,
                        holderName: paymentData.paymentMethod.card.holderName,
                        cvv: paymentData.paymentMethod.card.cvv,
                        expirationDate: paymentData.paymentMethod.card.expirationDate,
                        installments: paymentData.paymentMethod.card.installments,
                    },
                },
            }

            // Simulação de resposta do Provider 1
            const mockResponse = {
                id: this.generateUuid(),
                createdAt: new Date().toISOString().split("T")[0],
                status: Math.random() > 0.1 ? "authorized" : "failed", // 90% success rate
                originalAmount: paymentData.amount,
                currentAmount: paymentData.amount,
                currency: paymentData.currency,
                description: paymentData.description,
                paymentMethod: "card",
                cardId: this.generateUuid(),
            }

            if (mockResponse.status === "failed") {
                throw new Error("Payment failed by provider")
            }

            this.logger.log(`Provider1 - Pagamento processado: ${mockResponse.id}`)
            return mockResponse
        } catch (error) {
            this.logger.error(`Provider1 - Erro no processamento: ${error.message}`)
            throw new HttpException(`Provider1 falhou: ${error.message}`, HttpStatus.BAD_GATEWAY)
        }
    }

    async processRefund(paymentId: string, refundData: CreateRefundDto): Promise<PaymentResponseDto> {
        try {
            // Simulação de resposta do Provider 1 para refund
            const mockResponse = {
                id: paymentId,
                createdAt: new Date().toISOString().split("T")[0],
                status: "refunded",
                originalAmount: refundData.amount * 2, // Simula valor original maior
                currentAmount: refundData.amount,
                currency: "BRL",
                description: "Refund processed",
                paymentMethod: "card",
                cardId: this.generateUuid(),
            }

            this.logger.log(`Provider1 - Estorno processado: ${paymentId}`)
            return mockResponse
        } catch (error) {
            this.logger.error(`Provider1 - Erro no estorno: ${error.message}`)
            throw new HttpException(`Provider1 refund falhou: ${error.message}`, HttpStatus.BAD_GATEWAY)
        }
    }

    async getPayment(paymentId: string): Promise<PaymentResponseDto> {
        try {
            // Simulação de consulta do Provider 1
            const mockResponse = {
                id: paymentId,
                createdAt: new Date().toISOString().split("T")[0],
                status: "authorized",
                originalAmount: 10000,
                currentAmount: 10000,
                currency: "BRL",
                description: "Payment retrieved",
                paymentMethod: "card",
                cardId: this.generateUuid(),
            }

            this.logger.log(`Provider1 - Consulta realizada: ${paymentId}`)
            return mockResponse
        } catch (error) {
            this.logger.error(`Provider1 - Erro na consulta: ${error.message}`)
            throw new HttpException(`Provider1 consulta falhou: ${error.message}`, HttpStatus.BAD_GATEWAY)
        }
    }

    private generateUuid(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0
            const v = c === "x" ? r : (r & 0x3) | 0x8
            return v.toString(16)
        })
    }
}
