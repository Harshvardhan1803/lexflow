const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Appic@123@localhost:5432/lexflow"
});

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'contacts'
    `);
    console.log('Contacts Columns:', JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkSchema();
