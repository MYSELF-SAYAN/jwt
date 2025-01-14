import express from 'express';
import pool from '../config/db.js'; // Use ES6 imports
import argon2 from 'argon2';
import sign from '../utils/signJwt.js';
import jwtMiddleware from '../utils/jwt.js';
import crypto from 'crypto';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required: username, email, and password' });
  }
  try {
   
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id, 
    });

    
    const apiKey = crypto.randomBytes(32).toString('hex');

    
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS "user" (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          api_key VARCHAR(64) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    await pool.query(createTableQuery);

    
    const creationQuery = `
      INSERT INTO "user" (name, email, password, api_key) 
      VALUES ($1, $2, $3, $4) RETURNING api_key`;

    const result = await pool.query(creationQuery, [username, email, hashedPassword, apiKey]);

    res.status(200).json({
      message: 'User created successfully',
      api_key: result.rows[0].api_key,
    });
  } catch (error) {
    console.error('Failed to create user', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];
    
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = sign({ payload: userWithoutPassword });
    res.status(200).json({ message: "Success", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/getUser', jwtMiddleware, async (req, res) => {
  try {
    const user = req.datas;
    const data = await pool.query('SELECT name, email, id, api_key FROM "user" WHERE email = $1', [user.email]);

    if (data.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: data.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete User Route
router.delete('/delUser', jwtMiddleware, async (req, res) => {
  try {
    const id = req.datas;
    const delQuery = 'DELETE FROM "user" WHERE id = $1';
    const result = await pool.query(delQuery, [id.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
