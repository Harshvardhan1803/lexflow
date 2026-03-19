import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { draftType, briefNote, clientName, attorneyName, caseType } = await request.json();

    // SYSTEM PROMPTS & TEMPLATES
    // In a production environment, this would call the Claude (Anthropic) API.
    // For this build, we implement the "Smart Template" logic which follows the 
    // exact style an AI would generate based on the prompt.

    let generatedDraft = "";

    const templates: Record<string, string> = {
      "Case Update": `Subject: Case Update [${caseType}] - Matter of ${clientName}

Dear ${clientName},

I hope this email finds you well. 

I am writing to provide a formal update regarding your ${caseType} case. ${briefNote ? `Based on our latest review: ${briefNote}.` : "We have been making steady progress on the current phase of your matter."}

Our team is currently finalizing the necessary details for the next steps. We remain committed to achieving the best possible outcome for you and will notify you immediately of any further developments.

If you have any questions, please do not hesitate to reach out.

Best regards,

${attorneyName}
Attorney at Law`,

      "Document Request": `Subject: Action Required: Documents needed for your ${caseType} case

Dear ${clientName},

To proceed with the next phase of your case, we require the following documentation:

1. ${briefNote || "Additional evidence relevant to your recent update"}
2. Any recent correspondence related to the matter
3. Updated contact information (if applicable)

Please upload these documents directly to your Secure Client Portal at your earliest convenience. Having these on file will allow us to move forward without further delay.

Thank you for your cooperation.

Sincerely,

${attorneyName}`,

      "Appointment Reminder": `Subject: Reminder: Upcoming Legal Consultation

Dear ${clientName},

This is a reminder of our upcoming appointment to discuss your ${caseType} case.

Date/Time: [To be confirmed]
Location: Office / Virtual Secure Link

Please ensure you have reviewed the latest case notes in your portal and have any requested documents ready for discussion. We look forward to meeting with you.

Best regards,

${attorneyName}`,

      "Delay Notification": `Subject: Important: Timeline Update for Your Case

Dear ${clientName},

I am writing to inform you of a slight change in the expected timeline for your ${caseType} matter.

${briefNote || "Due to administrative processing times at the court, we anticipate a short delay in the next hearing phase."}

While we understand that delays can be frustrating, please rest assured that we are doing everything in our power to keep the process moving as efficiently as possible. We will continue to monitor the situation and update you as soon as we have a definitive date.

Thank you for your patience and continued trust.

Respectfully,

${attorneyName}`
    };

    generatedDraft = templates[draftType] || templates["Case Update"];

    // SIMULATED LATENCY (To feel like AI is thinking)
    await new Promise(resolve => setTimeout(resolve, 1200));

    return NextResponse.json({
      success: true,
      draft: generatedDraft,
      message: "Draft generated successfully by LexFlow AI Core."
    });
  } catch (error) {
    console.error("AI Draft Error:", error);
    return NextResponse.json({ success: false, message: "Draft generation failed." }, { status: 500 });
  }
}

/** 
 * FUTURE ANTHROPIC INTEGRATION 
 * 
 * const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 * const msg = await anthropic.messages.create({
 *   model: "claude-3-5-sonnet-20241022",
 *   max_tokens: 1024,
 *   messages: [{ role: "user", content: "..." }]
 * });
 */
