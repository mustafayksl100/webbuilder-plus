const express = require('express');
const router = express.Router();
const archiver = require('archiver');
const { query, transaction } = require('../config/database');
const { authenticateToken, hasCredits } = require('../middleware/auth');
const { generateHTML, generateCSS, generateJS } = require('../services/codeGenerator');

const EXPORT_CREDIT_COST = parseInt(process.env.EXPORT_CREDIT_COST) || 200;

// POST /api/export/:projectId - Export project
router.post('/:projectId', authenticateToken, hasCredits(EXPORT_CREDIT_COST), async (req, res) => {
    try {
        const { projectId } = req.params;
        const { framework = 'tailwind' } = req.body;

        // Get project
        const projectResult = await query(
            'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
            [projectId, req.user.id]
        );

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
        }

        const project = projectResult.rows[0];

        // Generate code
        const generatedCode = generateProjectCode(project, framework);

        // Deduct credits and record export
        await transaction(async (client) => {
            // Deduct credits
            await client.query(
                'UPDATE users SET credits = credits - $1 WHERE id = $2',
                [EXPORT_CREDIT_COST, req.user.id]
            );

            // Record transaction
            await client.query(
                `INSERT INTO transactions (user_id, type, amount, description, reference_id)
         VALUES ($1, 'export', $2, $3, $4)`,
                [req.user.id, -EXPORT_CREDIT_COST, `${project.name} projesi export edildi`, projectId]
            );

            // Record export
            await client.query(
                `INSERT INTO exports (project_id, user_id, format, css_framework, credits_used)
         VALUES ($1, $2, 'zip', $3, $4)`,
                [projectId, req.user.id, framework, EXPORT_CREDIT_COST]
            );

            // Update project
            await client.query(
                'UPDATE projects SET is_exported = true WHERE id = $1',
                [projectId]
            );
        });

        // Set response headers for ZIP download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/[^a-z0-9]/gi, '_')}.zip"`);

        // Create ZIP archive
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);

        // Add files to archive
        archive.append(generatedCode.html, { name: 'index.html' });
        archive.append(generatedCode.css, { name: 'styles.css' });
        archive.append(generatedCode.js, { name: 'script.js' });
        archive.append(generatedCode.readme, { name: 'README.md' });

        // Add assets folder structure
        archive.append('', { name: 'assets/images/.gitkeep' });
        archive.append('', { name: 'assets/fonts/.gitkeep' });

        await archive.finalize();

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ success: false, message: 'Export hatası' });
    }
});

// GET /api/export/preview/:projectId - Preview generated code
router.get('/preview/:projectId', authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { framework = 'tailwind' } = req.query;

        const projectResult = await query(
            'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
            [projectId, req.user.id]
        );

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
        }

        const project = projectResult.rows[0];
        const generatedCode = generateProjectCode(project, framework);

        res.json({
            success: true,
            data: {
                html: generatedCode.html,
                css: generatedCode.css,
                js: generatedCode.js,
                framework
            }
        });
    } catch (error) {
        console.error('Preview error:', error);
        res.status(500).json({ success: false, message: 'Önizleme hatası' });
    }
});

// GET /api/export/history - Get export history
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const result = await query(
            `SELECT e.*, p.name as project_name 
       FROM exports e
       JOIN projects p ON e.project_id = p.id
       WHERE e.user_id = $1
       ORDER BY e.created_at DESC
       LIMIT 50`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get export history error:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// Helper function to generate project code
function generateProjectCode(project, framework) {
    const content = typeof project.content === 'string'
        ? JSON.parse(project.content)
        : project.content;

    const settings = typeof project.settings === 'string'
        ? JSON.parse(project.settings)
        : project.settings;

    const html = generateHTML(content, settings, framework, project.name);
    const css = generateCSS(content, settings, framework);
    const js = generateJS(content, settings);
    const readme = generateReadme(project, framework);

    return { html, css, js, readme };
}

// Generate README
function generateReadme(project, framework) {
    return `# ${project.name}

Bu proje WebCraft Studio ile oluşturulmuştur.

## Proje Bilgileri

- **Oluşturulma Tarihi**: ${new Date().toLocaleDateString('tr-TR')}
- **CSS Framework**: ${framework === 'tailwind' ? 'Tailwind CSS' : framework === 'bootstrap' ? 'Bootstrap 5' : 'Vanilla CSS'}

## Dosya Yapısı

\`\`\`
├── index.html      # Ana HTML dosyası
├── styles.css      # CSS stilleri
├── script.js       # JavaScript kodları
├── assets/
│   ├── images/     # Resim dosyaları
│   └── fonts/      # Font dosyaları
└── README.md       # Bu dosya
\`\`\`

## Kullanım

1. Tüm dosyaları bir web sunucusuna yükleyin
2. \`index.html\` dosyasını tarayıcıda açın

## Lisans

Bu proje WebCraft Studio kullanıcısı tarafından oluşturulmuştur.

---
*WebCraft Studio ile ❤️ ile oluşturuldu*
`;
}

module.exports = router;
