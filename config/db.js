import pkg from 'pg';

import dotenv from 'dotenv';
const { Pool } = pkg;
dotenv.config(); 


const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: false, 
});

export default pool;
