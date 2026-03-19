import { NextResponse } from "next/server";
import { query } from "@/lib/database";
import { calculateDeadlines, CaseType } from "@/lib/deadline-calculator";

// GET: Fetch all deadlines for a specific lead
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query(
      "SELECT * FROM deadlines WHERE lead_id = $1 ORDER BY deadline_date ASC",
      [id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Fetch Deadlines Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch deadlines" }, { status: 500 });
  }
}

// POST: Create automated deadlines for a lead based on anchor date
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { anchorDate, caseType } = await request.json();

    if (!anchorDate || !caseType) {
      return NextResponse.json({ success: false, message: "Missing anchorDate or caseType" }, { status: 400 });
    }

    const calculated = calculateDeadlines(new Date(anchorDate), caseType as CaseType);

    // Insert each deadline into the database
    // We'll use a transaction ideally, but simple Loop for now
    const results = [];
    for (const d of calculated) {
      const res = await query(
        "INSERT INTO deadlines (lead_id, title, description, deadline_date, is_automated) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [id, d.title, d.description, d.deadline_date, true]
      );
      results.push(res.rows[0]);
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `${calculated.length} automated deadlines generated successfully.`
    });
  } catch (error) {
    console.error("Create Deadlines Error:", error);
    return NextResponse.json({ success: false, message: "Failed to generate deadlines" }, { status: 500 });
  }
}

// PATCH: Update deadline status (e.g., mark as completed)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: deadlineId } = await params;
    const { status } = await request.json();

    await query(
      "UPDATE deadlines SET status = $1 WHERE id = $2",
      [status, deadlineId]
    );

    return NextResponse.json({
      success: true,
      message: "Deadline status updated."
    });
  } catch (error) {
    console.error("Update Deadline Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update deadline" }, { status: 500 });
  }
}
