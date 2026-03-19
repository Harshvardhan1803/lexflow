import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch case details with joined contact and user (attorney) info
    const query = `
      SELECT 
        c.id as case_id,
        c.type as case_type,
        c.status as case_status,
        c.milestones,
        ct.name as client_name,
        u.name as attorney_name,
        f.name as firm_name
      FROM cases c
      JOIN contacts ct ON c.contact_id = ct.id
      JOIN firms f ON c.firm_id = f.id
      LEFT JOIN users u ON c.assigned_attorney_id = u.id
      WHERE c.id = $1
    `;
    
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      // For now, if no case found, return a formatted mock for the demo portal
      return NextResponse.json({
        success: true,
        isMock: true,
        data: {
          id: id,
          type: "Personal Injury",
          status: "In Progress",
          client_name: "John Doe",
          attorney_name: "Robert Taylor",
          firm_name: "LexFlow Legal",
          milestones: [
            { id: 1, title: "Intake Completed", date: "Mar 15, 2024", status: "completed" },
            { id: 2, title: "Evidence Collection", date: "Mar 18, 2024", status: "completed" },
            { id: 3, title: "Insurance Negotiation", date: "Ongoing", status: "current" },
            { id: 4, title: "Final Settlement", date: "Est. Apr 2024", status: "upcoming" }
          ]
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
