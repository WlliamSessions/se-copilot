import OpenAI from "openai";
import { audienceFlowDocs } from "@/app/data/audienceflow-docs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requirements = body.requirements;

    if (!requirements) {
      return Response.json(
        { error: "Customer requirements are required." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-6-luna",

      input: `You are a Sales Engineer for AudienceFlow.

Your job is to analyze customer requirements using the AudienceFlow product documentation provided below.

Use the documentation as the source of truth.

Rules:
- Do not invent AudienceFlow capabilities.
- Mark a requirement as "Supported" only when the documentation explicitly supports it.
- Mark a requirement as "Unsupported" when the documentation explicitly states that it is not supported.
- Mark a requirement as "Needs Discovery" when the documentation does not provide enough information to determine support.
- Explain why each requirement received its status.
- Identify important technical considerations.
- Generate useful follow-up discovery questions.
- Identify risks, gaps, assumptions, or unresolved issues.

AUDIENCEFLOW PRODUCT DOCUMENTATION:

${audienceFlowDocs}

CUSTOMER REQUIREMENTS:

${requirements}`,

      text: {
        format: {
          type: "json_schema",
          name: "technical_assessment",
          strict: true,
          schema: {
            type: "object",
            properties: {
              overallAssessment: {
                type: "string",
              },

              requirementAnalysis: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    requirement: {
                      type: "string",
                    },
                    status: {
                      type: "string",
                      enum: [
                        "Supported",
                        "Unsupported",
                        "Needs Discovery",
                      ],
                    },
                    explanation: {
                      type: "string",
                    },
                  },
                  required: [
                    "requirement",
                    "status",
                    "explanation",
                  ],
                  additionalProperties: false,
                },
              },

              technicalConsiderations: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              discoveryQuestions: {
                type: "array",
                items: {
                  type: "string",
                },
              },

              risks: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },

            required: [
              "overallAssessment",
              "requirementAnalysis",
              "technicalConsiderations",
              "discoveryQuestions",
              "risks",
            ],

            additionalProperties: false,
          },
        },
      },
    });

    const analysis = JSON.parse(response.output_text);

    return Response.json({
      analysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);

    return Response.json(
      { error: "Unable to analyze requirements." },
      { status: 500 }
    );
  }
}