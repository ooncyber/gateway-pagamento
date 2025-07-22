import { HttpService } from "@nestjs/axios";
import { PaymentProvider } from "./interfaces/payment-provider.interface";
import { CreatePaymentDto } from "../payments/dto/create-payment.dto";
import { CreateRefundDto } from "../payments/dto/create-refund.dto";
import { PaymentResponseDto } from "../payments/dto/payment-response.dto";
export declare class Provider2Service implements PaymentProvider {
    private readonly httpService;
    private readonly logger;
    private readonly baseUrl;
    constructor(httpService: HttpService);
    getName(): string;
    processPayment(paymentData: CreatePaymentDto): Promise<PaymentResponseDto>;
    processRefund(paymentId: string, refundData: CreateRefundDto): Promise<PaymentResponseDto>;
    getPayment(paymentId: string): Promise<PaymentResponseDto>;
    private convertExpirationDate;
    private normalizeStatus;
    private generateUuid;
}
