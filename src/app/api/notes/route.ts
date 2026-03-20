import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

// Fetch all notes for a specific contact
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contact_id");

    if (!contactId) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required field: contact_id." 
      }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT * FROM notes WHERE contact_id = $1 ORDER BY created_at DESC",
      [contactId]
    );
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch case notes." 
    }, { status: 500 });
  }
}

// Create a new note
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact_id, content, type = "Lead Action" } = body;

    if (!contact_id || !content) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields: contact_id, content." 
      }, { status: 400 });
    }

    const query = `
      INSERT INTO notes (contact_id, content, type)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [contact_id, content, type];

    const result = await pool.query(query, values);
    
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Note added successfully."
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to add case note." 
    }, { status: 500 });
  }
}
