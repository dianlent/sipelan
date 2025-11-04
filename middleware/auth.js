const jwt = require('jsonwebtoken');
const supabase = require('../config/database');

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
        
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', decoded.userId)
            .single();

        if (error || !user || !user.is_active) {
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
