const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Appic@123@localhost:5432/lexflow"
});

async function seedFirm() {
  try {
    // Check if any firm exists
    const check = await pool.query("SELECT count(*) FROM firms");
    if (parseInt(check.rows[0].count) === 0) {
      await pool.query("INSERT INTO firms (name) VALUES ('LexFlow Legal')");
      console.log('Firm seeded successfully');
    } else {
      console.log('Firm already exists');
    }
  } catch (err) {
    console.error('Error seeding firm:', err);
  } finally {
    await pool.end();
  }
}

seedFirm();
