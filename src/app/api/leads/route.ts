import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

// Fetch all leads for the dashboard
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: [], 
        message: "No leads found in the database." 
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch leads from the database." 
    }, { status: 500 });
  }
}

// Create a new lead from the Intake Bot
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, intake_answers, lead_score, case_type } = body;

    const query = `
      INSERT INTO contacts (name, email, phone, intake_answers, lead_score, status)
      VALUES ($1, $2, $3, $4, $5, 'lead')
      RETURNING *
    `;
    
    // Ensure case_type is in the answers if not already
    const answers = intake_answers || {};
    if (case_type) answers.selected_case_type = case_type;

    const values = [
      name, 
      email, 
      phone, 
      JSON.stringify(answers), 
      lead_score || 0
    ];

    const result = await pool.query(query, values);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Lead captured successfully."
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to create lead entry." 
    }, { status: 500 });
  }
}
