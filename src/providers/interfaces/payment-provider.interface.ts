import type { CreatePaymentDto } from "../../payments/dto/create-payment.dto"
import type { CreateRefundDto } from "../../payments/dto/create-refund.dto"
import type { PaymentResponseDto } from "../../payments/dto/payment-response.dto"

export interface PaymentProvider {
  getName(): string
  processPayment(paymentData: CreatePaymentDto): Promise<PaymentResponseDto>
  processRefund(paymentId: string, refundData: CreateRefundDto): Promise<PaymentResponseDto>
  getPayment(paymentId: string): Promise<PaymentResponseDto>
}
