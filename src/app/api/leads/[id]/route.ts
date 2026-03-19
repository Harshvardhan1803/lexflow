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
