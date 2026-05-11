import request from 'supertest';
import app from '../app.js';

// ----------------------------------------------------------------
// Testes de Aulas
// Cobre: criação, filtro de status por dono vs. não-dono,
// verificação de posse e validações
// ----------------------------------------------------------------

const AUTH = '/api/auth';
const COURSES = '/api/courses';
const LESSONS = '/api/lessons';

const uniqueEmail = () => `lesson_test_${Date.now()}@example.com`;

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
  name: 'Curso de Aulas',
  description: 'Para testes de aulas',
  start_date: '2025-01-01',
  end_date: '2025-12-31',
};

// ----------------------------------------------------------------

describe('Lessons — CRUD e filtro de visibilidade', () => {
  let ownerToken;
  let otherToken;
  let courseId;
  let publishedLessonId;
  let draftLessonId;

  beforeAll(async () => {
    const owner = await createUserAndLogin('Lesson Owner');
    const other = await createUserAndLogin('Other User');
    ownerToken = owner.token;
    otherToken = other.token;

    // Cria curso para usar nos testes de aulas
    const courseRes = await request(app)
      .post(COURSES)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(validCourse);
    courseId = courseRes.body.id;
  });

  test('POST /api/lessons deve criar aula publicada e retornar 201', async () => {
    const res = await request(app)
      .post(LESSONS)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Introdução',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        status: 'published',
        course_id: courseId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    publishedLessonId = res.body.id;
  });

  test('POST /api/lessons deve criar aula draft e retornar 201', async () => {
    const res = await request(app)
      .post(LESSONS)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Aula Rascunho',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        status: 'draft',
        course_id: courseId,
      });

    expect(res.status).toBe(201);
    draftLessonId = res.body.id;
  });

  test('dono vê aulas published E draft', async () => {
    const res = await request(app)
      .get(`${LESSONS}/course/${courseId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    const statuses = res.body.map(l => l.status);
    expect(statuses).toContain('published');
    expect(statuses).toContain('draft');
  });

  test('outro usuário vê apenas aulas published', async () => {
    const res = await request(app)
      .get(`${LESSONS}/course/${courseId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.every(l => l.status === 'published')).toBe(true);
  });

  test('PUT /api/lessons/:id deve atualizar aula e retornar 200', async () => {
    const res = await request(app)
      .put(`${LESSONS}/${publishedLessonId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Introdução Atualizada',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        status: 'published',
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Introdução Atualizada');
  });

  test('DELETE /api/lessons/:id deve remover aula e retornar 204', async () => {
    const res = await request(app)
      .delete(`${LESSONS}/${draftLessonId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(204);
  });
});

// ----------------------------------------------------------------

describe('Lessons — Verificação de Posse (403)', () => {
  let ownerToken;
  let otherToken;
  let lessonId;

  beforeAll(async () => {
    const owner = await createUserAndLogin('Lesson Owner 2');
    const other = await createUserAndLogin('Intruder');
    ownerToken = owner.token;
    otherToken = other.token;

    const courseRes = await request(app)
      .post(COURSES)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(validCourse);
    const courseId = courseRes.body.id;

    const lessonRes = await request(app)
      .post(LESSONS)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Aula Protegida',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        status: 'published',
        course_id: courseId,
      });
    lessonId = lessonRes.body.id;
  });

  test('outro usuário não pode criar aula em curso alheio (403)', async () => {
    // Cria um curso do owner e tenta criar aula com outro token
    const ownerRes = await createUserAndLogin('New Owner');
    const courseRes = await request(app)
      .post(COURSES)
      .set('Authorization', `Bearer ${ownerRes.token}`)
      .send(validCourse);

    const res = await request(app)
      .post(LESSONS)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        title: 'Invasão',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        status: 'published',
        course_id: courseRes.body.id,
      });

    expect(res.status).toBe(403);
  });

  test('outro usuário não pode editar aula alheia (403)', async () => {
    const res = await request(app)
      .put(`${LESSONS}/${lessonId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        title: 'Invasão',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        status: 'published',
      });

    expect(res.status).toBe(403);
  });

  test('outro usuário não pode deletar aula alheia (403)', async () => {
    const res = await request(app)
      .delete(`${LESSONS}/${lessonId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });
});
