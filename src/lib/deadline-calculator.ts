/**
 * LexFlow Deadline Calculation Engine
 * 
 * This utility calculates critical legal deadlines based on an "Anchor Date".
 * It supports different case types with specific rule sets.
 */

export type CaseType = "civil" | "criminal" | "family" | "employment";

export interface CalculatedDeadline {
  title: string;
  description: string;
  daysOffset: number;
}

const DEADLINE_RULES: Record<CaseType, CalculatedDeadline[]> = {
  civil: [
    { title: "Response to Complaint", description: "Deadline for defendant to file a responsive pleading.", daysOffset: 21 },
    { title: "Initial Disclosure", description: "Mandatory disclosure of evidence and witnesses.", daysOffset: 45 },
    { title: "Expert Witness Designation", description: "Deadline to identify testifying experts.", daysOffset: 90 },
    { title: "Discovery Cut-off", description: "All discovery must be completed by this date.", daysOffset: 120 },
    { title: "Statute of Limitations (Standard)", description: "Final date to preserve legal rights.", daysOffset: 730 },
  ],
  criminal: [
    { title: "Arraignment", description: "Formal reading of criminal charges.", daysOffset: 3 },
    { title: "Discovery Phase Start", description: "Initial exchange of evidence.", daysOffset: 15 },
    { title: "Pre-trial Conference", description: "Status meeting with the court.", daysOffset: 60 },
    { title: "Speedy Trial Limit", description: "Final date for trial to begin under standard rules.", daysOffset: 180 },
  ],
  family: [
    { title: "Temporary Orders Hearing", description: "Initial hearing for immediate needs.", daysOffset: 14 },
    { title: "Financial Declaration", description: "Deadline to submit detailed financial assets.", daysOffset: 30 },
    { title: "Mediation Session", description: "Recommended period for alternate dispute resolution.", daysOffset: 60 },
  ],
  employment: [
    { title: "EEOC Filing Deadline", description: "Deadline to preserve federal discrimination claims.", daysOffset: 180 },
    { title: "Position Statement", description: "Employer response to initial claims.", daysOffset: 30 },
  ],
};

export function calculateDeadlines(anchorDate: Date, caseType: CaseType) {
  const rules = DEADLINE_RULES[caseType] || [];
  
  return rules.map(rule => {
    const deadlineDate = new Date(anchorDate);
    deadlineDate.setDate(deadlineDate.getDate() + rule.daysOffset);
    
    return {
      title: rule.title,
      description: rule.description,
      deadline_date: deadlineDate.toISOString(),
    };
  });
}
