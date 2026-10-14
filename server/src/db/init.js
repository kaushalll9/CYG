import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, checkDatabaseConnection } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  console.log('🔄 Checking database connectivity...');
  const health = await checkDatabaseConnection();

  if (!health.connected) {
    console.error('❌ Could not connect to PostgreSQL database.');
    console.error(`Error: ${health.error}`);
    console.error('Please configure your credentials in server/.env and verify PostgreSQL is running.');
    process.exit(1);
  }

  console.log('✅ Connected to database. Executing schema.sql...');
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schemaSql);
    console.log('🎉 Database tables created successfully!');
    console.log('   - users');
    console.log('   - user_keys');
    console.log('   - conversations');
    console.log('   - encrypted_messages');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to run schema:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
