const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const sign = require('../utils/signJwt');
const decode = require('../utils/decodeJwt')
const jwtMiddleware = require('../utils/jwt')
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS "user" (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    await pool.query(createTableQuery);
    const creation = `
      insert into "user" (name,email,password) values ('${username}','${email}','${hashedPassword}')
      `
    await pool.query(creation);
    res.status(200).json({ message: 'Data added succesfully' });
  } catch (error) {
    console.error('Failed to add data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query(`select * from "user" where email = '${email}'`);
    const validPassword = await bcrypt.compare(password, user.rows[0].password)
    if (!validPassword) {
      res.status(401).json({ message: "Invalid password" });
    }
    else {
      const { password: _, ...userWithoutPassword } = user.rows[0];
      const token = sign({ payload: userWithoutPassword });
      res.status(200).json({ message: "success", token: token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.get('/getUser', jwtMiddleware, async (req, res) => {
  const reqHeader = req.headers["authorization"];

  try {

    // console.log("token   ", reqHeader.split(' ')[1]);
    const token = reqHeader.split(' ')[1];
    const data = decode({ token: token });
    res.status(200).json({ data: data });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.delete('/delUser', async (req, res) => {
  const { id } = req.body;
  try {
    const del = `delete  from "user" where id=${id}`
    await pool.query(del);
    res.json({ message: "user deleted" })
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

})

module.exports = router;