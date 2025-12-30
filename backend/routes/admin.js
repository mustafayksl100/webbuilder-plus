const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * TEMPORARY ADMIN ENDPOINT
 * This endpoint manually seeds the production database with the mustafa@gmail.com user
 * Access: GET /api/admin/seed-user
 * This should be removed after first use for security
 */
router.get('/seed-user', async (req, res) => {
    try {
        // Check if user already exists
        const existing = await query('SELECT id FROM users WHERE email = $1', ['mustafa@gmail.com']);

        if (existing.rows.length > 0) {
            return res.json({
                success: true,
                message: 'Kullanıcı zaten mevcut!',
                userId: existing.rows[0].id
            });
        }

        // Pre-calculated bcrypt hash for password 'mustafa159'
        const passwordHash = '$2a$10$wdhqDxzf4H.g0OUZ8QQyPfTgeqasIeOO/FqDsCocQW.HG9HP';

        // Insert user
        const result = await query(
            `INSERT INTO users (email, password_hash, full_name, credits, role, is_verified)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, email, full_name, credits`,
            ['mustafa@gmail.com', passwordHash, 'Mustafa Yüksel', 1000, 'user', true]
        );

        const user = result.rows[0];

        res.json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu!',
            user: user
        });
    } catch (error) {
        console.error('Seed user error:', error);
        res.status(500).json({
            success: false,
            message: 'Hata: ' + error.message,
            detail: error.detail
        });
    }
});

/**
 * List all users (for debugging)
 */
router.get('/list-users', async (req, res) => {
    try {
        const result = await query('SELECT id, email, full_name, credits, created_at FROM users ORDER BY created_at DESC');

        res.json({
            success: true,
            count: result.rows.length,
            users: result.rows
        });
    } catch (error) {
        console.error('List users error:', error);
        res.status(500).json({
            success: false,
            message: 'Hata: ' + error.message
        });
    }
});

/**
 * Reset password for mustafa@gmail.com
 * Access: GET /api/admin/reset-password
 */
router.get('/reset-password', async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const newHash = await bcrypt.hash('mustafa159', 10);

        const result = await query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email',
            [newHash, 'mustafa@gmail.com']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Şifre "mustafa159" olarak sıfırlandı!',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Hata: ' + error.message
        });
    }
});

module.exports = router;
