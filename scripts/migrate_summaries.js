require('dotenv').config();
const { Client } = require('pg');

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    // Create document_summaries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS document_summaries (
        id SERIAL PRIMARY KEY,
        firm_id INTEGER,
        file_name VARCHAR(255) NOT NULL,
        summary_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Migration successful: document_summaries table created');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
