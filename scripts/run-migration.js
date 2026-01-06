const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('Missing DATABASE_URL configuration');
    console.error('Please set DATABASE_URL in your .env file');
    process.exit(1);
}

const sslEnabled = process.env.PGSSLMODE === 'require' || process.env.PGSSLMODE === 'true' || process.env.DATABASE_SSL === 'true';

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined
});

async function runMigration() {
    const client = await pool.connect();
    try {
        console.log('Starting migration...\n');

        const migrationPath = path.join(__dirname, '../database/add_reporter_info.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Migration file loaded');
        console.log('Executing SQL...\n');

        await client.query(sql);

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
