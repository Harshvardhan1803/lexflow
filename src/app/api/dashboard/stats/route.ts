import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET() {
  try {
    const [leadsRes, casesRes, firmRes] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM contacts WHERE status = 'lead'"),
      pool.query("SELECT COUNT(*) FROM contacts WHERE status = 'case'"),
      pool.query("SELECT name FROM firms LIMIT 1")
    ]);

    const stats = {
      totalLeads: parseInt(leadsRes.rows[0].count),
      totalCases: parseInt(casesRes.rows[0].count),
      firmName: firmRes.rows[0]?.name || "LexFlow Law Firm",
      revenue: `$${(parseInt(casesRes.rows[0].count) * 2450).toLocaleString()}`,
      avgResponseTime: "1.2h"
    };

    return NextResponse.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch stats." 
    }, { status: 500 });
  }
}
