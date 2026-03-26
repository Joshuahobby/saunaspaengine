const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

// Force WebSocket mode
const { neonConfig } = require('@neondatabase/serverless');
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = false;

const rawUrl = "postgresql://neondb_owner:npg_gwY2TeztH8Rb@ep-orange-tooth-aikede8q-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function run() {
  const url = new URL(rawUrl);
  
  // Test 1: connectionString
  try {
    const pool1 = new Pool({ connectionString: rawUrl });
    const res1 = await pool1.query('SELECT 1 as num');
    console.log('Test 1 (connectionString) SUCCESS:', res1.rows[0]);
    await pool1.end();
  } catch (err) {
    console.log('Test 1 ERROR:', err.message);
  }

  // Test 2: manual parameters
  try {
    const pool2 = new Pool({ 
      host: url.hostname,
      user: url.username,
      password: decodeURIComponent(url.password),
      database: url.pathname.substring(1),
      port: 5432,
      ssl: true
    });
    const res2 = await pool2.query('SELECT 1 as num');
    console.log('Test 2 (manual) SUCCESS:', res2.rows[0]);
    await pool2.end();
  } catch (err) {
    console.log('Test 2 ERROR:', err.message);
  }
}

run();
