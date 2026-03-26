const { Client } = require('pg');
require('dotenv').config();

async function verify() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');
    const res = await client.query('SELECT id, email, username, status, "passwordHash" FROM "User" WHERE email = \'admin@saunaspa.com\'');
    if (res.rows.length === 0) {
      console.log('User admin@saunaspa.com NOT FOUND');
    } else {
      console.log('User found:', JSON.stringify(res.rows[0], null, 2));
    }
  } catch (err) {
    console.error('Connection error:', err.message);
  } finally {
    await client.end();
  }
}

verify();
