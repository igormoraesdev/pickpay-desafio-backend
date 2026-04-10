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

- [NestJS](https://nestjs.com/) (TypeScript)
- [Bun](https://bun.sh/) (runtime)
- [Drizzle ORM](https://orm.drizzle.team/) + SQLite
- [Docker](https://www.docker.com/)

## Como Rodar

### Com Docker (recomendado)

```bash
docker compose up
```

A aplicacao sobe em `http://localhost:9090` com hot-reload.

### Sem Docker

```bash
# instalar dependencias
bun install

# rodar migrations
bun run db:generate
bun run db:migrate

# modo desenvolvimento
bun run start:dev

# modo producao
bun run build
bun run start:prod
```

## Testes

```bash
# testes unitarios
bun run test

# cobertura de testes
bun run test:cov
```
