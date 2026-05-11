# CourseSphere — Frontend

Interface web para a plataforma de gestão de cursos e aulas online **CourseSphere**, desenvolvida em React como parte do desafio técnico Full Stack da V-LAB UFPE.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Stack e Dependências](#stack-e-dependências)
- [Como Rodar](#como-rodar)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Páginas](#páginas)
- [Componentes](#componentes)
- [Decisões Arquiteturais](#decisões-arquiteturais)
- [Autenticação](#autenticação)
- [Integração com API Externa](#integração-com-api-externa)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## Visão Geral

O frontend se comunica com a API REST do backend via Axios, gerencia autenticação por token JWT armazenado no `localStorage`, e oferece as seguintes funcionalidades:

- Registro e login de usuários
- Dashboard com listagem e busca de cursos
- Criação, edição e exclusão de cursos (apenas pelo criador)
- Gerenciamento de aulas por curso (adicionar, editar, excluir)
- Exibição de um "Palestrante Convidado" via API externa (RandomUser API)
- Feedback visual em todas as ações (toasts de sucesso/erro/aviso)

---

## Stack e Dependências

| Tecnologia | Uso |
|---|---|
| React 18 | Biblioteca principal de UI |
| React Router DOM v6 | Roteamento entre páginas |
| Axios | Cliente HTTP para comunicação com o backend |
| Tailwind CSS | Estilização por classes utilitárias |
| Sonner | Notificações toast de feedback ao usuário |
| Lucide React | Biblioteca de ícones SVG |
| Vite | Bundler e servidor de desenvolvimento |

---

## Como Rodar

**Pré-requisitos:** Node.js 18+ e npm instalados.

```bash
# 1. Entre na pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (veja seção abaixo)
cp .env.example .env

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> O backend precisa estar rodando para que as funcionalidades de autenticação e CRUD funcionem. Consulte o README do backend para subi-lo.

**Build para produção:**

```bash
npm run build
```

---

## Estrutura de Pastas

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── AuthLayout.jsx
│   │   ├── CourseCard.jsx
│   │   ├── CourseForm.jsx
│   │   ├── EmptyState.jsx
│   │   ├── FormField.jsx
│   │   ├── LessonItem.jsx
│   │   ├── LessonModal.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   └── PageHeader.jsx
│   ├── pages/              # Páginas da aplicação (uma por rota)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── CreateCourse.jsx
│   │   └── EditCourse.jsx
│   ├── services/
│   │   └── api.js          # Instância Axios configurada
│   ├── App.jsx             # Definição de rotas
│   └── main.jsx            # Ponto de entrada
├── .env.example
├── index.html
├── tailwind.config.js
└── vite.config.js
```

---

## Páginas

### `/register` — Registro
Formulário de criação de conta com campos de nome, e-mail e senha. Valida campos obrigatórios e tamanho mínimo da senha (6 caracteres) antes de chamar a API. Ao criar a conta com sucesso, redireciona para o login.

### `/login` — Login
Formulário de autenticação. Ao receber o token e os dados do usuário, persiste ambos no `localStorage` e redireciona para o dashboard.

### `/dashboard` — Lista de Cursos
Lista todos os cursos disponíveis na plataforma. Possui campo de busca por nome que dispara uma nova requisição ao backend. Cursos criados pelo usuário logado exibem o badge **"Meu curso"** em verde. Redireciona para os detalhes ao clicar em um card.

### `/courses/new` — Criar Curso
Formulário com nome, descrição, data de início e data de término. Valida se a data de término não é anterior à de início antes de submeter.

### `/courses/:id` — Detalhes do Curso
Exibe as informações completas do curso e sua lista de aulas. O proprietário do curso tem acesso às ações de editar e excluir o curso, e de gerenciar aulas (adicionar, editar, excluir). Usuários não proprietários têm acesso somente leitura. Exibe também um card de "Palestrante Convidado" gerado pela RandomUser API.

### `/courses/:id/edit` — Editar Curso
Mesmo formulário de criação, porém pré-populado com os dados atuais do curso. Acessível apenas pelo criador do curso.

---

## Componentes

A interface foi organizada em componentes reutilizáveis para eliminar duplicação de código e centralizar estilos e comportamentos.

### `AuthLayout`
Wrapper das páginas de autenticação. Encapsula o container centralizado, o card branco e o cabeçalho com título e subtítulo. Recebe `title`, `subtitle` e `children`.

### `FormField`
Combinação de `<label>` + `<input>` com estilo padronizado. Aceita as mesmas props de um input nativo (`type`, `placeholder`, `value`, `onChange`, `required`, `minLength`). Garante visual consistente em todos os formulários.

### `Navbar`
Barra de navegação do dashboard com logo, nome do usuário e botão de logout. Encapsula a lógica de logout (limpeza do `localStorage` e redirecionamento). Recebe `userName` como prop opcional.

### `CourseCard`
Card clicável que representa um curso na listagem. Exibe nome, descrição (truncada), datas e badge de propriedade. Recebe o objeto `course` completo e `userId` para determinar se exibe o badge "Meu curso".

### `CourseForm`
Formulário compartilhado entre `CreateCourse` e `EditCourse`. Gerencia os campos nome, descrição, data de início e data de término. Recebe `values` (objeto com todos os campos), `onChange` (atualiza o objeto inteiro), `onSubmit` e `isLoading`.

### `EmptyState`
Bloco de estado vazio com borda tracejada e mensagem centralizada. Usado no dashboard (sem cursos) e nos detalhes do curso (sem aulas). Recebe `message` como prop.

### `PageHeader`
Navbar interna das páginas de detalhe/criação/edição. Contém botão de voltar com link configurável (`backTo`) e slot opcional `actions` para injetar botões específicos de cada página (editar, excluir, etc).

### `LessonItem`
Card de uma aula individual na lista. Exibe título, badge de rascunho (quando aplicável), link para o vídeo e botões de editar/excluir para o proprietário. Recebe `lesson`, `isOwner`, `onEdit` e `onDelete`.

### `LessonModal`
Modal unificado de criação e edição de aulas. Detecta o modo automaticamente pela presença de `lesson.id`: sem ID = modo adicionar, com ID = modo editar. Adapta título e texto do botão de acordo. Recebe `lesson`, `onSubmit` e `onClose`.

### `LoadingSpinner`
Ícone de carregamento centralizado na tela cheia, usado em `EditCourse` enquanto os dados do curso são buscados. Padroniza o estado de loading da aplicação.

---

## Decisões Arquiteturais

**Componentização orientada à reutilização**
Cada componente foi extraído quando o mesmo bloco de JSX aparecia em duas ou mais páginas, ou quando um bloco isolado tinha responsabilidade clara o suficiente para ser independente. O resultado é que nenhuma página ultrapassa sua responsabilidade — elas orquestram estado e lógica de negócio, delegando visual aos componentes.

**Estado de formulário como objeto único**
`CreateCourse`, `EditCourse` e `LessonModal` usam um único `useState` com objeto (`{ name, description, startDate, endDate }`) ao invés de um estado separado por campo. Cada `onChange` atualiza o objeto via spread (`{ ...values, campo: valor }`), reduzindo o número de estados e tornando o reset e a inicialização triviais.

**Modal unificado para adicionar e editar aulas**
O `CourseDetails` original tinha dois blocos de JSX quase idênticos e dois estados separados (`showLessonForm` + `editingLesson`). A solução foi um único estado `modalLesson` com três valores possíveis: `null` (fechado), objeto sem `id` (criar), objeto com `id` (editar). O componente `LessonModal` detecta o modo internamente.

**Lógica de autenticação nos componentes de layout**
A lógica de logout (`localStorage.removeItem` + `navigate`) foi movida para dentro de `Navbar`, que é o único componente que exibe o botão de sair. Isso elimina a necessidade de receber callbacks das páginas pai e torna o comportamento consistente em toda a aplicação.

**Separação clara entre `isLoading` e `isSaving`**
Em `EditCourse`, dois estados de loading distintos cumprem papéis diferentes: `isLoading` controla o spinner de tela cheia durante o fetch inicial dos dados, e `isSaving` desabilita o botão de submit durante o PUT. Mesclá-los em um único booleano causaria o formulário piscar ou desaparecer durante o salvamento.

---

## Autenticação

O token JWT retornado pelo login é salvo em `localStorage` com a chave `@CourseSphere:token`. Os dados do usuário (id, nome) são salvos em `@CourseSphere:user`.

A instância Axios em `src/services/api.js` injeta o token automaticamente no header `Authorization: Bearer <token>` em todas as requisições, via interceptor de request. Isso garante que nenhuma página precise gerenciar o header manualmente.

```js
// src/services/api.js (comportamento esperado)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@CourseSphere:token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

Rotas protegidas redirecionam para `/login` quando o token não está presente.

---

## Integração com API Externa

Na página de detalhes do curso, é feita uma requisição à [RandomUser API](https://randomuser.me/) para exibir um "Palestrante Convidado" fictício com foto, nome e país de origem. Os dados **não são persistidos** — são buscados a cada carregamento da página e exibidos apenas como ilustração.

```js
const response = await fetch('https://randomuser.me/api/');
const data = await response.json();
setGuestInstructor(data.results[0]);
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do `frontend/` com o seguinte conteúdo:

```env
VITE_API_URL=http://localhost:3333
```

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API do backend | `http://localhost:3333` |