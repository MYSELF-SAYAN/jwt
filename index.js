// app.js
import express from 'express';
import logger from "./config/logger.js";
import morgan from "morgan";
import authRoute from './routes/auth.js';
import contactsRoute from './routes/contacts.js';
const app = express();

app.use(express.json());
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.use("/api/auth", authRoute);
app.use('/api/contacts', contactsRoute);
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
