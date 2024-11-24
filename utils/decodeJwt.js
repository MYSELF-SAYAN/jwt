const jwt = require('jsonwebtoken');
require('dotenv').config();

const decode = ({ token }) => {
    try {
        if (!token) {
            throw new Error('Token is required');
        }
        const data = jwt.verify(token, process.env.JWT_SECRET);
        return data;
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return null;
    }
}

module.exports = decode;
