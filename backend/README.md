# CourseSphere — Backend

> Documentação específica da API RESTful. Para visão geral, setup completo e credenciais de teste, consulte o [README raiz](../README.md).

API desenvolvida em Node.js + Express para o Desafio Técnico Full Stack da V-LAB UFPE.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
- [Modelos de Dados](#modelos-de-dados)
- [Testes](#testes)
- [Decisões Arquiteturais](#decisões-arquiteturais)

---

## Visão Geral

**Base URL:** `http://localhost:3000/api`

O backend expõe uma API REST com:
- Registro e autenticação via JWT, senhas com `bcrypt`
- CRUD completo de cursos com verificação de posse (`creator_id`)
- CRUD completo de aulas com validações de status e URL
- Proteção de rotas via `authMiddleware`
- Busca de cursos por nome com `ILIKE` (case-insensitive)
- Filtro automático de visibilidade: donos veem `draft` + `published`; outros apenas `published`

---

## Estrutura de Pastas

```
backend/
├── src/
│   ├── __tests__/
│   │   ├── auth.test.js        # Registro, login, validações
│   │   ├── courses.test.js     # CRUD e regras de posse de cursos
│   │   └── lessons.test.js     # CRUD e filtro de visibilidade de aulas
│   ├── config/
│   │   ├── database.js         # Pool de conexão (pg)
│   │   ├── schema.sql          # DDL executado pelo Docker na inicialização
│   │   └── seed.js             # Dados demo (usuário + cursos + aulas)
│   ├── controllers/            # Lógica de negócio por recurso
│   ├── middlewares/
│   │   └── auth.middleware.js  # Valida JWT e injeta userId no request
│   ├── models/                 # Queries SQL por entidade
│   ├── routes/                 # Definição de rotas
│   ├── app.js                  # Express app (cors, json, rotas)
│   └── server.js               # Ponto de entrada
├── docker-compose.yml
├── jest.config.js
├── .env.example
└── package.json
```

---

## Autenticação

A API usa **JWT stateless**. Envie o token no header de todas as rotas protegidas:

```http
Authorization: Bearer <seu_token_jwt_aqui>
```

O `authMiddleware` valida o token e injeta `request.userId`. O `creator_id` **nunca** é enviado pelo frontend — sempre extraído do token, impedindo adulteração.

---

## Endpoints

### Usuários (sem autenticação)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Cria usuário. Retorna `201` com dados (sem senha). Erros: `400` campos ausentes, `409` e-mail duplicado. |
| `POST` | `/api/auth/login` | Autentica e retorna `{ user, token }`. Erros: `400` campos ausentes, `401` credenciais inválidas. |

### Cursos (requer token)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/courses` | Lista todos os cursos. Query `?search=termo` filtra por nome (ILIKE). |
| `POST` | `/api/courses` | Cria curso. `creator_id` vem do token. Valida: nome ≥ 3 chars, `end_date ≥ start_date`. |
| `GET` | `/api/courses/:id` | Retorna curso por ID. `404` se não encontrado. |
| `PUT` | `/api/courses/:id` | Atualiza curso. `403` se não for o criador. |
| `DELETE` | `/api/courses/:id` | Exclui curso (cascata nas aulas). `403` se não for o criador. |

### Aulas (requer token)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/lessons/course/:courseId` | Lista aulas do curso. Dono vê `draft` + `published`; outros só `published`. |
| `POST` | `/api/lessons` | Cria aula. Valida: `status` = `draft`/`published`, `video_url` se informado. `403` se não for dono do curso. |
| `GET` | `/api/lessons/:id` | Retorna aula por ID. |
| `PUT` | `/api/lessons/:id` | Atualiza aula. `403` se não for dono do curso pai. |
| `DELETE` | `/api/lessons/:id` | Exclui aula. `403` se não for dono do curso pai. |

---

## Modelos de Dados

```sql
users     (id, name, email UNIQUE, password, created_at)

courses   (id, name CHECK(length >= 3), description, start_date, end_date,
           creator_id → users(id) CASCADE, created_at)
          -- CHECK: end_date >= start_date

lessons   (id, title CHECK(length >= 3), status IN ('draft','published'),
           video_url, course_id → courses(id) CASCADE, created_at)
```

---

## Testes

```bash
# PostgreSQL deve estar rodando
npm test
```

Jest + Supertest, executados em banda (`--runInBand`) para evitar condições de corrida.

| Suite | Cobertura |
|---|---|
| `auth.test.js` | Registro (201), campos ausentes (400), e-mail duplicado (409), login com sucesso (200 + token), senha errada (401), e-mail inexistente (401) |
| `courses.test.js` | Rotas sem token (401), CRUD completo, busca por nome, 404 para ID inexistente, 403 para não-dono, validação de datas e nome curto (400) |
| `lessons.test.js` | Criação de aulas `published` e `draft`, filtro de visibilidade dono vs. outros, atualização, exclusão, 403 para acesso a curso alheio |

---

## Decisões Arquiteturais

**JWT stateless** — Elimina sessões no servidor. O `userId` no payload é a única fonte de identidade para os controllers.

**`creator_id` server-side** — Extraído do token, nunca do body. Impede criar recursos em nome de outro usuário via manipulação da requisição.

**Posse via curso pai nas aulas** — Autorização verifica o `creator_id` do *curso*, não da aula. Centraliza a regra e evita inconsistências.

**ILIKE para busca** — Busca parcial case-insensitive nativa do PostgreSQL, sem dependências extras.

**Schema via Docker** — `schema.sql` montado em `/docker-entrypoint-initdb.d/` é executado automaticamente na primeira inicialização, eliminando scripts de migração manuais.