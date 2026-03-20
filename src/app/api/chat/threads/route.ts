import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

// Fetch all conversations (threads)
export async function GET() {
  try {
    // Current approach: Every lead in the system is a potential thread
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.name, 
        c.status,
        c.intake_answers->>'selected_case_type' as case_type,
        (SELECT content FROM messages WHERE contact_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE contact_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time
      FROM contacts c
      ORDER BY last_message_time DESC NULLS LAST, c.created_at DESC
    `);

    const threads = result.rows.map(row => ({
      id: row.id,
      sender: row.name,
      subject: row.case_type || "Legal Matter",
      preview: row.last_message || "No messages yet.",
      time: row.last_message_time ? formatTime(new Date(row.last_message_time)) : formatTime(new Date()),
      unread: false, // Could be dynamic if we add a 'read' status to messages
      initials: row.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2),
      color: "bg-blue-100 text-blue-600" // Randomize later
    }));

    return NextResponse.json({
      success: true,
      data: threads
    });
  } catch (error) {
    console.error("Fetch Threads Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch conversations." 
    }, { status: 500 });
  }
}

function formatTime(date: Date) {
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
