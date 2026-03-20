import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch Contact Info
    const contactRes = await pool.query(
      "SELECT * FROM contacts WHERE id = $1",
      [id]
    );

    if (contactRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Case not found" }, { status: 404 });
    }

    const contact = contactRes.rows[0];

    // 2. Fetch Deadlines
    const deadlinesRes = await pool.query(
      "SELECT * FROM deadlines WHERE lead_id = $1 ORDER BY deadline_date ASC",
      [id]
    );

    const deadlines = deadlinesRes.rows;

    // 3. Construct Timeline
    // Standard Stages: Intake -> Conversion -> [Deadlines] -> Discovery -> Trial -> Closed
    const timeline = [];

    // Stage 1: Intake (Always completed)
    timeline.push({
      id: "intake",
      title: "Initial Intake",
      description: "Case entered the system and initial screening completed.",
      status: "completed",
      date: new Date(contact.created_at).toLocaleDateString()
    });

    // Stage 2: Conversion
    const isConverted = contact.status === "case";
    timeline.push({
      id: "conversion",
      title: "Litigation Conversion",
      description: isConverted 
        ? "Lead successfully converted to an active litigation matter." 
        : "Pending conversion to active case.",
      status: isConverted ? "completed" : "active",
      date: isConverted ? "Verified" : "Pending"
    });

    // Stage 3: Adding Deadlines from DB
    deadlines.forEach((d: any) => {
      timeline.push({
        id: `deadline-${d.id}`,
        title: d.title,
        description: d.description || "Official legal deadline tracked in LexFlow.",
        status: d.status === "completed" ? "completed" : "active",
        date: new Date(d.deadline_date).toLocaleDateString()
      });
    });

    // Final Stages (Mocked if not in deadlines)
    if (timeline.filter(t => t.status === "active").length === 0 && isConverted) {
      timeline.push({
        id: "discovery",
        title: "Discovery Phase",
        description: "Exchanging evidence and gathering testimonies.",
        status: "active",
        date: "In Progress"
      });
    } else if (isConverted) {
      timeline.push({
        id: "discovery",
        title: "Discovery Phase",
        description: "Exchanging evidence and gathering testimonies.",
        status: "upcoming",
        date: "TBD"
      });
    }

    timeline.push({
      id: "trial",
      title: "Trial / Final Settlement",
      description: "Final resolution of the legal matter.",
      status: "upcoming",
      date: "Future"
    });

    return NextResponse.json({
      success: true,
      data: timeline
    });

  } catch (error) {
    console.error("Timeline API Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch timeline." }, { status: 500 });
  }
}
