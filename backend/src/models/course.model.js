import { pool } from '../config/database.js';

export const getAllCourses = async (searchQuery = '') => {
  const baseQuery = 'SELECT * FROM courses';
  const hasSearchFilter = searchQuery.length > 0;

  if (hasSearchFilter) {
    const filteredQuery = `${baseQuery} WHERE name ILIKE $1 ORDER BY created_at DESC`;
    const searchPattern = `%${searchQuery}%`;
    const result = await pool.query(filteredQuery, [searchPattern]);
    return result.rows;
  }

  const result = await pool.query(`${baseQuery} ORDER BY created_at DESC`);
  return result.rows;
};

export const findCourseById = async (id) => {
  const query = `SELECT * FROM courses WHERE id = $1`;
  const result = await pool.query(query, [id]);
  
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const insertCourse = async ({ name, description, start_date, end_date, creator_id }) => {
  const query = `
    INSERT INTO courses (name, description, start_date, end_date, creator_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  
  const values = [name, description, start_date, end_date, creator_id];
  const result = await pool.query(query, values);
  
  return result.rows[0];
};

export const modifyCourse = async (id, { name, description, start_date, end_date }) => {
  const query = `
    UPDATE courses 
    SET name = $1, description = $2, start_date = $3, end_date = $4
    WHERE id = $5
    RETURNING *
  `;

  const values = [name, description, start_date, end_date, id];
  const result = await pool.query(query, values);
  
  return result.rows[0];
};

export const removeCourse = async (id) => {
  const query = 'DELETE FROM courses WHERE id = $1';
  await pool.query(query, [id]);
};