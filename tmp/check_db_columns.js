const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:Appic@123@localhost:5432/lexflow'
});

async function checkColumns() {
  try {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'deadlines'");
    console.log('Columns in deadlines table:', res.rows);
    
    // Also check notes and messages
    const resNotes = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'notes'");
    console.log('Columns in notes table:', resNotes.rows);

    const resMessages = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'messages'");
    console.log('Columns in messages table:', resMessages.rows);

    await pool.end();
  } catch (err) {
    console.error('Database query error:', err);
    process.exit(1);
  }
}

checkColumns();
