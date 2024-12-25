import express from 'express';
import pool from '../db.js'; // Use ES6 imports

import jwtMiddleware from '../utils/jwt.js';

const router = express.Router()

//Add books in database
router.post("/addContact", jwtMiddleware, async (req, res) => {
    try {
        const id = req.datas.id;
        const {name,email,mobile}=req.body
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
        `
        await pool.query(createTable)
        const addData=`
        insert into "contacts" (userId,name,email,mobile)
        values ($1,$2,$3,$4)
        `
        const response=await pool.query(addData,[id,name,email,mobile])
        return res.status(200).json("Entry added: ")
    } catch (e) {
        console.log(e)
        return res.status(500).json("Internal server error")
    }
})
router.get("/",jwtMiddleware,async(req,res)=>{
    try{
        const id=req.datas.id;
        const getData=`select * from "contacts" where userid=$1`
        const data= await pool.query(getData,[id])
        res.status(200).json(data.rows)
    }catch(e){
        console.log(e)
        res.status(500).json("Internal server error")
    }
})
export default router