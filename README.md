# 📌 Tasks & Users API — NestJS + Prisma + PostgreSQL

API REST desenvolvida com **NestJS**, **Prisma ORM** e **PostgreSQL**, com documentação interativa via **Swagger**.  
O projeto implementa um sistema de **Usuários** e **Tarefas**, com relacionamento entre eles, validações, paginação e ambiente pronto para desenvolvimento local com Docker.

---

## 🧠 Visão Geral

Esta API permite:
- Criar, listar, atualizar e remover **Usuários**
- Criar, listar, atualizar e remover **Tarefas**
- Associar tarefas a usuários
- Paginar resultados
- Validar dados de entrada
- Testar endpoints via Swagger

---

## Clonar Repo
git clone <url-do-repositorio>



## Instalar as dependências 
 npm install

## Criar o arquivo .env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/minha_db?schema=public"

## Subir o PostgreSQL com Docker
docker compose up -d


## Rodar migrations e gerar o Prisma Client
npx prisma migrate dev
npx prisma generate


## Rodar a aplicação
npm run start:dev


## Acessar a aplicação

API: http://localhost:3000

Swagger: http://localhost:3000/docs




## 🧩 Tecnologias

- **Node.js**
- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **Docker / Docker Compose**
- **Swagger (OpenAPI)**
- **class-validator / class-transformer**

---

## 🗂 Arquitetura (conceitual)

```text
┌──────────┐        1 ──── N        ┌──────────┐
│  User    │──────────────────────▶│  Task    │
├──────────┤                         ├──────────┤
│ id       │                         │ id       │
│ email*   │                         │ name     │
│ name     │                         │ desc     │
│ password │                         │ completed│
└──────────┘                         │ userId   │
                                     └──────────┘
