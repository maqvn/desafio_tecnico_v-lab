import request from 'supertest';
import app from '../app.js';

// ----------------------------------------------------------------
// Testes de Cursos
// Cobre: autenticação, criação, listagem, atualização, exclusão
// e verificação de posse (403 Forbidden)
// ----------------------------------------------------------------

const AUTH = '/api/auth';
const COURSES = '/api/courses';

// Helpers
const uniqueEmail = () => `course_test_${Date.now()}@example.com`;

async function createUserAndLogin(name = 'Test User') {
  const email = uniqueEmail();
  await request(app)
    .post(`${AUTH}/register`)
    .send({ name, email, password: 'senha123' });

  const loginRes = await request(app)
    .post(`${AUTH}/login`)
    .send({ email, password: 'senha123' });

  return { token: loginRes.body.token, userId: loginRes.body.user.id };
}

const validCourse = {
  name: 'Curso de Jest',
  description: 'Aprenda testes com Jest',
  start_date: '2025-01-01',
  end_date: '2025-12-31',
};

// ----------------------------------------------------------------

describe('Courses — Autenticação', () => {
  test('GET /api/courses deve retornar 401 sem token', async () => {
    const res = await request(app).get(COURSES);
    expect(res.status).toBe(401);
  });

  test('POST /api/courses deve retornar 401 sem token', async () => {
    const res = await request(app).post(COURSES).send(validCourse);
    expect(res.status).toBe(401);
  });
});

// ----------------------------------------------------------------

describe('Courses — CRUD', () => {
  let token;
  let createdCourseId;

  beforeAll(async () => {
    const user = await createUserAndLogin('Owner User');
    token = user.token;
  });

  test('POST /api/courses deve criar curso e retornar 201', async () => {
    const res = await request(app)
      .post(COURSES)
      .set('Authorization', `Bearer ${token}`)
      .send(validCourse);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(validCourse.name);
    createdCourseId = res.body.id;
  });

  test('GET /api/courses deve listar cursos com 200', async () => {
    const res = await request(app)
      .get(COURSES)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/courses?search= deve filtrar por nome', async () => {
    const res = await request(app)
      .get(`${COURSES}?search=Jest`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.some(c => c.name.includes('Jest'))).toBe(true);
  });

  test('GET /api/courses/:id deve retornar o curso criado', async () => {
    const res = await request(app)
      .get(`${COURSES}/${createdCourseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdCourseId);
  });

  test('GET /api/courses/:id deve retornar 404 para id inexistente', async () => {
    const res = await request(app)
      .get(`${COURSES}/9999999`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  test('PUT /api/courses/:id deve atualizar o curso e retornar 200', async () => {
    const res = await request(app)
      .put(`${COURSES}/${createdCourseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validCourse, name: 'Curso Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Curso Atualizado');
  });

  test('DELETE /api/courses/:id deve excluir o curso e retornar 204', async () => {
    const res = await request(app)
      .delete(`${COURSES}/${createdCourseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});

// ----------------------------------------------------------------

describe('Courses — Regras de Posse (403 Forbidden)', () => {
  let ownerToken;
  let otherToken;
  let courseId;

  beforeAll(async () => {
    const owner = await createUserAndLogin('Owner');
    const other = await createUserAndLogin('Other');
    ownerToken = owner.token;
    otherToken = other.token;

    const res = await request(app)
      .post(COURSES)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(validCourse);
    courseId = res.body.id;
  });

  test('outro usuário não pode editar o curso (403)', async () => {
    const res = await request(app)
      .put(`${COURSES}/${courseId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ ...validCourse, name: 'Tentativa Invasão' });

    expect(res.status).toBe(403);
  });

  test('outro usuário não pode deletar o curso (403)', async () => {
    const res = await request(app)
      .delete(`${COURSES}/${courseId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });
});

// ----------------------------------------------------------------

describe('Courses — Validações', () => {
  let token;

  beforeAll(async () => {
    const user = await createUserAndLogin('Validator');
    token = user.token;
  });

  test('deve retornar 400 quando end_date é anterior a start_date', async () => {
    const res = await request(app)
      .post(COURSES)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Datas Inválidas',
        description: 'test',
        start_date: '2025-12-31',
        end_date: '2025-01-01',
      });

    expect(res.status).toBe(400);
  });

  test('deve retornar 400 quando name tem menos de 3 caracteres', async () => {
    const res = await request(app)
      .post(COURSES)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validCourse, name: 'AB' });

    expect(res.status).toBe(400);
  });
});
