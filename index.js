const express = require('express');
const path = require('path');
const authRoute=require('./routes/auth');
const app = express();


app.use(express.json());

app.use("/api/auth",authRoute);


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
