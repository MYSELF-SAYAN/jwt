const jwt = require('jsonwebtoken');
require('dotenv').config();
const sign = ({ payload }) => {
    const data = {
        id: payload.id,
        name: payload.name,
    }
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

module.exports = sign