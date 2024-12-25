// app.js
import express from 'express';
import authRoute from './routes/auth.js'; 
import contactsRoute from './routes/contacts.js';
const app = express();

app.use(express.json());

app.use("/api/auth", authRoute);
app.use('/api/contacts', contactsRoute);
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
