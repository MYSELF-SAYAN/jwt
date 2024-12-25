import pkg from 'pg';

import dotenv from 'dotenv';
const { Pool } = pkg;
dotenv.config(); // Load environment variables from .env file

// Create a connection pool
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: false, // Set to true if using SSL in production
});

export default pool;
