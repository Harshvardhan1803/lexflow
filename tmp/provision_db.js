const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:Appic@123@localhost:5432/lexflow'
});

async function provisionTables() {
  try {
    console.log('Provisioning tables...');
    
    // Notes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        contact_id INTEGER REFERENCES contacts(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Notes table verified.');

    // Messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        contact_id INTEGER REFERENCES contacts(id),
        sender_type VARCHAR(50),
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Messages table verified.');

    // Verify
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables present now:', res.rows.map(r => r.table_name));
    
    await pool.end();
  } catch (err) {
    console.error('Provisioning error:', err);
    process.exit(1);
  }
}

provisionTables();
