const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Access Denied: No token provided" });
        }

       
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Access Denied: Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

module.exports = authMiddleware;
