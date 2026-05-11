# CourseSphere 🎓

Plataforma de gestão de cursos e aulas online desenvolvida como desafio técnico Full Stack da **V-LAB UFPE**.

![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)
![Auth](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Como Rodar](#como-rodar)
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
| ✅ Listagem de cursos | Busca por nome (ILIKE, case-insensitive) |
| ✅ CRUD de cursos | Apenas o criador pode editar/excluir |
| ✅ CRUD de aulas | Verificação de posse via curso pai |
| ✅ Status de aulas | `draft` visível só para o dono; `published` para todos |
| ✅ API Externa | Palestrante Convidado via RandomUser API |
| ✅ Feedback visual | Toasts de sucesso/erro em todas as ações |
| ✅ Proteção de rotas | Redirecionamento para login sem token |

---

## Stack

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + Express | Servidor HTTP e roteamento |
| PostgreSQL | Banco de dados relacional |
| Docker | Container do banco de dados |
| JWT (jsonwebtoken) | Autenticação stateless |
| bcrypt | Hash de senhas |
| dotenv | Gerenciamento de variáveis de ambiente |

### Frontend
| Tecnologia | Uso |
|---|---|
| React 19 | Biblioteca principal de UI |
| React Router DOM v7 | Roteamento SPA |
| Axios | Cliente HTTP com interceptor JWT |
| Tailwind CSS | Estilização utilitária |
| Sonner | Notificações toast |
| Lucide React | Ícones SVG |
| Vite | Bundler e dev server |

---

## Como Rodar

**Pré-requisitos:** Node.js 18+, npm e Docker instalados.

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd desafio_tecnico_v-lab
```

### 2. Suba o banco de dados
```bash
cd backend
docker compose up -d
```

### 3. Configure e inicie o backend
```bash
# Ainda dentro de backend/
cp .env.example .env    # Edite com suas configurações
npm install
npm run migrate         # Cria as tabelas no PostgreSQL
npm run dev             # API disponível em http://localhost:3000
```

### 4. Configure e inicie o frontend
```bash
# Em outro terminal, da raiz do projeto
cd frontend
cp .env.example .env    # Edite com a URL da API
npm install
npm run dev             # App disponível em http://localhost:5173
```

> Para verificar se o banco está funcionando, use:
> ```bash
> docker exec -it course_sphere_db psql -U admin -d coursesphere_db
> ```

---

## Estrutura do Projeto

```
desafio_tecnico_v-lab/
├── backend/                   # API RESTful (Node.js + Express)
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio por recurso
│   │   ├── middlewares/       # authMiddleware (validação JWT)
│   │   ├── models/            # Queries SQL por entidade
│   │   ├── routes/            # Definição de rotas
│   │   ├── config/            # Conexão com o banco
│   │   └── server.js          # Ponto de entrada
│   ├── docker-compose.yml     # Container PostgreSQL
│   ├── .env.example
│   └── package.json
│
├── frontend/                  # SPA (React + Vite)
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Uma página por rota
│   │   ├── services/
│   │   │   └── api.js         # Instância Axios + interceptor JWT
│   │   ├── App.jsx            # Definição de rotas
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── README.md                  # Este arquivo
```

---

## Variáveis de Ambiente

### Backend (`backend/.env`)

```env
PORT=3000
DATABASE_URL=postgresql://admin:admin@localhost:5432/coursesphere_db
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1d
```

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor Express |
| `DATABASE_URL` | String de conexão PostgreSQL |
| `JWT_SECRET` | Chave secreta para assinar os tokens JWT |
| `JWT_EXPIRES_IN` | Tempo de expiração do token (padrão: `1d`) |

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
```

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API backend |

---

## Testes

### Backend
```bash
cd backend
npm test
```

Testes de request cobrem autenticação (registro, login, validações) e regras de negócio (criação, edição e exclusão com verificação de posse).

### Frontend
```bash
cd frontend
npm test
```

Testes de componente com Vitest + React Testing Library cobrem `CourseCard`, `EmptyState` e `LessonModal`.

---

## Documentação Detalhada

- 📘 [Backend — Endpoints, modelos e decisões arquiteturais](./backend/README.md)
- 📗 [Frontend — Componentes, páginas e decisões arquiteturais](./frontend/README.md)