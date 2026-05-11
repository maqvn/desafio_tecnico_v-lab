# CourseSphere — Backend

API RESTful desenvolvida para o Desafio Técnico Full Stack da V-LAB UFPE, responsável por gerenciar autenticação de usuários, cursos e aulas da plataforma CourseSphere.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Stack e Dependências](#stack-e-dependências)
- [Como Rodar](#como-rodar)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
  - [Usuários](#1-usuários)
  - [Cursos](#2-cursos)
  - [Aulas](#3-aulas)
- [Decisões Arquiteturais](#decisões-arquiteturais)

---

## Visão Geral

O backend expõe uma API REST com as seguintes responsabilidades:

- Registro e autenticação de usuários via JWT
- CRUD completo de cursos com regras de posse
- CRUD completo de aulas com validações de status e URL
- Proteção de rotas via middleware de autenticação
- Busca de cursos por nome com suporte a correspondência parcial (ILIKE)

**Base URL:**
```
http://localhost:3000/api
```

---

## Stack e Dependências

| Tecnologia | Uso |
|---|---|
| Node.js + Express | Servidor HTTP e roteamento |
| PostgreSQL | Banco de dados relacional |
| Docker | Container do banco de dados |
| JWT (jsonwebtoken) | Autenticação stateless |
| bcrypt | Hash de senhas |
| dotenv | Gerenciamento de variáveis de ambiente |

---

## Como Rodar

**Pré-requisitos:** Node.js 18+, npm e Docker instalados.

```bash
# 1. Entre na pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Suba o banco de dados com Docker
docker compose up -d

# 5. Execute as migrations para criar as tabelas
npm run migrate

# 6. Inicie o servidor
npm run dev
```

A API estará disponível em `http://localhost:3000`.

**Acessar o terminal do PostgreSQL no container:**
```bash
docker exec -it course_sphere_db psql -U admin -d coursesphere_db
```

**Usuário de teste:** caso queira criar um usuário sem passar pelo registro, utilize a rota `POST /api/auth/register` com qualquer e-mail e senha. Não há seed obrigatório — o fluxo de registro está completamente implementado.

---

## Estrutura de Pastas

```
backend/
├── src/
│   ├── controllers/        # Lógica de negócio de cada recurso
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   └── lessonController.js
│   ├── middlewares/
│   │   └── authMiddleware.js  # Validação do JWT em rotas protegidas
│   ├── routes/             # Definição de rotas por recurso
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   └── lessonRoutes.js
│   ├── database/
│   │   └── migrations/     # Scripts de criação das tabelas
│   └── server.js           # Ponto de entrada, configuração do Express
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do `backend/` com o seguinte conteúdo:

```env
PORT=3000
DATABASE_URL=postgresql://admin:admin@localhost:5432/coursesphere_db
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1d
```

| Variável | Descrição |
|---|---|
| `PORT` | Porta em que o servidor irá rodar |
| `DATABASE_URL` | String de conexão com o PostgreSQL |
| `JWT_SECRET` | Chave secreta para assinar os tokens JWT |
| `JWT_EXPIRES_IN` | Tempo de expiração do token (padrão: `1d`) |

---

## Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação stateless. O token é gerado no login e deve ser enviado no header de todas as rotas protegidas:

```http
Authorization: Bearer <seu_token_jwt_aqui>
```

O token expira em **1 dia**, equilibrando segurança e usabilidade durante os testes. Todas as rotas protegidas passam pelo `authMiddleware`, que valida e decodifica o token antes de qualquer controller ser executado. O `id` do usuário autenticado fica disponível em `request.userId` para os controllers.

---

## Endpoints

### 1. Usuários

#### `POST /api/auth/register` — Registrar usuário

Cria um novo usuário. A senha é armazenada como hash via `bcrypt` — nunca em texto puro.

**Autenticação:** não necessária

**Body:**
```json
{
  "name": "Jose",
  "email": "email@email.com",
  "password": "senha123"
}
```

**Resposta:** `201 Created` com os dados do usuário (sem a senha).

---

#### `POST /api/auth/login` — Login

Autentica o usuário e retorna o token de acesso.

**Autenticação:** não necessária

**Body:**
```json
{
  "email": "email@email.com",
  "password": "senha123"
}
```

**Resposta:** `200 OK`
```json
{
  "user": { "id": 1, "name": "Jose", "email": "email@email.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 2. Cursos

Todas as rotas de cursos exigem `Authorization: Bearer <token>`.

---

#### `POST /api/courses` — Criar curso

O `creator_id` é extraído do token JWT no backend — nunca enviado pelo frontend. Isso impede que um usuário crie um curso em nome de outro. A data `end_date` é validada via constraint SQL e não pode ser anterior a `start_date`.

**Body:**
```json
{
  "name": "Curso A",
  "description": "texto descrição",
  "start_date": "2025-01-01",
  "end_date": "2026-01-01"
}
```

**Resposta:** `201 Created`

---

#### `GET /api/courses` — Listar cursos

Retorna todos os cursos. Suporta busca parcial por nome via query string, utilizando o operador `ILIKE` do PostgreSQL (case-insensitive).

**Query params opcionais:**

| Param | Tipo | Descrição |
|---|---|---|
| `search` | string | Filtro parcial pelo nome do curso |

**Exemplo:** `GET /api/courses?search=logica`

**Resposta:** `200 OK` com array de cursos.

---

#### `GET /api/courses/:id` — Buscar curso por ID

**Resposta:** `200 OK` com os dados do curso, ou `404 Not Found` se não existir.

---

#### `PUT /api/courses/:id` — Atualizar curso

Requer envio completo dos campos (`name`, `description`, `start_date`, `end_date`). Antes de atualizar, o controller verifica se o `creator_id` do curso coincide com o `userId` do token. Se não coincidir, retorna `403 Forbidden`.

**Respostas:** `200 OK`, `403 Forbidden`, `404 Not Found`

---

#### `DELETE /api/courses/:id` — Deletar curso

Mesma verificação de posse do PUT. Apenas o criador pode deletar.

**Respostas:** `204 No Content`, `403 Forbidden`

---

### 3. Aulas

Todas as rotas de aulas exigem `Authorization: Bearer <token>`.

---

#### `POST /api/lessons` — Criar aula

Para criar uma aula, o sistema verifica a quem pertence o `course_id` informado. Se o curso não pertencer ao usuário autenticado, a criação é bloqueada com `403 Forbidden`. O campo `video_url` passa por validação de formato de URL no controller. O campo `status` aceita apenas os valores `draft` ou `published`.

**Body:**
```json
{
  "title": "Lógica Aristotélica",
  "video_url": "https://www.youtube.com/watch?v=0PYLo6JC_ro",
  "status": "published",
  "course_id": 11
}
```

**Resposta:** `201 Created`

---

#### `GET /api/lessons/:id` — Buscar aula por ID

**Resposta:** `200 OK` com os dados da aula, ou `404 Not Found`.

---

#### `GET /api/lessons/course/:courseId` — Listar aulas de um curso

Retorna as aulas do curso informado. Se o usuário autenticado não for o criador do curso, apenas aulas com `status: "published"` são retornadas. Se o curso não existir, retorna `404 Not Found`. Se existir mas não tiver aulas, retorna `200 OK` com array vazio `[]`.

**Resposta:** `200 OK` com array de aulas.

---

#### `PUT /api/lessons/:id` — Atualizar aula

Requer `title`, `video_url` e `status`. Verifica se o curso da aula pertence ao usuário autenticado antes de permitir a atualização.

**Respostas:** `200 OK`, `403 Forbidden`

---

#### `DELETE /api/lessons/:id` — Deletar aula

Mesma verificação de posse via curso da aula.

**Resposta:** `204 No Content`

---

## Decisões Arquiteturais

**JWT stateless** — O uso de JWT elimina a necessidade de armazenar sessões no servidor, facilitando escalabilidade. O token carrega o `userId` que é utilizado por todos os controllers para verificação de posse sem consultas extras ao banco.

**Verificação de posse no backend** — O `creator_id` nunca é enviado pelo frontend: é sempre extraído do token. Isso elimina qualquer possibilidade de um usuário manipular a propriedade de um recurso via body da requisição.

**Segurança em cascata nas aulas** — A criação e edição de aulas verifica a posse do curso pai, não da aula diretamente. Isso centraliza a regra de autorização no recurso principal (curso) e evita inconsistências.

**ILIKE para busca** — O operador `ILIKE` do PostgreSQL permite buscas parciais case-insensitive sem necessidade de bibliotecas externas, mantendo a simplicidade da query e o comportamento esperado pelo usuário.

**Paginação no frontend** — Os dados de cursos são enviados na íntegra e a paginação simulada é delegada ao React, reduzindo a complexidade das queries e o número de roundtrips ao banco para esse volume de dados.

**`video_url` como string validada** — Vídeos não são armazenados como BLOB no banco por questões de performance. O campo recebe apenas a URL, que é validada no controller para garantir que seja uma URL real antes de persistir.