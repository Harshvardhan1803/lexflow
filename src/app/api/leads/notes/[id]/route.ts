import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await query(
      "SELECT notes FROM contacts WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      notes: result.rows[0].notes || [] 
    });
  } catch (error) {
    console.error("Fetch Notes Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content, type } = await request.json();

    const newNote = {
      id: Date.now().toString(),
      content,
      type: type || "AI Draft",
      date: new Date().toISOString()
    };

    // Append to JSONB array using jsonb_insert or just read and write back
    // For simplicity and to avoid complex jsonb operators, we'll read and append
    const currentResult = await query("SELECT notes FROM contacts WHERE id = $1", [id]);
    const currentNotes = currentResult.rows[0]?.notes || [];
    
    const updatedNotes = [newNote, ...currentNotes];

    await query(
      "UPDATE contacts SET notes = $1 WHERE id = $2",
      [JSON.stringify(updatedNotes), id]
    );

    return NextResponse.json({ 
      success: true, 
      note: newNote,
      message: "Note saved to case history" 
    });
  } catch (error) {
    console.error("Save Note Error:", error);
    return NextResponse.json({ success: false, message: "Failed to save note" }, { status: 500 });
  }
}
