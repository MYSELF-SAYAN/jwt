import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file


const jwtMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check for a valid Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Authorization token is missing or invalid." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded data (user info) to the request object
        req.datas = decoded;

        // Pass control to the next middleware/route handler
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};

export default jwtMiddleware;
