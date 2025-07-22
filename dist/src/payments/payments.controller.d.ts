import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { CreateRefundDto } from "./dto/create-refund.dto";
import { PaymentResponseDto } from "./dto/payment-response.dto";
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto>;
    createRefund(paymentId: string, createRefundDto: CreateRefundDto): Promise<PaymentResponseDto>;
    getPayment(paymentId: string): Promise<PaymentResponseDto>;
}
