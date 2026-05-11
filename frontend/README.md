# CourseSphere — Frontend

> Documentação específica do SPA. Para visão geral, setup completo e credenciais de teste, consulte o [README raiz](../README.md).

Interface React para a plataforma CourseSphere, desenvolvida como parte do desafio técnico Full Stack da V-LAB UFPE.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Stack](#stack)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Páginas](#páginas)
- [Componentes](#componentes)
- [Testes](#testes)
- [Autenticação no Cliente](#autenticação-no-cliente)
- [Integração com API Externa](#integração-com-api-externa)
- [Decisões Arquiteturais](#decisões-arquiteturais)

---

## Visão Geral

O frontend se comunica com a API REST via Axios, gerencia autenticação por JWT no `localStorage` e oferece:

- Registro e login de usuários
- Dashboard com listagem, busca e paginação de cursos
- CRUD de cursos (apenas pelo criador)
- Gerenciamento de aulas: adicionar, editar, excluir
- Filtro de aulas por status (Todas / Publicadas / Rascunho)
- Palestrante Convidado via RandomUser API
- Feedback visual em todas as ações (toasts Sonner + skeleton loading)

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | Biblioteca de UI |
| React Router DOM | 7 | Roteamento SPA |
| Axios | 1.x | Cliente HTTP com interceptor JWT |
| Tailwind CSS | 3 | Estilização utilitária |
| Sonner | 2.x | Notificações toast |
| Lucide React | 1.x | Ícones SVG |
| Vite | 8 | Bundler e dev server |
| Vitest | 4.x | Runner de testes |
| React Testing Library | 16.x | Testes de componente |

---

## Estrutura de Pastas

```
frontend/
├── src/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── __tests__/           # Testes de componente (Vitest + RTL)
│   │   │   ├── CourseCard.test.jsx
│   │   │   ├── EmptyState.test.jsx
│   │   │   └── LessonModal.test.jsx
│   │   ├── AuthLayout.jsx       # Wrapper das páginas de auth
│   │   ├── CourseCard.jsx       # Card clicável da listagem
│   │   ├── CourseForm.jsx       # Formulário shared (criar/editar)
│   │   ├── EmptyState.jsx       # Estado vazio genérico
│   │   ├── FormField.jsx        # label + input padronizado
│   │   ├── LessonItem.jsx       # Card de aula individual
│   │   ├── LessonModal.jsx      # Modal unificado criar/editar aula
│   │   ├── LoadingSpinner.jsx   # Spinner de tela cheia
│   │   ├── NavBar.jsx           # Barra de navegação com logout
│   │   └── PageHeader.jsx       # Header interno com botão voltar
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx        # Listagem + busca + paginação
│   │   ├── CourseDetails.jsx    # Detalhes + aulas + filtro de status
│   │   ├── CreateCourse.jsx
│   │   └── EditCourse.jsx
│   ├── services/
│   │   └── api.js               # Instância Axios + interceptor JWT
│   ├── test/
│   │   └── setup.js             # jest-dom para Vitest
│   ├── App.jsx                  # Rotas + PrivateRoute
│   └── main.jsx
├── .env.example
├── vite.config.js               # Vite + config Vitest
└── package.json
```

---

## Páginas

### `/register` — Registro
Formulário de criação de conta com nome, e-mail e senha. Valida campos obrigatórios e tamanho mínimo da senha (6 caracteres) antes de chamar a API. Ao criar a conta com sucesso, redireciona para o login.

### `/login` — Login
Formulário de autenticação. Ao receber o token, persiste `token` e `user` no `localStorage` e redireciona para o dashboard.

### `/dashboard` — Lista de Cursos
Lista todos os cursos disponíveis com campo de busca por nome (dispara requisição ao backend) e paginação de 9 itens por página (Anterior / números / Próximo). Cursos do usuário logado exibem badge **"Meu curso"**.

### `/courses/new` — Criar Curso
Formulário com nome, descrição, data de início e data de término. Valida se `end_date ≥ start_date` antes de submeter.

### `/courses/:id` — Detalhes do Curso
Exibe informações completas do curso, lista de aulas com **filtro de status** (Todas / Publicadas / Rascunho com contadores), e card de Palestrante Convidado (RandomUser API). O proprietário tem acesso a editar/excluir curso e gerenciar aulas.

### `/courses/:id/edit` — Editar Curso
Mesmo formulário de criação, pré-populado com os dados do curso. Acessível apenas pelo criador.

---

## Componentes

| Componente | Responsabilidade |
|---|---|
| `AuthLayout` | Wrapper das páginas de auth: container, card e cabeçalho |
| `FormField` | `<label>` + `<input>` com estilo padronizado |
| `NavBar` | Logo, nome do usuário, logout (limpa localStorage e redireciona) |
| `CourseCard` | Card clicável com nome, descrição truncada, datas e badge de propriedade |
| `CourseForm` | Formulário compartilhado entre `CreateCourse` e `EditCourse` |
| `EmptyState` | Bloco de estado vazio com mensagem configurável |
| `PageHeader` | Header interno com botão voltar e slot de `actions` |
| `LessonItem` | Card de aula: título, badge de status, link de vídeo, botões do dono |
| `LessonModal` | Modal unificado criar/editar aula (detecta modo pelo `lesson.id`) |
| `LoadingSpinner` | Spinner de tela cheia para estados de loading |

---

## Testes

```bash
npm test        # executa uma vez (CI)
npm run test:watch  # modo watch (desenvolvimento)
```

Vitest + React Testing Library com `jsdom` e `@testing-library/jest-dom`.

| Suite | Cobertura |
|---|---|
| `CourseCard.test.jsx` | Renderiza nome e descrição; exibe badge "Meu curso" quando `userId === creator_id`; exibe "Sem descrição disponível." quando vazio |
| `EmptyState.test.jsx` | Renderiza a mensagem passada via prop |
| `LessonModal.test.jsx` | Título e botão corretos no modo adicionar (sem `id`) e no modo editar (com `id`); pré-popula campo título; chama `onClose` ao clicar no botão X |

---

## Autenticação no Cliente

O token JWT e os dados do usuário são persistidos no `localStorage`:

```
@CourseSphere:token  →  string JWT
@CourseSphere:user   →  JSON { id, name, email }
```

A instância Axios em `services/api.js` injeta o token automaticamente via interceptor de request:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@CourseSphere:token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

O componente `PrivateRoute` em `App.jsx` redireciona para `/login` quando o token não está presente.

---

## Integração com API Externa

Na página de detalhes do curso, é feita uma requisição à [RandomUser API](https://randomuser.me/) para exibir um Palestrante Convidado fictício com foto, nome e país. Os dados **não são persistidos** — buscados a cada carregamento.

```js
const response = await fetch('https://randomuser.me/api/');
const data = await response.json();
setGuestInstructor(data.results[0]);
```

---

## Decisões Arquiteturais

**Componentização por reutilização** — componentes são extraídos quando o mesmo JSX aparece em duas ou mais páginas, ou quando o bloco tem responsabilidade isolada suficiente. Páginas orquestram estado e lógica; componentes cuidam do visual.

**Estado de formulário como objeto único** — `CreateCourse`, `EditCourse` e `LessonModal` usam um único `useState` com objeto (`{ name, description, startDate, endDate }`). Cada `onChange` faz spread (`{ ...values, campo: valor }`), tornando reset e inicialização triviais.

**Modal unificado para criar/editar aulas** — Um único estado `modalLesson` com três valores: `null` (fechado), objeto sem `id` (criar), objeto com `id` (editar). `LessonModal` detecta o modo internamente — elimina dois blocos JSX quase idênticos.

**Filtro de status client-side** — O backend já filtra visibilidade por dono vs. não-dono. O filtro de tabs na UI é puramente local (`.filter()` no array recebido), sem round-trips adicionais.

**`isLoading` vs. `isSaving` em EditCourse** — Dois estados distintos: `isLoading` controla o spinner de tela cheia no fetch inicial; `isSaving` desabilita o botão de submit durante o PUT. Mesclá-los causaria o formulário piscar ao salvar.

**Paginação client-side** — Os cursos são buscados em uma única requisição e paginados localmente (`Array.slice`). Para o volume esperado, isso é mais simples e elimina round-trips extras ao banco.
