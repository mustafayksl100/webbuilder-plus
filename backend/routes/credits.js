const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/credits/balance - Get user credit balance
router.get('/balance', authenticateToken, async (req, res) => {
    try {
        const result = await query(
            'SELECT credits FROM users WHERE id = $1',
            [req.user.id]
        );

        res.json({
            success: true,
            data: {
                credits: result.rows[0].credits,
                exportCost: parseInt(process.env.EXPORT_CREDIT_COST) || 200
            }
        });
    } catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// GET /api/credits/packages - Get available credit packages
router.get('/packages', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM credit_packages WHERE is_active = true ORDER BY credits ASC'
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get packages error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// GET /api/credits/history - Get transaction history
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, type } = req.query;
        const offset = (page - 1) * limit;

        let queryText = `
      SELECT * FROM transactions 
      WHERE user_id = $1
    `;
        const params = [req.user.id];
        let paramIndex = 2;

        if (type) {
            queryText += ` AND type = $${paramIndex}`;
            params.push(type);
            paramIndex++;
        }

        queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        // Get total count
        const countResult = await query(
            'SELECT COUNT(*) FROM transactions WHERE user_id = $1',
            [req.user.id]
        );

        res.json({
            success: true,
            data: {
                transactions: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(countResult.rows[0].count)
                }
            }
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// POST /api/credits/purchase - Purchase credits (simulated payment)
router.post('/purchase', authenticateToken, [
    body('packageId').isUUID().withMessage('Geçersiz paket'),
    body('paymentMethod').isIn(['credit_card', 'paypal', 'bank_transfer']).withMessage('Geçersiz ödeme yöntemi')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { packageId, paymentMethod, cardDetails } = req.body;

        // Get package details
        const packageResult = await query(
            'SELECT * FROM credit_packages WHERE id = $1 AND is_active = true',
            [packageId]
        );

        if (packageResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Paket bulunamadı' });
        }

        const creditPackage = packageResult.rows[0];

        // Simulate payment processing
        // In production, integrate with Stripe/PayPal here
        const paymentSuccess = simulatePayment(paymentMethod, cardDetails, creditPackage.price);

        if (!paymentSuccess.success) {
            return res.status(400).json({
                success: false,
                message: paymentSuccess.message || 'Ödeme başarısız'
            });
        }

        // Process credit addition
        await transaction(async (client) => {
            // Add credits to user
            await client.query(
                'UPDATE users SET credits = credits + $1 WHERE id = $2',
                [creditPackage.credits, req.user.id]
            );

            // Record transaction
            await client.query(
                `INSERT INTO transactions (user_id, type, amount, description, payment_method, payment_status, reference_id)
         VALUES ($1, 'purchase', $2, $3, $4, 'completed', $5)`,
                [req.user.id, creditPackage.credits, `${creditPackage.name} paketi satın alındı`,
                    paymentMethod, paymentSuccess.referenceId]
            );
        });

        // Get updated balance
        const userResult = await query('SELECT credits FROM users WHERE id = $1', [req.user.id]);

        res.json({
            success: true,
            message: `${creditPackage.credits} kredi başarıyla eklendi`,
            data: {
                creditsAdded: creditPackage.credits,
                newBalance: userResult.rows[0].credits,
                referenceId: paymentSuccess.referenceId
            }
        });
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// POST /api/credits/use - Use credits (internal)
router.post('/use', authenticateToken, [
    body('amount').isInt({ min: 1 }).withMessage('Geçersiz miktar'),
    body('description').notEmpty().withMessage('Açıklama gerekli')
], async (req, res) => {
    try {
        const { amount, description, referenceId } = req.body;

        // Check balance
        const userResult = await query('SELECT credits FROM users WHERE id = $1', [req.user.id]);

        if (userResult.rows[0].credits < amount) {
            return res.status(400).json({
                success: false,
                message: 'Yetersiz kredi',
                required: amount,
                current: userResult.rows[0].credits
            });
        }

        await transaction(async (client) => {
            // Deduct credits
            await client.query(
                'UPDATE users SET credits = credits - $1 WHERE id = $2',
                [amount, req.user.id]
            );

            // Record transaction
            await client.query(
                `INSERT INTO transactions (user_id, type, amount, description, reference_id)
         VALUES ($1, 'export', $2, $3, $4)`,
                [req.user.id, -amount, description, referenceId]
            );
        });

        // Get updated balance
        const newBalance = await query('SELECT credits FROM users WHERE id = $1', [req.user.id]);

        res.json({
            success: true,
            message: `${amount} kredi kullanıldı`,
            data: {
                creditsUsed: amount,
                newBalance: newBalance.rows[0].credits
            }
        });
    } catch (error) {
        console.error('Use credits error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Simulated payment function
function simulatePayment(method, cardDetails, amount) {
    // Simulate 95% success rate
    const isSuccess = Math.random() > 0.05;

    if (!isSuccess) {
        return {
            success: false,
            message: 'Ödeme işlemi reddedildi. Lütfen kart bilgilerinizi kontrol edin.'
        };
    }

    // Generate fake reference ID
    const referenceId = 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    return {
        success: true,
        referenceId,
        amount
    };
}

module.exports = router;
