const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:Appic@123@localhost:5432/lexflow"
});

async function debugAPI() {
  const id = '6';
  try {
    console.log('--- Phase 1: Contact query ---');
    const query = `
      SELECT 
        c.id as contact_id,
        c.name as client_name,
        c.status as case_status,
        c.intake_answers->>'selected_case_type' as case_type,
        f.name as firm_name,
        cs.id as case_id,
        u.name as attorney_name
      FROM contacts c
      CROSS JOIN (SELECT name FROM firms LIMIT 1) f
      LEFT JOIN cases cs ON c.id = cs.contact_id
      LEFT JOIN users u ON cs.assigned_attorney_id = u.id
      WHERE c.id = $1
      LIMIT 1
    `;
    const res = await pool.query(query, [id]);
    console.log('Result:', res.rows[0]);

    if(res.rows.length > 0) {
        console.log('--- Phase 2: Deadlines query ---');
        const dRes = await pool.query("SELECT * FROM deadlines WHERE lead_id = $1", [parseInt(id)]);
        console.log('Deadlines count:', dRes.rows.length);
    }

  } catch (err) {
    console.error('API Query Error:', err.message);
    console.error('Error Code:', err.code);
  } finally {
    await pool.end();
  }
}

debugAPI();
