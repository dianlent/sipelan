// Run: node scripts/test-supabase-connection.js
// Note: Script name retained for compatibility; it now tests PostgreSQL.

const { Pool } = require('pg');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

console.log('=== PostgreSQL Connection Test ===');
console.log('  DATABASE_URL:', databaseUrl ? '✅ Set' : '❌ Missing');

if (!databaseUrl) {
    console.error('DATABASE_URL is missing. Please update your .env file.');
    process.exit(1);
}

const sslEnabled = process.env.PGSSLMODE === 'require' || process.env.PGSSLMODE === 'true' || process.env.DATABASE_SSL === 'true';

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined
});

async function testConnection() {
    const client = await pool.connect();
    try {
        const { rows: tables } = await client.query(
            `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
        );
        console.log(`Tables found: ${tables.length}`);

        const { rows: users } = await client.query('SELECT COUNT(*)::text AS count FROM users');
        console.log('Users count:', users[0]?.count || '0');

        const { rows: sessions } = await client.query('SELECT COUNT(*)::text AS count FROM sessions');
        console.log('Sessions count:', sessions[0]?.count || '0');

        const { rows: bidang } = await client.query('SELECT COUNT(*)::text AS count FROM bidang');
        console.log('Bidang count:', bidang[0]?.count || '0');

        const { rows: kategori } = await client.query('SELECT COUNT(*)::text AS count FROM kategori_pengaduan');
        console.log('Kategori count:', kategori[0]?.count || '0');

        console.log('Connection OK');
    } catch (error) {
        console.error('Connection test failed:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

testConnection();
