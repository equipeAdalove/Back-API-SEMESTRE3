# 🌎📈 AdaTrade API – Comércio Exterior Brasileiro

Esta API foi desenvolvida com **NestJS** e tem como objetivo organizar e disponibilizar dados de exportações e importações brasileiras de forma estruturada, clara e útil para análises estatísticas e tomadas de decisão.

---

## 🚀 Objetivo

O projeto visa **facilitar o acesso e a análise dos dados de comércio exterior do Brasil**, respondendo a perguntas como:

> 📦 Para quais países, o estado X mais exportou nos últimos anos?  
> 📈 Quais o principal importador do NCM y?  
> 🏙️ Quais estados são os maiores exportadores?  
> 🚢 Qual via de transporte de um estado Z?  
> 📊 Como esses dados evoluíram ao longo do tempo?

---

## 📊 Fontes dos Dados

As informações são obtidas de fontes públicas e oficiais:

- [Base de Dados Bruta – ComexStat](https://www.gov.br/mdic/pt-br/assuntos/comercio-exterior/estatisticas/base-de-dados-bruta)

---

## 🔎 Endpoints Disponíveis

A API segue o padrão **RESTful** e está organizada por domínios temáticos. Todos os endpoints utilizam o método `GET`.

### 📤 Exportação

- `/exportacao` – Buscar todos os registros de exportação
- `/exportacao/ncm/{ncm}` – Buscar registros por código NCM
- `/exportacao/filter` – Buscar registros com filtros personalizados

### 📥 Importação

- `/importacao` – Buscar todos os registros de importação
- `/importacao/ncm/{ncm}` – Buscar registros por código NCM
- `/importacao/filter` – Buscar registros com filtros personalizados

### 📦 NCM (Nomenclatura Comum do Mercosul)

- `/ncm/{co_ncm}/info` – Informações gerais sobre um NCM
- `/ncm/{co_ncm}/ano/{ano}` – Dados por ano
- `/ncm/{co_ncm}/total` – Total geral
- `/ncm/{co_ncm}/valor-agregado` – Valor agregado total
- `/ncm/{co_ncm}/valor-agregado/{ano}` – Valor agregado por ano

### 🗺️ Estado

- `/estado/{uf}/ano/{ano}` – Dados do estado por ano
- `/estado/{uf}/total` – Total por estado
- `/estado/{uf}/ncm/{co_ncm}/ano/{ano}` – Dados de NCM por estado e ano
- `/estado/{uf}/ncm/{co_ncm}/total` – Total de NCM por estado
- `/estado/{uf}/valor-agregado` – Valor agregado total do estado

### 🏙️ Município

- `/municipio/nome/{nome}` – Buscar município por nome
- `/municipio/{coMunGeo}` – Buscar por código geográfico
- `/municipio/{co_mun}/ano/{ano}` – Dados SH4 por ano
- `/municipio/{co_mun}/total` – Total SH4 agregado por município

### 🌍 País

- `/pais/ano/{ano}` – Total por país e ano
- `/pais/total` – Total acumulado de importação/exportação por país

### 🚚 Transporte

- `/transporte/ano/{ano}` – Uso dos meios de transporte por ano

---

## 🧠 Lógica da API

A lógica da API permite consultas e filtros personalizados em tabelas normalizadas, com agregações por:

- Ano
- Produto (NCM)
- Estado (UF)
- Município
- País
- Modal de transporte

---

## 🧼 Limpeza dos Dados Utilizados

- [🔗 Link para o Colab - Tabelas Base (ex: exportação/importação)](INSERIR_LINK)
- [🔗 Link para o Colab - Tabelas Auxiliares (ex: NCM, país, transporte)](INSERIR_LINK)

---

## 🛠️ Tecnologias Utilizadas

<div align="left">
  <img src="https://skillicons.dev/icons?i=nestjs,ts,prisma,redis,postgres,docker,npm,git,github" height="50" />
</div>

- **NestJS** – Framework escalável para APIs
- **TypeScript** – Tipagem estática e robustez
- **Swagger/OpenAPI** – Interface interativa de documentação
- **PostgreSQL** – Banco relacional com chaves compostas
- **Prisma ORM** – Consulta de dados fácil e segura
- **Redis** – Cache em memória (em breve)
- **Docker** – Empacotamento e distribuição
- **NPM** – Gerenciador de dependências
- **GitHub** – Controle de versão e colaboração

---

## 📊 Exemplos de Uso

## Utilizando o endpoint /ncm/{co_ncm}/info (GET)

Utilizaremos o NCM 84439933 (Cartuchos de revelador (toners))

![alt text](public/image.png)

## Resposta no Swagger

Exibe de maneira mais detalhada

![alt text](public/image-2.png)

## Resposta pelo navegador

Apenas por melhor visualização (Google Chrome + Extensão JSONVue)

![alt text](public/image-1.png)

---

## 🐳 Rodando o banco de dados PostgreSQL com Docker

### Pré-requisitos

- Docker Desktop instalado
- Login no Docker Hub:

```bash
docker login
```

### Baixando e rodando o container

```bash
docker pull msgermano/api3ads-postgres:1.0
```

```bash
docker run -d --name api3ads -e POSTGRES_PASSWORD=admin -p 5433:5432 msgermano/api3ads-postgres:1.0
```

### Comandos úteis do Docker

```bash
docker ps -a                 # Lista containers
docker start [id ou nome]    # Inicia o container
docker stop [id ou nome]     # Para o container
```

---

## ⚙️ Rodando o Backend NestJS localmente

### Pré-requisitos

- Node.js + npm instalados (nvm recomendado)
- Passo anterior realizado

#### 1. Na pasta raiz do projeto, rode:

```bash
npm install
```

```bash
npm run start
```

#### 2. Renomeando .env-example

Mude o nome do arquivo .env-example para .env e edite as variáveis de ambiente conforme necessário. Aqui será acessado o banco de dados configurado no _Docker_

Exemplo:

```java
DATABASE_URL="postgresql://[DATABASE_USER]:[DATABASE_PASSWORD]@localhost:5433/[DATABASE_NAME]?schema=public"
PORT=3000
```

#### 3. Inicie o servidor localmente

```bash
npm run start
```

A API estará disponível localmente. Você pode testar as rotas via Postman, Insomnia ou diretamente no Swagger (`/api`).

---

## 👨‍💻 Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests com sugestões, melhorias ou correções.

---

## 💙 Desenvolvido por

**Equipe Adalove**  
🚀  
📬
