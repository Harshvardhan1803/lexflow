import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

// Fetch all messages for a specific contact
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contact_id");

    if (!contactId) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing Required Field: contact_id." 
      }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT * FROM messages WHERE contact_id = $1 ORDER BY created_at ASC",
      [contactId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch message history." 
    }, { status: 500 });
  }
}

// Send a new message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact_id, sender_type, content } = body;

    if (!contact_id || !content) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing contact_id or content." 
      }, { status: 400 });
    }

    const query = `
      INSERT INTO messages (contact_id, sender_type, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [contact_id, sender_type || 'firm', content]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Message sent successfully."
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to send message." 
    }, { status: 500 });
  }
}
