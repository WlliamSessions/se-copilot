import OpenAI from "openai";
import { audienceFlowDocs } from "./audienceflow-docs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SIMILARITY_THRESHOLD = 0.4;
const MAX_RESULTS = 3;

type EmbeddedDoc = (typeof audienceFlowDocs)[number] & {
  embedding: number[];
};

let cachedDocumentEmbeddings: EmbeddedDoc[] | null = null;

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

async function getDocumentEmbeddings() {
  if (cachedDocumentEmbeddings) {
    return cachedDocumentEmbeddings;
  }

  const documentTexts = audienceFlowDocs.map(
    (doc) => `
${doc.title}
${doc.category}
${doc.content}
`
  );

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: documentTexts,
  });

  cachedDocumentEmbeddings = audienceFlowDocs.map((doc, index) => ({
    ...doc,
    embedding: embeddingResponse.data[index].embedding,
  }));

  return cachedDocumentEmbeddings;
}

export async function retrieveRelevantDocs(requirements: string) {
  const [customerEmbeddingResponse, embeddedDocs] = await Promise.all([
    openai.embeddings.create({
      model: "text-embedding-3-small",
      input: requirements,
    }),
    getDocumentEmbeddings(),
  ]);

  const customerEmbedding =
    customerEmbeddingResponse.data[0].embedding;

  const scoredDocs = embeddedDocs.map((doc) => {
    const score = cosineSimilarity(
      customerEmbedding,
      doc.embedding
    );

    return {
      id: doc.id,
      title: doc.title,
      category: doc.category,
      content: doc.content,
      score,
    };
  });

  return scoredDocs
    .filter((doc) => doc.score >= SIMILARITY_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS);
}