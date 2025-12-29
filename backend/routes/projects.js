const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/projects - Get all user projects
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let queryText = `
      SELECT p.*, t.name as template_name 
      FROM projects p 
      LEFT JOIN templates t ON p.template_id = t.id
      WHERE p.user_id = $1
    `;
        const params = [req.user.id];
        let paramIndex = 2;

        if (status) {
            queryText += ` AND p.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (search) {
            queryText += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        queryText += ` ORDER BY p.updated_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        // Get total count
        const countResult = await query(
            'SELECT COUNT(*) FROM projects WHERE user_id = $1',
            [req.user.id]
        );

        res.json({
            success: true,
            data: {
                projects: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(countResult.rows[0].count),
                    pages: Math.ceil(countResult.rows[0].count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// GET /api/projects/:id - Get single project
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await query(
            `SELECT p.*, t.name as template_name, t.content as template_content
       FROM projects p 
       LEFT JOIN templates t ON p.template_id = t.id
       WHERE p.id = $1 AND p.user_id = $2`,
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// POST /api/projects - Create new project
router.post('/', authenticateToken, [
    body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Proje adı gerekli'),
    body('cssFramework').optional().isIn(['tailwind', 'bootstrap', 'vanilla'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, description, cssFramework = 'tailwind' } = req.body;

        // Boş içerik ile başla
        const content = { components: [] };

        const result = await query(
            `INSERT INTO projects (user_id, name, description, css_framework, content, settings)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [req.user.id, name, description, cssFramework, JSON.stringify(content), JSON.stringify({
                fonts: { heading: 'Inter', body: 'Inter' },
                colors: { primary: '#3b82f6', secondary: '#64748b', accent: '#8b5cf6' },
                responsive: true
            })]
        );

        res.status(201).json({
            success: true,
            message: 'Proje oluşturuldu',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// PUT /api/projects/:id - Update project
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { name, description, content, settings, status } = req.body;

        // Check ownership
        const checkResult = await query(
            'SELECT id, version FROM projects WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
        }

        const result = await query(
            `UPDATE projects SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        content = COALESCE($3, content),
        settings = COALESCE($4, settings),
        status = COALESCE($5, status),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
            [name, description, content ? JSON.stringify(content) : null,
                settings ? JSON.stringify(settings) : null, status, req.params.id, req.user.id]
        );

        res.json({
            success: true,
            message: 'Proje güncellendi',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// POST /api/projects/:id/save-version - Save version
router.post('/:id/save-version', authenticateToken, async (req, res) => {
    try {
        const projectResult = await query(
            'SELECT id, content, settings, version FROM projects WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
        }

        const project = projectResult.rows[0];
        const newVersion = project.version + 1;

        await transaction(async (client) => {
            // Save current as version
            await client.query(
                `INSERT INTO project_versions (project_id, version_number, content, settings)
         VALUES ($1, $2, $3, $4)`,
                [project.id, project.version, project.content, project.settings]
            );

            // Update project version
            await client.query(
                'UPDATE projects SET version = $1 WHERE id = $2',
                [newVersion, project.id]
            );
        });

        res.json({
            success: true,
            message: `Versiyon ${project.version} kaydedildi`,
            data: { version: newVersion }
        });
    } catch (error) {
        console.error('Save version error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// GET /api/projects/:id/versions - Get project versions
router.get('/:id/versions', authenticateToken, async (req, res) => {
    try {
        const result = await query(
            `SELECT pv.* FROM project_versions pv
       JOIN projects p ON pv.project_id = p.id
       WHERE pv.project_id = $1 AND p.user_id = $2
       ORDER BY pv.version_number DESC`,
            [req.params.id, req.user.id]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get versions error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// POST /api/projects/:id/restore/:version - Restore version
router.post('/:id/restore/:version', authenticateToken, async (req, res) => {
    try {
        const versionResult = await query(
            `SELECT pv.* FROM project_versions pv
       JOIN projects p ON pv.project_id = p.id
       WHERE pv.project_id = $1 AND pv.version_number = $2 AND p.user_id = $3`,
            [req.params.id, req.params.version, req.user.id]
        );

        if (versionResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Versiyon bulunamadı' });
        }

        const version = versionResult.rows[0];

        await query(
            `UPDATE projects SET content = $1, settings = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
            [version.content, version.settings, req.params.id]
        );

        res.json({
            success: true,
            message: `Versiyon ${req.params.version} geri yüklendi`
        });
    } catch (error) {
        console.error('Restore version error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await query(
            'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
        }

        res.json({ success: true, message: 'Proje silindi' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// POST /api/projects/:id/duplicate - Duplicate project
router.post('/:id/duplicate', authenticateToken, async (req, res) => {
    try {
        const projectResult = await query(
            'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
        }

        const project = projectResult.rows[0];

        const result = await query(
            `INSERT INTO projects (user_id, name, description, content, settings, template_id, css_framework)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [req.user.id, `${project.name} (Kopya)`, project.description,
            project.content, project.settings, project.template_id, project.css_framework]
        );

        res.status(201).json({
            success: true,
            message: 'Proje kopyalandı',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Duplicate project error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

module.exports = router;
