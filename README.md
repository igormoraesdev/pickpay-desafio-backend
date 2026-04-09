# PicPay Simplificado

Projeto de estudo que implementa uma versão simplificada da plataforma de pagamentos do PicPay, construido com [NestJS](https://nestjs.com/).

## Sobre o Desafio

O PicPay Simplificado é uma plataforma de pagamentos onde e possivel depositar e realizar transferencias de dinheiro entre usuarios. Existem 2 tipos de usuarios: **comuns** e **lojistas**, ambos possuem carteira com saldo.

## Regras de Negocio

- **Cadastro**: Nome Completo, CPF, e-mail e Senha. CPF/CNPJ e e-mails devem ser unicos no sistema
- **Transferencias**: Usuarios comuns podem enviar dinheiro para outros usuarios e lojistas
- **Lojistas**: Apenas recebem transferencias, nao enviam dinheiro
- **Saldo**: Validar se o usuario possui saldo suficiente antes da transferencia
- **Autorizacao**: Consultar servico autorizador externo (`GET https://util.devi.tools/api/v2/authorize`) antes de finalizar a transferencia
- **Transacao**: A transferencia deve ser atomica — revertida em caso de inconsistencia, devolvendo o saldo ao pagador
- **Notificacao**: Ao receber pagamento, o usuario/lojista deve ser notificado via servico externo (`POST https://util.devi.tools/api/v1/notify`), que pode estar indisponivel

## Endpoint de Transferencia

```
POST /transfer
Content-Type: application/json
```

```json
{
  "value": 100.0,
  "payer": 4,
  "payee": 15
}
```

## Tecnologias

- [NestJS](https://nestjs.com/) (Node.js + TypeScript)

## Como Rodar

```bash
# instalar dependencias
yarn install

# modo desenvolvimento
yarn start:dev

# modo producao
yarn build
yarn start:prod
```

## Testes

```bash
# testes unitarios
yarn test

# testes e2e
yarn test:e2e

# cobertura de testes
yarn test:cov
```
