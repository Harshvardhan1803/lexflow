import 'dotenv/config';
import { Client } from 'pg';

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    // Add notes column to contacts table
    await client.query(`
      ALTER TABLE contacts 
      ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]'::jsonb;
    `);
    
    console.log('Migration successful: notes column added to contacts table');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
