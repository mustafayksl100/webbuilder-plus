const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Verify JWT Token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Erişim tokeni gerekli'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const result = await query(
            'SELECT id, email, full_name, credits, role FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token süresi dolmuş'
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Geçersiz token'
            });
        }
        console.error('Auth error:', error);
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Admin yetkisi gerekli'
        });
    }
};

// Check if user has enough credits
const hasCredits = (requiredCredits) => {
    return (req, res, next) => {
        if (req.user.credits >= requiredCredits) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: `Yetersiz kredi. Gerekli: ${requiredCredits}, Mevcut: ${req.user.credits}`,
                required: requiredCredits,
                current: req.user.credits
            });
        }
    };
};

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

module.exports = {
    authenticateToken,
    isAdmin,
    hasCredits,
    generateToken
};
