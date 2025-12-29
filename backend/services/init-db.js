const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function initDatabase() {
    console.log('🔧 WebCraft Studio - Database Initialization\n');
    
    // First connect to postgres database to create our database if it doesn't exist
    const adminPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: 'postgres'
    });

    try {
        // Check if database exists
        const dbName = process.env.DB_NAME || 'webcraft_studio';
        const checkDb = await adminPool.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (checkDb.rows.length === 0) {
            console.log(`📦 Creating database "${dbName}"...`);
            await adminPool.query(`CREATE DATABASE ${dbName}`);
            console.log(`✅ Database "${dbName}" created successfully!\n`);
        } else {
            console.log(`✅ Database "${dbName}" already exists.\n`);
        }
    } catch (error) {
        if (error.code === '42P04') {
            console.log(`✅ Database already exists.\n`);
        } else {
            console.error('❌ Error creating database:', error.message);
            process.exit(1);
        }
    } finally {
        await adminPool.end();
    }

    // Now connect to our database and run schema
    const appPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'webcraft_studio'
    });

    try {
        // Read and execute schema
        const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
        
        if (fs.existsSync(schemaPath)) {
            console.log('📝 Running database schema...');
            const schema = fs.readFileSync(schemaPath, 'utf8');
            await appPool.query(schema);
            console.log('✅ Schema executed successfully!\n');
        } else {
            console.log('⚠️  No schema.sql found, skipping schema creation.\n');
        }

        // Verify tables
        const tables = await appPool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('📋 Database tables:');
        tables.rows.forEach(row => {
            console.log(`   ├── ${row.table_name}`);
        });
        
        console.log('\n✨ Database initialization complete!\n');
        
    } catch (error) {
        console.error('❌ Error executing schema:', error.message);
        process.exit(1);
    } finally {
        await appPool.end();
    }
}

initDatabase();
