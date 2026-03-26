const { Client } = require('pg');
require('dotenv').config();

const rawUrl = process.env.DATABASE_URL || '';
const cleanUrl = rawUrl.trim();

async function test() {
  const client = new Client({ connectionString: cleanUrl });
  try {
    console.log('Connecting via standard pg...');
    await client.connect();
    const res = await client.query('SELECT 1 as num');
    console.log('SUCCESS:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.log('ERROR:', err.message);
  }
}
test();
