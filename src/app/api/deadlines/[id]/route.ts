import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import { calculateDeadlines, CaseType } from "@/lib/deadline-calculator";

// Update a deadline (e.g., mark as completed)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing status field." 
      }, { status: 400 });
    }

    const query = `
      UPDATE deadlines 
      SET status = $1 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "Deadline not found." 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Deadline updated successfully."
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update deadline." 
    }, { status: 500 });
  }
}

// Generate multiple deadlines for a lead
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contactId } = await params;
    const { anchorDate, caseType } = await request.json();

    if (!anchorDate || !caseType) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing anchorDate or caseType." 
      }, { status: 400 });
    }

    // Calculate dates using the engine
    const calculated = calculateDeadlines(new Date(anchorDate), caseType as CaseType);

    // Batch insert into database
    const results = [];
    for (const d of calculated) {
      const q = `
        INSERT INTO deadlines (lead_id, title, deadline_date, is_automated, status)
        VALUES ($1, $2, $3, true, 'pending')
        RETURNING *, deadline_date as date
      `;
      const res = await pool.query(q, [contactId, d.title, new Date(d.deadline_date)]);
      results.push(res.rows[0]);
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `${results.length} deadlines generated and saved.`
    });
  } catch (error: any) {
    console.error("Deadline Generation Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to generate automated deadlines.",
      error: error.message
    }, { status: 500 });
  }
}
