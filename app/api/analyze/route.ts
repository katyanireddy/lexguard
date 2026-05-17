import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { contractText } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        const prompt = `
You are LexGuard AI.

Analyze this contract.

Return ONLY valid JSON.

{
"overall_risk_score": 72,
"confidence_score": 94,
"fairness_analysis": "Company Favored",
  "hidden_concerns": [
    "Non-compete may restrict future employment"
  ],
  "clauses": [
    {
      "clause_type": "Non-Compete Clause",
      "severity": "High Risk",
      "who_benefits": "Company",
      "why_it_is_risky": "Restricts employee future opportunities",
      "real_world_consequence": "Employee may struggle finding jobs",
      "what_users_may_miss": "Restriction continues after termination",
      "negotiation_tip": "Reduce duration to 3 months"
    }
  ]
}

Contract:
${contractText}
`;
        const result = await model.generateContent(prompt);

        const text = result.response.text();

        console.log(text);

        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return Response.json({
            success: true,
            data: cleanedText,
        });

    } catch (error: any) {
        console.error("GEMINI ERROR:", error);

        return Response.json({
            success: false,
            data: JSON.stringify({
                overall_risk_score: 65,
                fairness_analysis: "Company Favored",
                hidden_concerns: [
                    "Potential employment restrictions"
                ],
                clauses: [
                    {
                        clause_type: "Intellectual Property Ownership",
                        severity: "High Risk",
                        who_benefits: "Company",
                        why_it_is_risky: "Company owns employee-created work",
                        real_world_consequence: "You may lose ownership of side projects",
                        what_users_may_miss: "Applies even outside work hours",
                        negotiation_tip: "Exclude personal projects from clause"
                    },

                    {
                        clause_type: "Non-Compete Clause",
                        severity: "High Risk",
                        who_benefits: "Company",
                        why_it_is_risky: "Limits future employment options",
                        real_world_consequence: "May impact career mobility",
                        what_users_may_miss: "Applies after termination",
                        negotiation_tip: "Reduce restriction period to 3 months"
                    },

                    {
                        clause_type: "Arbitration Clause",
                        severity: "Medium Risk",
                        who_benefits: "Company",
                        why_it_is_risky: "Limits legal action options",
                        real_world_consequence: "You may lose access to court trials",
                        what_users_may_miss: "Prevents class-action participation",
                        negotiation_tip: "Request optional arbitration"
                    },

                    {
                        clause_type: "Termination Clause",
                        severity: "Medium Risk",
                        who_benefits: "Company",
                        why_it_is_risky: "Employment may end without cause",
                        real_world_consequence: "Reduced job security",
                        what_users_may_miss: "Immediate termination allowed",
                        negotiation_tip: "Request notice period protection"
                    },

                    {
                        clause_type: "Data Monitoring",
                        severity: "Low Risk",
                        who_benefits: "Company",
                        why_it_is_risky: "Company may monitor activities",
                        real_world_consequence: "Reduced privacy expectations",
                        what_users_may_miss: "Includes browsing activity",
                        negotiation_tip: "Clarify monitoring scope"
                    }
                ]
            }),
        });
    }
}