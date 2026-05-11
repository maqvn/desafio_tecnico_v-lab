import request from 'supertest';
import app from '../app.js';

// ----------------------------------------------------------------
// Testes de Autenticação
// POST /api/auth/register e POST /api/auth/login
// ----------------------------------------------------------------

const BASE = '/api/auth';

// Gera um e-mail único para evitar conflito entre execuções
const uniqueEmail = () => `test_${Date.now()}@example.com`;

describe('Auth — POST /api/auth/register', () => {
  test('deve criar um usuário e retornar 201 com os dados (sem senha)', async () => {
    const email = uniqueEmail();
    const res = await request(app)
      .post(`${BASE}/register`)
      .send({ name: 'Jest User', email, password: 'senha123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', email);
    expect(res.body).not.toHaveProperty('password');
  });

  test('deve retornar 400 quando campos obrigatórios estão ausentes', async () => {
    const res = await request(app)
      .post(`${BASE}/register`)
      .send({ email: uniqueEmail() }); // sem name e password

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('deve retornar 409 quando o e-mail já está cadastrado', async () => {
    const email = uniqueEmail();
    // Primeiro registro
    await request(app)
      .post(`${BASE}/register`)
      .send({ name: 'Primeiro', email, password: 'senha123' });

    // Segundo registro com mesmo e-mail
    const res = await request(app)
      .post(`${BASE}/register`)
      .send({ name: 'Duplicado', email, password: 'outrasenha' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Auth — POST /api/auth/login', () => {
  let registeredEmail;

  beforeAll(async () => {
    registeredEmail = uniqueEmail();
    await request(app)
      .post(`${BASE}/register`)
      .send({ name: 'Login Test', email: registeredEmail, password: 'senha123' });
  });

  test('deve autenticar e retornar token + dados do usuário', async () => {
    const res = await request(app)
      .post(`${BASE}/login`)
      .send({ email: registeredEmail, password: 'senha123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', registeredEmail);
    expect(res.body.user).not.toHaveProperty('password');
  });

  test('deve retornar 401 para senha incorreta', async () => {
    const res = await request(app)
      .post(`${BASE}/login`)
      .send({ email: registeredEmail, password: 'senhaerrada' });

    expect(res.status).toBe(401);
  });

  test('deve retornar 401 para e-mail não cadastrado', async () => {
    const res = await request(app)
      .post(`${BASE}/login`)
      .send({ email: 'naoexiste@example.com', password: 'qualquer' });

    expect(res.status).toBe(401);
  });

  test('deve retornar 400 quando campos obrigatórios estão ausentes', async () => {
    const res = await request(app)
      .post(`${BASE}/login`)
      .send({ email: registeredEmail }); // sem password

    expect(res.status).toBe(400);
  });
});
