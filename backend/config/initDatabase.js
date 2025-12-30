const { pool } = require('./database');
const fs = require('fs');
const path = require('path');

async function initializeDatabaseTables() {
    try {
        console.log('🔧 Checking database tables...');

        // Check if users table exists
        const checkTable = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);

        const tablesExist = checkTable.rows[0].exists;

        if (!tablesExist) {
            console.log('📦 Tables not found. Creating schema...');

            // Read schema file
            const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

            if (fs.existsSync(schemaPath)) {
                const schema = fs.readFileSync(schemaPath, 'utf8');

                // Execute schema
                await pool.query(schema);
                console.log('✅ Database schema created successfully!');
            } else {
                console.warn('⚠️ schema.sql not found at:', schemaPath);
            }
        } else {
            console.log('✅ Database tables already exist.');
        }

        // Verify tables
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('📋 Available tables:', tables.rows.map(r => r.table_name).join(', '));

    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        // Don't exit, let server continue
    }
}

module.exports = { initializeDatabaseTables };
