import OpenAI from "openai";
import { retrieveRelevantDocs } from "../../data/retrieval";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const requirements =
      typeof body.requirements === "string"
        ? body.requirements.trim()
        : "";

    if (!requirements) {
      return Response.json(
        { error: "Customer requirements are required." },
        { status: 400 }
      );
    }

    const relevantDocs = await retrieveRelevantDocs(requirements);

    const documentationContext =
      relevantDocs.length > 0
        ? relevantDocs
            .map(
              (doc) => `
DOCUMENT: ${doc.title}
CATEGORY: ${doc.category}

${doc.content}
`
            )
            .join("\n---\n")
        : "No relevant AudienceFlow documentation was retrieved for these customer requirements.";

    const response = await openai.responses.create({
      model: "gpt-6-luna",
      input: `
You are a Sales Engineer analyzing customer requirements against the
documentation for a fictional SaaS product called AudienceFlow.

Use ONLY the AudienceFlow documentation provided below when determining
whether a product capability is supported.

Do not invent product capabilities.

For each customer requirement:

- Use "Supported" only when the documentation clearly confirms the capability.
- Use "Unsupported" only when the documentation clearly states that the
  capability is not supported.
- Use "Needs Discovery" when the documentation does not provide enough
  information to determine support.

If no relevant AudienceFlow documentation was retrieved, classify the
requirement as "Needs Discovery". Explain that the available documentation
does not establish whether the capability is supported. Do not imply that
AudienceFlow has no product documentation.

Explain the reasoning behind each classification.

Identify technical considerations, discovery questions, and risks or
open questions that a Sales Engineer should investigate.

CUSTOMER REQUIREMENTS:

${requirements}

AUDIENCEFLOW DOCUMENTATION:

${documentationContext}
`,
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
                      enum: ["Supported", "Unsupported", "Needs Discovery"],
                    },
                    explanation: {
                      type: "string",
                    },
                  },
                  required: ["requirement", "status", "explanation"],
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
      retrievedDocs: relevantDocs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        score: doc.score,
      })),
    });
  } catch (error) {
    console.error("Analysis error:", error);

    return Response.json(
      { error: "Unable to analyze requirements." },
      { status: 500 }
    );
  }
}