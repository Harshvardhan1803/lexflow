import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET() {
  try {
    // Fetch latest 5 activities (from contacts table)
    // Fetch recent activity from multiple sources for a true dynamic feed
    const [leadsRes, notesRes, messagesRes] = await Promise.all([
      pool.query("SELECT 'lead-' || id as id, name as firm, 'New Lead' as action, created_at as time, 'Marketing' as tag FROM contacts ORDER BY created_at DESC LIMIT 3"),
      pool.query("SELECT 'note-' || n.id as id, c.name as firm, 'New Activity: ' || LEFT(n.content, 100) || '...' as action, n.created_at as time, 'Case History' as tag FROM notes n JOIN contacts c ON n.contact_id = c.id ORDER BY n.created_at DESC LIMIT 3"),
      pool.query("SELECT 'msg-' || m.id as id, c.name as firm, 'New Message: ' || LEFT(m.content, 50) || '...' as action, m.created_at as time, 'Communication' as tag FROM messages m JOIN contacts c ON m.contact_id = c.id ORDER BY m.created_at DESC LIMIT 3")
    ]);

    const combinedActivity = [
      ...leadsRes.rows,
      ...notesRes.rows,
      ...messagesRes.rows
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
     .slice(0, 10);

    return NextResponse.json({
      success: true,
      activity: combinedActivity
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch activity." 
    }, { status: 500 });
  }
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
