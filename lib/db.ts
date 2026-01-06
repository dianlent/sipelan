import { Pool, PoolClient } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL environment variable')
}

const sslEnabled =
  process.env.PGSSLMODE === 'require' ||
  process.env.PGSSLMODE === 'true' ||
  process.env.DATABASE_SSL === 'true'

const pool =
  global.__pgPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined
  })

if (process.env.NODE_ENV !== 'production') {
  global.__pgPool = pool
}

export async function query<T = any>(text: string, params: Array<unknown> = []) {
  return pool.query<T>(text, params)
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
