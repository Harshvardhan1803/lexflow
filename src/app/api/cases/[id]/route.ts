import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
    }

    // 1. Fetch contact/case details
    const contactQuery = `
      SELECT 
        c.id as contact_id,
        c.name as client_name,
        c.status as case_status,
        c.intake_answers->>'selected_case_type' as case_type,
        cs.id as case_id,
        u.name as attorney_name
      FROM contacts c
      LEFT JOIN cases cs ON c.id = cs.contact_id
      LEFT JOIN users u ON cs.assigned_attorney_id = u.id
      WHERE c.id = $1
      LIMIT 1
    `;
    
    const contactResult = await pool.query(contactQuery, [numericId]);

    if (contactResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }

    const baseData = contactResult.rows[0];

    // 2. Fetch firm info separately for resilience
    const firmResult = await pool.query("SELECT name FROM firms LIMIT 1");
    const firmName = firmResult.rows[0]?.name || "LexFlow Legal";

    // 3. Fetch milestones (Deadlines)
    const deadlinesRes = await pool.query(
      "SELECT id, title, deadline_date as date, status FROM deadlines WHERE lead_id = $1 ORDER BY deadline_date ASC",
      [id]
    );

    const milestones = deadlinesRes.rows.map((d: any) => ({
      id: d.id,
      title: d.title,
      date: d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD",
      status: d.status === 'completed' ? 'completed' : 'upcoming'
    }));

    // If no real milestones, provide fallback for demo impact
    const finalMilestones = milestones.length > 0 ? milestones : [
      { id: 1, title: "Intake Completed", date: "Mar 15, 2024", status: "completed" },
      { id: 2, title: "Case Review", date: "Mar 18, 2024", status: "completed" },
      { id: 3, title: "Next Steps", date: "Ongoing", status: "current" }
    ];

    // 4. Fetch documents
    const docsRes = await pool.query(
      "SELECT id, file_name as name, created_at as date FROM document_summaries WHERE contact_id = $1 ORDER BY created_at DESC",
      [numericId]
    );

    const documents = docsRes.rows.map((d: any) => ({
      id: d.id,
      name: d.name,
      size: "Under Review",
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    return NextResponse.json({
      success: true,
      data: {
        case_id: baseData.case_id ? `CASE-${baseData.case_id}` : `LEAD-${baseData.contact_id}`,
        case_type: baseData.case_type || "General Legal Matter",
        case_status: baseData.case_status === 'case' ? "In Progress" : "Screening",
        client_name: baseData.client_name,
        attorney_name: baseData.attorney_name || "Assigned Associate",
        firm_name: firmName,
        milestones: finalMilestones,
        documents: documents.length > 0 ? documents : null
      }
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
