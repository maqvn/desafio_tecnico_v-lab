import { pool } from '../config/database.js';

export const getLessonsByCourseAuth = async (courseId) => {
  const query = `
    SELECT * FROM lessons 
    WHERE course_id = $1 
    ORDER BY created_at ASC
  `;
  const result = await pool.query(query, [courseId]);
  return result.rows;
};

export const getLessonsByCourseNotAuth = async (courseId) => {
  const query = `
    SELECT * FROM lessons 
    WHERE course_id = $1 AND status = 'published' 
    ORDER BY created_at ASC
  `;
  const result = await pool.query(query, [courseId]);
  return result.rows;
};

export const findLessonById = async (id) => {
  const query = 'SELECT * FROM lessons WHERE id = $1';
  const result = await pool.query(query, [id]);
  
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const insertLesson = async ({ title, video_url, status, course_id }) => {
  const query = `
    INSERT INTO lessons (title, video_url, status, course_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  const values = [title, video_url, status, course_id];
  const result = await pool.query(query, values);
  
  return result.rows[0];
};

export const modifyLesson = async (id, { title, video_url, status }) => {
  const query = `
    UPDATE lessons 
    SET title = $1, video_url = $2, status = $3
    WHERE id = $4
    RETURNING *
  `;
  
  const values = [title, video_url, status, id];
  const result = await pool.query(query, values);
  
  return result.rows[0];
};

export const removeLesson = async (id) => {
  const query = 'DELETE FROM lessons WHERE id = $1';
  await pool.query(query, [id]);
};