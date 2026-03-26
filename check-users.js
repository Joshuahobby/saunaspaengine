const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_qMowegZAX9Y1@ep-morning-haze-al0fbcyk.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require";

async function checkUsers() {
    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();
        console.log("Connected to database");

        const res = await client.query('SELECT id, email, username, "fullName", role, status FROM "users" LIMIT 10');
        console.log("Users in database:");
        console.table(res.rows);

    } catch (err) {
        console.error("Error connecting or querying:", err);
    } finally {
        await client.end();
    }
}

checkUsers();
