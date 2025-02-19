
# 📌 Aplicação NestJS - Golden Paspberry Awards API

API desenvolvida em **NestJS** para gerenciar filmes e produtores vencedores.

## 🚀 Tecnologias Utilizadas

-  [**NestJS**](https://docs.nestjs.com/) - Framework Node.js para construção de APIs escaláveis.

-  [**Prisma**](https://www.prisma.io/docs) - ORM para interagir com banco de dados.

-  [**SQLite**](https://www.sqlite.org/docs.html) - Banco de dados leve e embutido, armazenando os dados no próprio projeto.

-  [**csv-parser**](https://www.npmjs.com/package/csv-parser) - Biblioteca para leitura e manipulação de arquivos CSV.

-  [**Jest**](https://jestjs.io/docs/getting-started) - Framework de testes unitários.

## ‼️ Requisitos de sistema

- [Node.js](https://nodejs.org/pt): Versão 14.x ou superior.

## 📥 Instalação

```sh
npm  install
```

## ▶️  Executando  a  Aplicação
Para  rodar  o  projeto,  utilize:

```sh
npm run start
```
Rodando em modo de desenvolvimento:

```sh
npm  run  start:dev
```

A base será automaticamente carrega se o arquivo movies.csv estiver presente na pasta database, na inicialização do PrismaModule (ORM)

## 🛠  Configuração  do  Banco  de  Dados

Iniciar a base
```sh 
npx prisma db push
```

Para limpar a base:
```
npx prisma db push --force-reset
```

E depois iniciar base limpa:
```sh 
npx prisma db push
```

## 🧪 Rodando Testes

```sh
npm  run  test
```

Cenários testados:
1. Movies:
  - deve retornar todos os filmes
  - deve retornar apenas os filmes vencedores
  - deve retornar um array vazio se não houver filmes no banco
  - deve retornar um array vazio se não houver filmes vencedores

2. Producers:
  - deve retornar o produtor com o MAIOR intervalo entre prêmios consecutivos
  - deve retornar o produtor com o MENOR intervalo entre prêmios consecutivos
  - deve retornar null se nenhum produtor tiver múltiplos prêmios

## 📁  Estrutura base do  Projeto

-  📂  src/providers/prisma  -  Configuração  do  banco  de  dados.

-  📂  src/providers/csv  -  Manipulação  e  validação  de  arquivos  CSV.

-  📂  src/modules/movies  -  Gerencia  os  filmes  e  prêmios.

-  📂  src/modules/producers  -  Lida  com  cálculos  de  intervalos  de  prêmios.

## 📄  Endpoints

-  GET  /producers/intervals  -  Produtores com menor e maior intervalo de prêmios consecutivos.

## 📌  Observações

Ao  rodar  a  aplicação  em  modo  de  desenvolvimento,  um  banco  de  dados  de  exemplo  pode  ser  populado  automaticamente  a  partir  de  um  arquivo  CSV.

## 💡 Sugestões

- Criar um middleware/interceptor global para tratativas de erros, tratando quaisquer erros que ocorram na aplicação, exemplo: [NestJS Exception Filter](https://docs.nestjs.com/exception-filters)
