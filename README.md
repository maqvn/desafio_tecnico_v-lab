# CourseSphere 🎓

<video src="./assets/demo.mp4" controls="controls" muted="muted" width="100%">
</video>

Plataforma colaborativa de gestão de cursos e aulas online — Desafio Técnico Full Stack da **V-LAB UFPE**.

![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs)
![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?logo=react)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)
![Auth](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)
![Tests](https://img.shields.io/badge/Testes-Jest%20%2B%20Vitest-C21325?logo=jest)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Diferenciais Implementados](#diferenciais-implementados)
- [Stack Completa](#stack-completa)
- [Como Rodar](#como-rodar)
- [Usuário de Teste](#usuário-de-teste)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Testes](#testes)
- [Documentação Detalhada](#documentação-detalhada)

---

## Visão Geral

O **CourseSphere** permite que usuários autenticados criem e gerenciem cursos e aulas. Cada curso pertence a um criador, que é o único com permissão para editar, excluir e gerenciar suas aulas. Outros usuários podem visualizar os cursos e apenas as aulas publicadas.

---

## Arquitetura

```
┌─────────────────┐         ┌──────────────────────┐         ┌──────────────────┐
│                 │  HTTP   │                      │  SQL    │                  │
│  React + Vite   │ ──────► │  Node.js + Express   │ ──────► │   PostgreSQL      │
│  (porta 5173)   │  Axios  │  API REST (porta 3000)│   pg   │  (porta 5432)    │
│                 │ ◄────── │                      │ ◄────── │                  │
└─────────────────┘   JSON  └──────────────────────┘  rows   └──────────────────┘
        │                             │
        │ JWT no localStorage         │ JWT gerado/validado
        │                             │ bcrypt para senhas
        └─────────────────────────────┘
```

**Fluxo de autenticação:**
1. Frontend envia credenciais → Backend valida e retorna JWT
2. JWT é armazenado no `localStorage`
3. Axios injeta o token em todas as requisições via interceptor
4. Backend valida o token e extrai `userId` antes de qualquer controller

---

## Funcionalidades

| Funcionalidade | Detalhe |
|---|---|
| ✅ Registro e Login | JWT stateless, senhas com bcrypt |
| ✅ Listagem de cursos | Busca por nome (ILIKE, case-insensitive) + paginação |
| ✅ CRUD de cursos | Apenas o criador pode editar/excluir |
| ✅ CRUD de aulas | Verificação de posse via curso pai |
| ✅ Status de aulas | `draft` visível só para o dono; `published` para todos |
| ✅ Filtro de aulas | Tabs Todas / Publicadas / Rascunho na tela de detalhes |
| ✅ API Externa | Palestrante Convidado via RandomUser API |
| ✅ Feedback visual | Toasts de sucesso/erro em todas as ações |
| ✅ Skeleton loading | Placeholders animados durante carregamento |
| ✅ Proteção de rotas | Redirecionamento para login sem token |

---

## Diferenciais Implementados

| Diferencial | Detalhes |
|---|---|
| 🐳 **Docker** | `docker-compose` sobe o PostgreSQL com schema automático |
| 🧪 **Testes Backend** | Jest + Supertest — 3 suites cobrindo auth, CRUD e regras de posse |
| 🧪 **Testes Frontend** | Vitest + React Testing Library — 3 suites de componente |
| 🔐 **JWT robusto** | Token stateless com `bcrypt` nas senhas e verificação de posse server-side |
| 📄 **Seed de dados** | Script `npm run seed` cria usuário demo + cursos e aulas de exemplo |
| 🎨 **UX avançada** | Skeleton loading, toasts ricos (Sonner), filtros de status, paginação |

---

## Stack Completa

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js 18+ + Express 5 | Servidor HTTP e roteamento |
| PostgreSQL 15 | Banco de dados relacional |
| Docker Compose | Container do banco com schema automático |
| JWT (jsonwebtoken) | Autenticação stateless |
| bcrypt | Hash de senhas |
| dotenv | Variáveis de ambiente |
| Jest + Supertest | Testes de integração e request |

### Frontend
| Tecnologia | Uso |
|---|---|
| React 19 | Biblioteca de UI |
| React Router DOM v7 | Roteamento SPA |
| Axios | Cliente HTTP com interceptor JWT |
| Tailwind CSS v3 | Estilização utilitária |
| Sonner | Notificações toast |
| Lucide React | Ícones SVG |
| Vite 8 | Bundler e dev server |
| Vitest + React Testing Library | Testes de componente |

---

## Como Rodar

**Pré-requisitos:** Node.js 18+, npm e Docker instalados.

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd desafio_tecnico_v-lab
```

### 2. Backend — banco, dependências e servidor
```bash
cd backend

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações (ou mantenha os padrões para desenvolvimento local)

# Instale as dependências
npm install

# Suba o PostgreSQL com Docker (schema criado automaticamente)
docker compose up -d

# Inicie o servidor
npm run dev
# API disponível em http://localhost:3000
```

> **Verificar o banco:** `docker exec -it course_sphere_db psql -U admin -d coursesphere_db`

### 3. Frontend — dependências e servidor
```bash
# Em outro terminal, da raiz do projeto
cd frontend

cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm install
npm run dev
# App disponível em http://localhost:5173
```

### 4. (Opcional) Popular banco com dados demo
```bash
# Com o backend já rodando:
cd backend
npm run seed
```

---

## Usuário de Teste

Após executar o seed, o seguinte usuário estará disponível para login imediato:

| Campo | Valor |
|---|---|
| **E-mail** | `demo@coursesphere.com` |
| **Senha** | `demo1234` |

Esse usuário possui 3 cursos e 8 aulas de exemplo (algumas `draft`, outras `published`).

Caso prefira criar um usuário manualmente, utilize a tela de registro da aplicação ou a rota `POST /api/auth/register`.

---

## Estrutura do Projeto

```
desafio_tecnico_v-lab/
├── backend/                     # API RESTful (Node.js + Express)
│   ├── src/
│   │   ├── __tests__/           # Testes Jest (auth, courses, lessons)
│   │   ├── config/
│   │   │   ├── database.js      # Pool de conexão PostgreSQL
│   │   │   ├── schema.sql       # DDL executado pelo Docker na inicialização
│   │   │   └── seed.js          # Script de dados demo
│   │   ├── controllers/         # Lógica de negócio por recurso
│   │   ├── middlewares/         # authMiddleware (validação JWT)
│   │   ├── models/              # Queries SQL por entidade
│   │   ├── routes/              # Definição de rotas
│   │   ├── app.js               # Configuração do Express
│   │   └── server.js            # Ponto de entrada
│   ├── docker-compose.yml       # Container PostgreSQL
│   ├── jest.config.js
│   ├── .env.example
│   └── package.json
│
├── frontend/                    # SPA (React + Vite)
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   └── __tests__/       # Testes Vitest (CourseCard, EmptyState, LessonModal)
│   │   ├── pages/               # Uma página por rota
│   │   ├── services/
│   │   │   └── api.js           # Instância Axios + interceptor JWT
│   │   ├── test/
│   │   │   └── setup.js         # Configuração do Vitest + jest-dom
│   │   ├── App.jsx              # Rotas + PrivateRoute
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js           # Configuração do Vite + Vitest
│   └── package.json
│
└── README.md
```

---

## Variáveis de Ambiente

### Backend (`backend/.env`)

```env
PORT=3000
DB_USER=admin
DB_HOST=localhost
DB_NAME=coursesphere_db
DB_PASS=admin
DB_PORT=5432
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1d
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
```

---

## Testes

### Backend (Jest + Supertest)
```bash
cd backend
npm test
```

Os testes rodam contra o banco real (PostgreSQL deve estar rodando). Cobrem:
- **`auth.test.js`** — registro, login, duplicidade de e-mail, campos obrigatórios
- **`courses.test.js`** — autenticação de rotas, CRUD completo, busca por nome, regras de posse (403)
- **`lessons.test.js`** — criação, filtro de visibilidade (dono vs. outros), atualização, exclusão, posse

### Frontend (Vitest + React Testing Library)
```bash
cd frontend
npm test
```

Cobrem comportamento e renderização de componentes isolados:
- **`CourseCard.test.jsx`** — renderização de nome/descrição, badge "Meu curso" por userId
- **`EmptyState.test.jsx`** — renderização da mensagem de estado vazio
- **`LessonModal.test.jsx`** — modo criar vs. editar (detecção por presença de `id`), pré-população de campos, callback de fechar

---

## Documentação Detalhada

- 📘 [Backend — Endpoints, modelos e decisões arquiteturais](./backend/README.md)
- 📗 [Frontend — Componentes, páginas e decisões arquiteturais](./frontend/README.md)