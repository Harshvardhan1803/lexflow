import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

// Fetch leads for the dashboard with filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";

    let queryStr = "SELECT * FROM contacts";
    const queryParams: any[] = [];
    const conditions: string[] = [];

    // Search filter
    if (search) {
      queryParams.push(`%${search}%`);
      conditions.push(`(name ILIKE $${queryParams.length} OR email ILIKE $${queryParams.length})`);
    }

    // Status filter
    if (status !== "All") {
      const dbStatus = status === "New" ? "lead" : 
                       (status === "Converted" ? "case" : 
                       (status === "Archived" ? "archived" : status.toLowerCase()));
      queryParams.push(dbStatus);
      conditions.push(`status = $${queryParams.length}`);
    } else {
      // By default, 'All' should probably exclude archived unless specifically requested
      // But if the user says "All", let's show lead and case, but maybe skip archived?
      // Actually, let's keep it simple: if "All", show everything.
    }

    if (conditions.length > 0) {
      queryStr += " WHERE " + conditions.join(" AND ");
    }

    queryStr += " ORDER BY created_at DESC";

    const result = await pool.query(queryStr, queryParams);
    
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
