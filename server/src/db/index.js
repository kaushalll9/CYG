import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 2000, idleTimeoutMillis: 1000 }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cipherchat',
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 1000
    };

export const pool = new Pool(poolConfig);

// Catch errors on idle clients so they don't bubble up or hang
pool.on('error', (err) => {
  // Suppress uncaught idle client errors
});

// Keep track of connection health
let isDbConnected = false;
let lastDbError = null;

export async function checkDatabaseConnection() {
  if (process.env.NODE_ENV === 'test' || process.env.SKIP_DB_CHECK === 'true') {
    return { connected: false, message: 'Database check skipped in test mode' };
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    isDbConnected = true;
    lastDbError = null;
    return {
      connected: true,
      time: result.rows[0].current_time,
      database: poolConfig.database || 'PostgreSQL'
    };
  } catch (err) {
    isDbConnected = false;
    lastDbError = err.message;
    return {
      connected: false,
      error: err.message,
      hint: 'Configure valid PostgreSQL credentials in server/.env or export DATABASE_URL.'
    };
  } finally {
    if (client) {
      try { client.release(true); } catch (e) {}
    }
  }
}

export async function query(text, params) {
  return pool.query(text, params);
}

export function getDbStatus() {
  return {
    connected: isDbConnected,
    lastError: lastDbError
  };
}

export async function closeDatabase() {
  try {
    await pool.end();
  } catch (err) {
    // Ignore if already ended
  }
}
