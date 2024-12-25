import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file


const sign = ({ payload }) => {
    const data = {
        id: payload.id,
        name: payload.name,
        email:payload.email
    };

    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

export default sign;
