import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

// Fetch all deadlines (for Universal Calendar)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contact_id");

    let query = "SELECT *, deadline_date as date FROM deadlines ORDER BY deadline_date ASC";
    let values: any[] = [];

    if (contactId) {
      query = "SELECT *, deadline_date as date FROM deadlines WHERE lead_id = $1 ORDER BY deadline_date ASC";
      values = [contactId];
    }

    const result = await pool.query(query, values);
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch deadlines." 
    }, { status: 500 });
  }
}

// Create a new deadline
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact_id, title, date, type } = body;

    if (!contact_id || !title || !date) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields: contact_id, title, date." 
      }, { status: 400 });
    }

    const query = `
      INSERT INTO deadlines (lead_id, title, deadline_date, type, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *, deadline_date as date
    `;
    const values = [contact_id, title, new Date(date), type || 'deadline'];

    const result = await pool.query(query, values);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Deadline created successfully."
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to create deadline." 
    }, { status: 500 });
  }
}
