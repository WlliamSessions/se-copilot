import OpenAI from "openai";

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

      input: `You are a Sales Engineer performing technical discovery.

Analyze the customer requirements below.

Do not assume unsupported product capabilities. If something cannot be determined from the information provided, identify it as an open question.

Customer requirements:
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
              requirements: {
                type: "array",
                items: {
                  type: "string",
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
              "requirements",
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