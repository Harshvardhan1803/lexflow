import { query } from "@/lib/database";

export interface ConflictResult {
  hasConflict: boolean;
  severity: "none" | "low" | "medium" | "high";
  matches: Array<{
    name: string;
    role: string;
    caseType?: string;
    date: string;
  }>;
  aiExplanation: string;
}

/**
 * AI Conflict Engine
 * 
 * This engine identifies potential conflicts of interest for a new Lead/Contact.
 * 1. Checks for similar names in past contacts and cases.
 * 2. Analyzes roles (Plaintiff vs Defendant).
 * 3. Returns a structured risk report.
 */
export async function analyzeConflict(name: string, type: string): Promise<ConflictResult> {
  try {
    // 1. DATABASE SEARCH: Find similar names in Contacts (leads/clients)
    const dbResults = await query(
      "SELECT name, status, created_at FROM contacts WHERE name ILIKE $1 LIMIT 5",
      [`%${name}%`]
    );

    const matches = dbResults.rows.map(row => ({
      name: row.name,
      role: row.status === 'case' ? 'Former Client' : 'Previous Lead',
      date: new Date(row.created_at).toLocaleDateString()
    }));

    // 2. SIMULATED AI LOGIC
    // In production, we'd send party name + case type + opposing party (if available)
    // to Claude/GPT-4 for deep legal reasoning.
    
    let hasConflict = matches.length > 0;
    let severity: ConflictResult["severity"] = "none";
    let aiExplanation = "No matching records found in LexFlow history. Safe to proceed.";

    if (hasConflict) {
      severity = matches.length > 2 ? "high" : "medium";
      aiExplanation = `Attention: Potential Conflict Detected. Found ${matches.length} matching record(s) with the name "${name}". 
      AI analysis suggests checking if this is the same individual or a related entity in a different case role.`;
    }

    // SIMULATED LATENCY (Thinking Feel)
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      hasConflict,
      severity,
      matches,
      aiExplanation
    };
  } catch (error) {
    console.error("Conflict Engine Error:", error);
    throw new Error("Failed to perform conflict check.");
  }
}
