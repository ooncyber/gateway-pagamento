import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import  { PaymentProvider } from "./interfaces/payment-provider.interface"
import  { CreatePaymentDto } from "../payments/dto/create-payment.dto"
import  { CreateRefundDto } from "../payments/dto/create-refund.dto"
import  { PaymentResponseDto } from "../payments/dto/payment-response.dto"

@Injectable()
export class Provider2Service implements PaymentProvider {
  private readonly logger = new Logger(Provider2Service.name)
  private readonly baseUrl = "https://run.mocky.io/v3" // Mock API

  constructor(private readonly httpService: HttpService) {}

  getName(): string {
    return "Provider2"
  }

  async processPayment(paymentData: CreatePaymentDto): Promise<PaymentResponseDto> {
    try {
      const requestData = {
        amount: paymentData.amount,
        currency: paymentData.currency,
        statementDescriptor: paymentData.description,
        paymentType: "card",
        card: {
          number: paymentData.paymentMethod.card.number,
          holder: paymentData.paymentMethod.card.holderName,
          cvv: paymentData.paymentMethod.card.cvv,
          expiration: this.convertExpirationDate(paymentData.paymentMethod.card.expirationDate),
          installmentNumber: paymentData.paymentMethod.card.installments,
        },
      }

      // Simulação de resposta do Provider 2 (formato diferente)
      const mockResponse = {
        id: this.generateUuid(),
        date: new Date().toISOString().split("T")[0],
        status: Math.random() > 0.15 ? "paid" : "failed", // 85% success rate
        amount: paymentData.amount,
        originalAmount: paymentData.amount,
        currency: paymentData.currency,
        statementDescriptor: paymentData.description,
        paymentType: "card",
        cardId: this.generateUuid(),
      }

      if (mockResponse.status === "failed") {
        throw new Error("Transaction failed by provider")
      }

      // Usar DTO para resposta padrão, e garantir no swagger
      const normalizedResponse: PaymentResponseDto = {
        id: mockResponse.id,
        createdAt: mockResponse.date,
        status: this.normalizeStatus(mockResponse.status),
        originalAmount: mockResponse.originalAmount,
        currentAmount: mockResponse.amount,
        currency: mockResponse.currency,
        description: mockResponse.statementDescriptor,
        paymentMethod: mockResponse.paymentType,
        cardId: mockResponse.cardId,
      }

      this.logger.log(`Provider2 - Pagamento processado: ${normalizedResponse.id}`)
      return normalizedResponse
    } catch (error) {
      this.logger.error(`Provider2 - Erro no processamento: ${error.message}`)
      throw new HttpException(`Provider2 falhou: ${error.message}`, HttpStatus.BAD_GATEWAY)
    }
  }

  async processRefund(paymentId: string, refundData: CreateRefundDto): Promise<PaymentResponseDto> {
    try {
      // Simulação de resposta do Provider 2 para void
      const mockResponse = {
        id: paymentId,
        date: new Date().toISOString().split("T")[0],
        status: "voided",
        amount: refundData.amount,
        originalAmount: refundData.amount * 2,
        currency: "BRL",
        statementDescriptor: "Refund processed",
        paymentType: "card",
        cardId: this.generateUuid(),
      }

      const normalizedResponse: PaymentResponseDto = {
        id: mockResponse.id,
        createdAt: mockResponse.date,
        status: this.normalizeStatus(mockResponse.status),
        originalAmount: mockResponse.originalAmount,
        currentAmount: mockResponse.amount,
        currency: mockResponse.currency,
        description: mockResponse.statementDescriptor,
        paymentMethod: mockResponse.paymentType,
        cardId: mockResponse.cardId,
      }

      this.logger.log(`Provider2 - Estorno processado: ${paymentId}`)
      return normalizedResponse
    } catch (error) {
      this.logger.error(`Provider2 - Erro no estorno: ${error.message}`)
      throw new HttpException(`Provider2 void falhou: ${error.message}`, HttpStatus.BAD_GATEWAY)
    }
  }

  async getPayment(paymentId: string): Promise<PaymentResponseDto> {
    try {
      // Simulação de consulta do Provider 2
      const mockResponse = {
        id: paymentId,
        date: new Date().toISOString().split("T")[0],
        status: "paid",
        amount: 10000,
        originalAmount: 10000,
        currency: "BRL",
        statementDescriptor: "Transaction retrieved",
        paymentType: "card",
        cardId: this.generateUuid(),
      }

      const normalizedResponse: PaymentResponseDto = {
        id: mockResponse.id,
        createdAt: mockResponse.date,
        status: this.normalizeStatus(mockResponse.status),
        originalAmount: mockResponse.originalAmount,
        currentAmount: mockResponse.amount,
        currency: mockResponse.currency,
        description: mockResponse.statementDescriptor,
        paymentMethod: mockResponse.paymentType,
        cardId: mockResponse.cardId,
      }

      this.logger.log(`Provider2 - Consulta realizada: ${paymentId}`)
      return normalizedResponse
    } catch (error) {
      this.logger.error(`Provider2 - Erro na consulta: ${error.message}`)
      throw new HttpException(`Provider2 consulta falhou: ${error.message}`, HttpStatus.BAD_GATEWAY)
    }
  }

  private convertExpirationDate(date: string): string {
    const [month, year] = date.split("/")
    return `${month}/${year.slice(-2)}`
  }

  private normalizeStatus(status: string): string {
    const statusMap = {
      paid: "authorized",
      failed: "failed",
      voided: "refunded",
    }
    return statusMap[status] || status
  }

  private generateUuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}
