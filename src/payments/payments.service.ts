import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common"
import type { CreatePaymentDto } from "./dto/create-payment.dto"
import type { CreateRefundDto } from "./dto/create-refund.dto"
import type { PaymentResponseDto } from "./dto/payment-response.dto"
import { ProvidersService } from "../providers/providers.service"

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name)

    // vou usar um hashmap aqui para simular um db em memória.
    // poderia usar um ORM para facilitar, mas quero focar mais
    // em detalhes de lógica/business
    private readonly paymentHistory = new Map<string, any>()

    constructor(private readonly providersService: ProvidersService) { }

    async processPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
        this.logger.log(`Iniciando processamento de pagamento: ${JSON.stringify(createPaymentDto)}`)

        const providers = this.providersService.getAvailableProviders()

        // uma forma de realizar novamente a tratativa seria o uso de recursividade, porém não é muito
        // legível para os devs
        // foreach daria problema por conta do assíncronismo, um for of deve resolver.
        // Uma abordagem também seria o Promise.All, num cenário onde há mais de uma atividade async
        // (processa pgmt->envia comprovante & imprime nf)
        for (const provider of providers) {
            try {
                this.logger.log(`Tentando processar pagamento com provedor: ${provider.getName()}`)

                const result = await provider.processPayment(createPaymentDto)

                this.paymentHistory.set(result.id, {
                    ...result,
                    provider: provider.getName(),
                    originalRequest: createPaymentDto,
                })

                this.logger.log(`Pagamento processado com sucesso pelo provedor ${provider.getName()}: ${result.id}`)
                return result
            } catch (error) {
                this.logger.error(`Falha no provedor ${provider.getName()}: ${error.message}`)
                this.providersService.markProviderAsUnavailable(provider.getName())
                continue
            }
        }

        this.logger.error("Todos os provedores falharam")
        throw new HttpException("Todos os provedores de pagamento estão indisponíveis", HttpStatus.SERVICE_UNAVAILABLE)
    }

    async processRefund(paymentId: string, createRefundDto: CreateRefundDto): Promise<PaymentResponseDto> {
        this.logger.log(`Iniciando estorno para pagamento: ${paymentId}`)

        const paymentRecord = this.paymentHistory.get(paymentId)
        if (!paymentRecord) {
            throw new HttpException("Pagamento não encontrado", HttpStatus.NOT_FOUND)
        }

        const provider = this.providersService.getProviderByName(paymentRecord.provider)
        if (!provider) {
            /* aqui era para conseguir fazer refund através de outro provedor?
                o id do gtw 1 pode não existir no gtw 2, talvez tenha alguma regra
                para isso, tipo redundância usando teorema de CAP, onde o sistema tiraria
                de uma conta do gtw2 e depois faria a reposição usando o gt1 */

            throw new HttpException("Provedor original não disponível", HttpStatus.SERVICE_UNAVAILABLE)
        }

        try {
            const result = await provider.processRefund(paymentId, createRefundDto)

            this.paymentHistory.set(paymentId, {
                ...paymentRecord,
                ...result,
                refunded: true,
            })

            this.logger.log(`Estorno processado com sucesso: ${paymentId}`)
            return result
        } catch (error) {
            this.logger.error(`Falha no estorno: ${error.message}`)
            throw new HttpException(`Erro ao processar estorno: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getPayment(paymentId: string): Promise<PaymentResponseDto> {
        this.logger.log(`Consultando pagamento: ${paymentId}`)

        const paymentRecord = this.paymentHistory.get(paymentId)
        if (!paymentRecord) {
            throw new HttpException("Pagamento não encontrado", HttpStatus.NOT_FOUND)
        }

        const provider = this.providersService.getProviderByName(paymentRecord.provider)
        if (!provider) {
            return paymentRecord
        }

        try {
            const result = await provider.getPayment(paymentId)
            this.logger.log(`Consulta realizada com sucesso: ${paymentId}`)
            return result
        } catch (error) {
            this.logger.warn(`Falha na consulta, retornando dados do cache: ${error.message}`)
            return paymentRecord
        }
    }
}
