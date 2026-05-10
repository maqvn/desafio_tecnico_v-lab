# CourseSphere API — Documentação

Backend desenvolvido para o Desafio Técnico Full Stack da V-LAB.

Esta API RESTful gerencia:

- Autenticação de usuários
- CRUD completo de Cursos
- CRUD completo de Aulas
- Regras estritas de segurança e posse de dados

---

# 🌐 Base URL

```txt
http://localhost:3000/api
```

---

# 🔐 Autenticação (JWT)

As rotas desta API são protegidas (salvo rotas de login e registro, por razões óbvias).

Para acessá-las, é necessário enviar o Token JWT gerado no login através dos headers da requisição.

## Header

```http
Authorization: Bearer <seu_token_jwt_aqui>
```

## 💡 Motivações para as decisões de arquitetura

Optamos pelo uso de JSON Web Tokens (JWT) para manter a API **stateless** (sem estado), o que facilita a escalabilidade.

O token possui validade configurada para:

```txt
1d (um dia)
```

Isso garante um equilíbrio entre segurança e usabilidade durante os testes.

Todo o controle de acesso é realizado via Middleware (`authMiddleware`), bloqueando requisições sem token válido antes mesmo de chegarem aos Controllers.

---

# 🧑‍💻 1. Usuários (Auth)

## 1.1 Registrar Usuário

Cria um novo usuário na base de dados.

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `POST` |
| Rota | `/auth/register` |
| Autenticação | Não necessária |

### Body (JSON)

```json
{
  "name": "Jose",
  "email": "email@email.com",
  "password": "senha123"
}
```

### Resposta de sucesso

```txt
201 Created
```

Retorna os dados do usuário (sem a senha).

### 💡 Motivações para as decisões de arquitetura

O edital permitia criar usuários via script/seed.

Optei por implementar a rota real de registro para agregar valor ao projeto.

As senhas são criptografadas (Hash) utilizando `bcrypt` antes de serem armazenadas no banco de dados.

---

## 1.2 Login

Autentica o usuário e devolve o token de acesso.

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `POST` |
| Rota | `/auth/login` |
| Autenticação | Não necessária |

### Body (JSON)

```json
{
  "email": "email@email.com",
  "password": "senha123"
}
```

### Resposta de sucesso

