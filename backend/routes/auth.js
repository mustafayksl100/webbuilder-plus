const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { generateToken, authenticateToken } = require('../middleware/auth');

// Validation middleware
const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Geçerli email gerekli'),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı'),
    body('fullName').trim().isLength({ min: 2 }).withMessage('Ad soyad gerekli')
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Geçerli email gerekli'),
    body('password').notEmpty().withMessage('Şifre gerekli')
];

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kayıt başarılı
 *       400:
 *         description: Validasyon hatası veya kullanıcı mevcut
 */
router.post('/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password, fullName } = req.body;

        // Check if user exists
        const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kayıtlı'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const result = await query(
            `INSERT INTO users (email, password_hash, full_name, credits) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, full_name, credits, created_at`,
            [email, passwordHash, fullName, parseInt(process.env.INITIAL_USER_CREDITS) || 500]
        );

        const user = result.rows[0];
        const token = generateToken(user.id);

        // Record initial credit bonus
        await query(
            `INSERT INTO transactions (user_id, type, amount, description) 
       VALUES ($1, 'bonus', $2, 'Hoş geldin bonusu')`,
            [user.id, parseInt(process.env.INITIAL_USER_CREDITS) || 500]
        );

        res.status(201).json({
            success: true,
            message: 'Kayıt başarılı',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.full_name,
                    credits: user.credits
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// POST /api/auth/login
router.post('/login', loginValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        const result = await query(
            'SELECT id, email, password_hash, full_name, credits, role, avatar_url FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Giriş başarılı',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.full_name,
                    credits: user.credits,
                    role: user.role,
                    avatarUrl: user.avatar_url
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mevcut kullanıcı bilgilerini getir
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri
 *       401:
 *         description: Yetkilendirme gerekli
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const result = await query(
            `SELECT id, email, full_name, credits, role, avatar_url, created_at 
       FROM users WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });
        }

        const user = result.rows[0];
        res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                credits: user.credits,
                role: user.role,
                avatarUrl: user.avatar_url,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// PUT /api/auth/profile - Update profile
router.put('/profile', authenticateToken, [
    body('fullName').optional().trim().isLength({ min: 2 }),
    body('avatarUrl').optional()
], async (req, res) => {
    try {
        const { fullName, avatarUrl } = req.body;

        const result = await query(
            `UPDATE users SET 
        full_name = COALESCE($1, full_name),
        avatar_url = COALESCE($2, avatar_url),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, full_name, credits, avatar_url`,
            [fullName, avatarUrl, req.user.id]
        );

        const user = result.rows[0];
        res.json({
            success: true,
            message: 'Profil güncellendi',
            data: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                credits: user.credits,
                avatarUrl: user.avatar_url
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// PUT /api/auth/password - Change password
router.put('/password', authenticateToken, [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;

        // Get current password hash
        const result = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mevcut şifre hatalı' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, req.user.id]);

        res.json({ success: true, message: 'Şifre başarıyla değiştirildi' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// POST /api/auth/reset-password - Reset password (without login)
router.post('/reset-password', [
    body('email').isEmail().normalizeEmail().withMessage('Geçerli email gerekli'),
    body('newPassword').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, newPassword } = req.body;

        // Check if user exists
        const userResult = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        await query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2', [newPasswordHash, email]);

        res.json({ success: true, message: 'Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

module.exports = router;
