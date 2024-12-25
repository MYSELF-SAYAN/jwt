import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file


const decode = ({ token }) => {
    try {
        if (!token) {
            throw new Error('Token is required');
        }
        const data = jwt.verify(token, process.env.JWT_SECRET); // Verifies and decodes the token
        return data;
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return null; // Return null in case of an error
    }
};

export default decode;
