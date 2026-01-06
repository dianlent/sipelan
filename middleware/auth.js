const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const { rows } = await db.query(
            'SELECT * FROM users WHERE id = $1 LIMIT 1',
            [decoded.userId]
        );

        const user = rows[0];

        if (!user || !user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or inactive user'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }
        next();
    };
};

const authorizeBidang = (bidangId) => {
    return (req, res, next) => {
        if (req.user.role === 'admin') {
            return next();
        }

        if (req.user.role === 'bidang' && req.user.bidang_id === parseInt(bidangId)) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: 'Access denied. You can only access your own bidang data.'
        });
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    authorizeBidang
};
