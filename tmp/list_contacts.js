const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Appic@123@localhost:5432/lexflow"
});

async function listContacts() {
  try {
    const res = await pool.query("SELECT id, name, status FROM contacts");
    console.log('Contacts:', JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

listContacts();
