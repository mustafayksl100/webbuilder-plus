const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function verifySchema() {
    console.log('🔍 Verifying Database Schema...');

    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'webcraft_studio'
    });

    try {
        const res = await pool.query(`
            SELECT column_name, data_type, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'avatar_url';
        `);

        if (res.rows.length > 0) {
            console.log('✅ Found avatar_url column:');
            console.table(res.rows[0]);

            const type = res.rows[0].data_type;
            const length = res.rows[0].character_maximum_length;

            if (type === 'text' || (type === 'character varying' && length === null)) {
                console.log('✅ SUCCESS: Column is TEXT or unlimited VARCHAR. Base64 uploads should work.');
            } else {
                console.error('❌ FAILURE: Column is limited. Type:', type, 'Length:', length);
            }
        } else {
            console.error('❌ ERROR: avatar_url column not found!');
        }
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
    } finally {
        await pool.end();
    }
}

verifySchema();
