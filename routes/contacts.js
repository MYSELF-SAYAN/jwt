import express from 'express';
import pool from '../config/db.js'; // Use ES6 imports
import redis from '../config/redis.js';
import jwtMiddleware from '../utils/jwt.js';
import logger from '../config/logger.js';
const router = express.Router()

//Add books in database
router.post("/addContact", jwtMiddleware, async (req, res) => {
    try {
        const id = req.datas.id;
        const { name, email, mobile } = req.body;

        if (!id || !name || !email || !mobile) {
            console.error('Missing required fields:', { id, name, email, mobile });
            return res.status(400).json("Missing required fields");
        }

        const createTable = `
        CREATE TABLE IF NOT EXISTS "contacts" (
          id SERIAL PRIMARY KEY,
          userId VARCHAR(255) NOT NULL ,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          mobile VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
        await pool.query(createTable);

        const addData = `
        INSERT INTO "contacts" (userId, name, email, mobile)
        VALUES ($1, $2, $3, $4)
        `;
        
        // Log the query and values before executing it
        console.log('Executing query with values:', [id, name, email, mobile]);
        
        const response = await pool.query(addData, [id, name, email, mobile]);

        console.log('Data inserted successfully:', response);
        
        return res.status(200).json("Entry added successfully");
    } catch (e) {
        console.error('Error inserting data:', e);
        return res.status(500).json("Internal server error");
    }
});

router.get("/",jwtMiddleware,async(req,res)=>{
    try{
        const id=req.datas.id;
        const cachedData=await redis.get('contacts')
        if(cachedData){
            logger.info("Fetching data from redis")
            return res.status(200).json(JSON.parse(cachedData))
        }

        const getData=`select * from "contacts" where userid=$1`
        const data= await pool.query(getData,[id])
        await redis.set('contacts',JSON.stringify(data.rows))
        await redis.expire('contacts',20)
        logger.info("Fetching data from database")
        res.status(200).json({ message: "All datas ", data: data.rows })
    }catch(e){
        console.log(e)
        res.status(500).json("Internal server error")
    }
})
export default router