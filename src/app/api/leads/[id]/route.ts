import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ success: false, message: "Missing status" }, { status: 400 });
    }

    // Map 'Converted' UI status to 'case' database status for Active Cases tracking
    const dbStatus = status === "Converted" ? "case" : "lead";

    const result = await query(
      "UPDATE contacts SET status = $1 WHERE id = $2 RETURNING *",
      [dbStatus, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    // Automatically log this action to the audit/activity history table
    try {
      await query(
        "INSERT INTO notes (contact_id, content, type) VALUES ($1, $2, $3)",
        [id, `Lead status was updated to ${status}.`, "Status Change"]
      );
    } catch (logError) {
      console.error("Failed to log status change:", logError);
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: `Lead status updated to ${status}`
    });
  } catch (error) {
    console.error("Update Lead Status Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update lead status" }, { status: 500 });
  }
}
