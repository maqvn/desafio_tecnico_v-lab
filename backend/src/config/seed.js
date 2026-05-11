import 'dotenv/config';
import bcrypt from 'bcrypt';
import { pool } from './database.js';

const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@coursesphere.com',
  password: 'demo1234',
};

const DEMO_COURSES = [
  {
    name: 'Introdução ao JavaScript',
    description: 'Fundamentos da linguagem mais popular da web: variáveis, funções, closures e muito mais.',
    start_date: '2025-03-01',
    end_date: '2025-06-30',
  },
  {
    name: 'React do Zero ao Avançado',
    description: 'Aprenda React com hooks, Context API, roteamento e integração com APIs REST.',
    start_date: '2025-07-01',
    end_date: '2025-12-31',
  },
  {
    name: 'Node.js e APIs RESTful',
    description: 'Construa APIs escaláveis com Express, PostgreSQL, autenticação JWT e boas práticas.',
    start_date: '2025-08-01',
    end_date: '2026-02-28',
  },
];

const DEMO_LESSONS = [
  { title: 'Variáveis e Tipos', status: 'published', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', courseIndex: 0 },
  { title: 'Funções e Arrow Functions', status: 'published', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', courseIndex: 0 },
  { title: 'Closures e Escopo', status: 'draft', video_url: null, courseIndex: 0 },
  { title: 'Componentes e Props', status: 'published', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', courseIndex: 1 },
  { title: 'useState e useEffect', status: 'published', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', courseIndex: 1 },
  { title: 'Roteamento com React Router', status: 'draft', video_url: null, courseIndex: 1 },
  { title: 'Setup do Express', status: 'published', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', courseIndex: 2 },
  { title: 'Autenticação com JWT', status: 'published', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', courseIndex: 2 },
];

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    const checkUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [DEMO_USER.email]
    );

    let userId;

    if (checkUser.rows.length > 0) {
      userId = checkUser.rows[0].id;
      console.log(`ℹ️  Usuário demo já existe (id=${userId}). Pulando criação.\n`);
    } else {
      const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);
      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        [DEMO_USER.name, DEMO_USER.email, passwordHash]
      );
      userId = result.rows[0].id;
      console.log(`✅ Usuário demo criado (id=${userId})\n`);
    }

    const courseIds = [];
    for (const course of DEMO_COURSES) {
      const existing = await pool.query(
        'SELECT id FROM courses WHERE name = $1 AND creator_id = $2',
        [course.name, userId]
      );

      if (existing.rows.length > 0) {
        courseIds.push(existing.rows[0].id);
        console.log(`ℹ️  Curso "${course.name}" já existe. Pulando.`);
      } else {
        const result = await pool.query(
          `INSERT INTO courses (name, description, start_date, end_date, creator_id)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [course.name, course.description, course.start_date, course.end_date, userId]
        );
        courseIds.push(result.rows[0].id);
        console.log(`✅ Curso "${course.name}" criado.`);
      }
    }

    console.log('\n--- Aulas ---');
    for (const lesson of DEMO_LESSONS) {
      const courseId = courseIds[lesson.courseIndex];
      if (!courseId) continue;

      const existing = await pool.query(
        'SELECT id FROM lessons WHERE title = $1 AND course_id = $2',
        [lesson.title, courseId]
      );

      if (existing.rows.length > 0) {
        console.log(`ℹ️  Aula "${lesson.title}" já existe. Pulando.`);
      } else {
        await pool.query(
          `INSERT INTO lessons (title, status, video_url, course_id)
           VALUES ($1, $2, $3, $4)`,
          [lesson.title, lesson.status, lesson.video_url, courseId]
        );
        console.log(`✅ Aula "${lesson.title}" criada.`);
      }
    }

    console.log('\n🎉 Seed concluído com sucesso!\n');
    console.log('━'.repeat(40));
    console.log('  Credenciais do usuário demo:');
    console.log(`  E-mail : ${DEMO_USER.email}`);
    console.log(`  Senha  : ${DEMO_USER.password}`);
    console.log('━'.repeat(40));

  } catch (error) {
    console.error('\n❌ Erro durante o seed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
