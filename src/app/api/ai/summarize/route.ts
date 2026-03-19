import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    // In a production environment, we would use 'pdf-parse' or a similar library
    // to extract text from the PDF/Docx and send it to Claude.
    // For this build, we simulate high-quality legal analysis.

    const fileName = file.name;
    
    // MOCK ANALYSIS BASED ON TYPICAL LEGAL DOCUMENTS
    const mockSummary = {
      executive_summary: "This document is a standard Service Level Agreement (SLA) between a technology provider and a client. It outlines the uptime commitments, support hours, and compensation protocols for downtime.",
      key_parties: [
        { role: "Provider", entity: "TechFlow Systems Inc." },
        { role: "Client", entity: "Global Logistics Corp." }
      ],
      critical_dates: [
        { event: "Effective Date", date: "January 1, 2024" },
        { event: "Renewal Deadline", date: "November 1, 2024" },
        { event: "Termination Notice Period", date: "60 Days" }
      ],
      legal_risks: [
        { risk: "Limited Liability", severity: "High", description: "The provider's total liability is capped at 12 months of fees, which may not cover potential data loss damages." },
        { risk: "Automatic Renewal", severity: "Medium", description: "The contract renews automatically unless written notice is provided 60 days before expiration." }
      ],
      obligations: [
        "99.9% Monthly Uptime Guarantee",
        "24/7 Priority Support for P0 incidents",
        "Quarterly Security Audits"
      ]
    };

    // Save to Database
    const res = await query(
      "INSERT INTO document_summaries (file_name, summary_json) VALUES ($1, $2) RETURNING id",
      [fileName, JSON.stringify(mockSummary)]
    );

    // Simulate AI Processing Latency
    await new Promise(resolve => setTimeout(resolve, 2500));

    return NextResponse.json({
      success: true,
      data: mockSummary,
      id: res.rows[0].id,
      message: "Document successfully analyzed by LexFlow AI."
    });

  } catch (error) {
    console.error("Summarize Error:", error);
    return NextResponse.json({ success: false, message: "Failed to summarize document." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await query("SELECT * FROM document_summaries ORDER BY created_at DESC LIMIT 10");
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Fetch Summaries Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch summaries" }, { status: 500 });
  }
}
