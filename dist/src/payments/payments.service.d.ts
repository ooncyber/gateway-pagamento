import type { CreatePaymentDto } from "./dto/create-payment.dto";
import type { CreateRefundDto } from "./dto/create-refund.dto";
import type { PaymentResponseDto } from "./dto/payment-response.dto";
import { ProvidersService } from "../providers/providers.service";
export declare class PaymentsService {
    private readonly providersService;
    private readonly logger;
    private readonly paymentHistory;
    constructor(providersService: ProvidersService);
    processPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto>;
    processRefund(paymentId: string, createRefundDto: CreateRefundDto): Promise<PaymentResponseDto>;
    getPayment(paymentId: string): Promise<PaymentResponseDto>;
}
