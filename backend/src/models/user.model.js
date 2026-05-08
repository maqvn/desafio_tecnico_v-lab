import { pool } from '../config/database.js';

export const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const createUser = async ({ name, email, password }) => {
  const query = `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3) 
    RETURNING id, name, email
  `;
  const result = await pool.query(query, [name, email, password]);
  
  return result.rows[0];
};