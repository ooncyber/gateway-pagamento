## 💳 Gateway de pagamento
Diagrama incial: ![Diagrama de arquitetura](docs/diagram.drawio.svg)s


## 🚀 Como iniciar a aplicação

1. Instale as dependências:
    ```bash
    npm install
    ```

2. Inicie o servidor de desenvolvimento:
    ```bash
    npm run start:dev
    ```

## 📚 Documentação da API

Após iniciar a aplicação, acesse:
- **Swagger UI**: http://localhost:3000/api/docs

## 🔗 Endpoints

### POST /payments
Processa um pagamento

**Request Body:**
```json
{
  "amount": 10000,
  "currency": "BRL",
  "description": "Compra no e-commerce",
  "paymentMethod": {
    "type": "card",
    "card": {
      "number": "4111111111111111",
      "holderName": "João Silva",
      "cvv": "123",
      "expirationDate": "12/2025",
      "installments": 1
    }
  }
}
```

### POST /payments/refunds/:id
Realiza estorno de um pagamento

**Request Body:**
```json
{
  "amount": 5000
}
```

### GET /payments/:id
Consulta informações de uma transação

## 🏗️ Arquitetura

### Estrutura do Projeto
```
src/
├── payments/           # Módulo principal de pagamentos
├── providers/          # Provedores de pagamento
├── logger/            # Sistema de logging
└── main.ts           # Ponto de entrada
```

### Padrões Implementados

1. **Strategy Pattern**: Para alternar entre provedores
2. **Circuit Breaker**: Para resiliência e recuperação automática
3. **Adapter Pattern**: Para normalizar respostas dos provedores

## 🔧 Configuração dos Provedores

Os provedores são simulados e configurados automaticamente:

- **Provider1**: Taxa de sucesso de 90%
- **Provider2**: Taxa de sucesso de 85%

### Redundância
- Se o Provider1 falhar, automaticamente usa o Provider2
- Provedores indisponíveis são reabilitados após 5 minutos
- Circuit breaker reseta quando todos os provedores estão indisponíveis

## 🧪 Testes

Execute os testes:
```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch
```

## 📊 Logs

A aplicação gera logs detalhados para:
- Processamento de pagamentos
- Falhas de provedores
- Alternância entre provedores
- Estornos e consultas

## 🔍 Monitoramento

- Status dos provedores em tempo real
- Histórico de transações em memória
- Logs estruturados para debugging

## 🚨 Tratamento de Erros

- Mensagens de erro claras e padronizadas
- Códigos HTTP apropriados
- Fallback automático entre provedores
- Recuperação automática de provedores

## 🔒 Validação

- Sanitização de dados sensíveis
- Validação de formato de cartão e datas

## 📈 Performance

- Processamento assíncrono
- Cache de transações em memória
- Timeout configurável para provedores
- Recuperação automática de falhas
