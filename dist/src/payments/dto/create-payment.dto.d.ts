declare class CardDto {
    number: string;
    holderName: string;
    cvv: string;
    expirationDate: string;
    installments: number;
}
declare class PaymentMethodDto {
    type: string;
    card: CardDto;
}
export declare class CreatePaymentDto {
    amount: number;
    currency: string;
    description: string;
    paymentMethod: PaymentMethodDto;
}
export {};
