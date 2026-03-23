import { NextResponse } from "next/server";
import { analyzeConflict } from "@/lib/ai/conflict-engine";

export async function POST(request: Request) {
  try {
    const { name, type } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required for conflict check." },
        { status: 400 }
      );
    }

    const result = await analyzeConflict(name, type || "General");

    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Conflict API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during conflict check." },
      { status: 500 }
    );
  }
}
