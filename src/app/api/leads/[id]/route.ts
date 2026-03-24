import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, name, email, phone } = await request.json();

    const updates: string[] = [];
    const queryParams: any[] = [];
    let paramCount = 1;

    if (status) {
      const dbStatus = status === "Converted" ? "case" : (status === "Archived" ? "archived" : "lead");
      updates.push(`status = $${paramCount++}`);
      queryParams.push(dbStatus);
    }
    if (name) {
      updates.push(`name = $${paramCount++}`);
      queryParams.push(name);
    }
    if (email) {
      updates.push(`email = $${paramCount++}`);
      queryParams.push(email);
    }
    if (phone) {
      updates.push(`phone = $${paramCount++}`);
      queryParams.push(phone);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, message: "No fields provided for update" }, { status: 400 });
    }

    const queryStr = `UPDATE contacts SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    queryParams.push(id);

    const result = await query(queryStr, queryParams);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    // Automatically log this action if it's a status change
    if (status) {
      try {
        await query(
          "INSERT INTO notes (contact_id, content, type) VALUES ($1, $2, $3)",
          [id, `Lead status was updated to ${status}.`, "Status Change"]
        );
      } catch (logError) {
        console.error("Failed to log status change:", logError);
      }
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: `Lead updated successfully`
    });
  } catch (error) {
    console.error("Update Lead Status Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update lead status" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query("DELETE FROM contacts WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully"
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete lead" }, { status: 500 });
  }
}
