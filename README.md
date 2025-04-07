# 🌾 Farm Management API

Este projeto é uma API desenvolvida como parte de um teste técnico com o objetivo de gerenciar **produtores rurais** e suas respectivas fazendas. A aplicação foi construída com **Node.js**, **NestJS**, **TypeScript**, **Swagger** e utiliza **PostgreSQL** como banco de dados, tudo orquestrado via **Docker Compose**.

## 🚀 Funcionalidades

- ✅ Cadastro, edição e exclusão de produtores rurais.
- ✅ Validação de CPF ou CNPJ.
- ✅ Cadastro de dados da fazenda:
  - Nome da fazenda
  - Cidade
  - Estado
  - Área total (hectares)
  - Área agricultável (hectares)
  - Área de vegetação (hectares)
  - Culturas plantadas (Soja, Milho, Algodão, Café, Cana de Açúcar)
- ✅ Regras de negócio implementadas:
  - A soma da área agricultável + vegetação **não pode ser maior** que a área total.
  - Um produtor pode plantar **mais de uma cultura**.
- ✅ Endpoints para indicadores:
  - Total de fazendas cadastradas
  - Soma total de hectares das fazendas
  - Total de culturas plantadas por estado
 
 ## 🧱 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [Swagger](https://swagger.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Adminer](https://www.adminer.org/) (para visualização do banco)

## 🐳 Executando com Docker Compose

### ⚙️ Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### 📦 Passos para rodar o projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/arlansantos/farm-management-back.git
cd farm-management-back
```

2. Crie um arquivo .env na raiz do projeto com base no arquivo .env.example

3. Suba os containers:
```bash
docker-compose up -d --build
```

4. A API estará disponível em:
  👉 http://localhost:3000

5. Você pode acessar a interface do Adminer (visualizar o banco) via:
  👉 http://localhost:8080

6. Você pode visualizar todos os endpoints disponíveis acessando a documentação gerada pelo Swagger:
   👉 http://localhost:3000/api