```json
{
  "user": {
    "id": 1,
    "name": "Jose",
    "email": "email@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

```txt
200 OK
```

---

# 📚 2. Cursos (Courses)

## 2.1 Criar Curso

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `POST` |
| Rota | `/courses` |
| Autenticação | Obrigatória `Bearer Token` |

### Body (JSON)

```json
{
  "name": "Curso A",
  "description": "texto descrição",
  "start_date": "2025-01-01",
  "end_date": "2026-01-01"
}
```

### Resposta de sucesso

```txt
201 Created
```

### 💡 Motivações para as decisões de arquitetura

O `creator_id` não é enviado pelo frontend.

Ele é extraído diretamente do Token JWT no backend (`request.userId`). Isso impede ataques onde um usuário tenta criar um curso em nome de outro.

Também implementei validação de datas com o `check` SQL:

- `end_date` nunca pode ser menor que `start_date`

---

## 2.2 Listar Cursos

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `GET` |
| Rota | `/courses` |
| Autenticação | Obrigatória `Bearer Token`|

### Resposta de sucesso

```txt
200 OK
```

Retorna um array de cursos.

### 💡 Motivações para as decisões de arquitetura

Atendendo à seção 6 do edital, implementei um filtro de busca.

O backend utiliza o operador `ILIKE` do PostgreSQL para buscas parciais case-insensitive.

Em relação à paginação, optei por enviar os dados na íntegra e delegar a paginação simulada para o Frontend (React), reduzindo a sobrecarga de queries no banco.

---

## 2.3 Buscar Curso por ID

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `GET` |
| Rota | `/courses/:id` |
| Exemplo | `/courses/11` |
| Autenticação | Obrigatória `Bearer Token` |

### Respostas

#### Sucesso

```txt
200 OK
```

#### Erro

```txt
404 Not Found
```

Caso o curso com esse id não exista.

---

## 2.4 Atualizar Curso

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `PUT` |
| Rota | `/courses/:id` |
| Autenticação | Obrigatória `Bearer Token` |

### Body (JSON)

Todos os campos são obrigatórios:

- `name`
- `description`
- `start_date`
- `end_date`

### Respostas

#### Sucesso

```txt
200 OK
```

#### Erros

```txt
403 Forbidden
```

```txt
404 Not Found
```

### 💡 Motivações para as decisões de arquitetura

#### Segurança de Posse

Antes de atualizar, o Controller busca o curso e verifica se o `creator_id` coincide com o ID do usuário autenticado.

Apenas o criador pode editar.

#### Design RESTful

Optei pelo método `PUT` rigoroso, exigindo que o frontend envie o JSON completo para substituição dos dados.

Isso mantém o fluxo simples e previsível.

---

## 2.5 Deletar Curso

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `DELETE` |
| Rota | `/courses/:id` |
| Autenticação | Obrigatória `Bearer Token` |

### Respostas

#### Sucesso

```txt
204 No Content
```

#### Erro de permissão

```txt
403 Forbidden
```

Apenas o criador pode deletar.

---

# 🎬 3. Aulas (Lessons)

## 3.1 Criar Aula

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `POST` |
| Rota | `/lessons` |
| Autenticação | Obrigatória `Bearer Token` |

### Body (JSON)

```json
{
  "title": "Lógica Aristotélica",
  "video_url": "https://www.youtube.com/watch?v=0PYLo6JC_ro",
  "status": "published",
  "course_id": 11
}
```

### Resposta de sucesso

```txt
201 Created
```

### 💡 Motivações para as decisões de arquitetura

#### Armazenamento de Vídeo

Não armazenei o BLOB (nesse caso o vídeo) no banco de dados por questões de performance.

O campo `video_url` recebe apenas strings.

Criamos uma função no Controller para validar se a string enviada é uma URL real.

#### Validação de Status

O sistema rejeita qualquer valor para `status` que não seja:

- `draft`
- `published`

#### Segurança em Cascata

Para criar uma aula, o sistema verifica a quem pertence o `course_id`.

Se o curso não pertencer ao usuário autenticado, a criação da aula é bloqueada:

```txt
403 Forbidden
```

---

## 3.2 Buscar Aula por ID

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `GET` |
| Rota | `/lessons/:id` |
| Exemplo | `/lessons/11` |
| Autenticação | Obrigatória `Bearer Token` |

### Resposta de sucesso

```txt
200 OK
```

Retorna os dados da aula

#### Erros

```txt
404 Not Found
```

---

## 3.3 Listar Aulas por Curso

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `GET` |
| Rota | `/lessons/course/:courseId` |
| Exemplo | `/lessons/course/11` |
| Autenticação | Obrigatória |

### Resposta de sucesso

```txt
200 OK
```

Retorna um array de aulas.

### 💡 Motivações para as decisões de arquitetura

#### Erros

- Se o ID do curso não existir no banco, a API retorna:

```txt
404 Not Found
```

- Se o curso existir, mas não possuir aulas cadastradas, a API retorna:

```json
[]
```

Com status:

```txt
200 OK
```

Isso respeita as convenções de consumo do Frontend.

---

## 3.4 Atualizar Aula

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `PUT` |
| Rota | `/lessons/:id` |
| Autenticação | Obrigatória |

### Body

Exige:

- `title`
- `video_url`
- `status`

### Respostas

#### Sucesso

```txt
200 OK
```

#### Erro

```txt
403 Forbidden
```

Ocorre quando o curso da aula não pertence ao usuário autenticado.

---

## 3.5 Deletar Aula

### Informações da rota

| Campo | Valor |
|---|---|
| Método | `DELETE` |
| Rota | `/lessons/:id` |
| Autenticação | Obrigatória |

### Resposta de sucesso

```txt
204 No Content
```
