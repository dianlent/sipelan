const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL configuration. Please check your environment variables.');
}

const sslEnabled = process.env.PGSSLMODE === 'require' || process.env.PGSSLMODE === 'true' || process.env.DATABASE_SSL === 'true';

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined
});

module.exports = pool;
