import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // Validate role if provided, otherwise default to 'user'
    const userRole = role === "admin" ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, userRole]
    );

    return NextResponse.json({
      success: true,
      message: "User created successfully",
    });

  } catch (error) {
    console.error("Signup error details:", error);
    return NextResponse.json(
      { message: "Server error", detail: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}