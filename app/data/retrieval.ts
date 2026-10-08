import OpenAI from "openai";
import { audienceFlowDocs } from "./audienceflow-docs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cosineSimilarity(vectorA: number[], vectorB: number[]) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

export async function retrieveRelevantDocs(requirements: string) {
  const customerEmbeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: requirements,
  });

  const customerEmbedding =
    customerEmbeddingResponse.data[0].embedding;

  const scoredDocs = await Promise.all(
    audienceFlowDocs.map(async (doc) => {
      const documentText = `
        ${doc.title}
        ${doc.category}
        ${doc.content}
      `;

      const documentEmbeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: documentText,
      });

      const documentEmbedding =
        documentEmbeddingResponse.data[0].embedding;

      const score = cosineSimilarity(
        customerEmbedding,
        documentEmbedding
      );

      return {
        ...doc,
        score,
      };
    })
  );

  return scoredDocs
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}