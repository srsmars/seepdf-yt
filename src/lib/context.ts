import PineconeClient from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";

// Placeholder for the missing getEmbeddings function
async function getEmbeddings(query: string): Promise<number[]> {
  // Your implementation here
  // This function should return an array of embeddings for the given query
  return [];
}

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!
  });
  const index = await pinecone.Index('chatpdf');

  try {
    const namespace = convertToAscii(fileKey);
    const queryResult = await index.query({
      queryRequest: {
        topk: 5,
        vector: embeddings,
        includeMetadata: true,
        namespace
      }
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log('error querying embeddings', error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  const qualifyingDocs = matches.filter(
    (match): match is { metadata: { text: string; pageNumber: number } } => match.score && match.score > 0.7
  );

  let docs: string[] = qualifyingDocs.map((match) => (match.metadata as { text: string; pageNumber: number }).text);

  // 5 vectors
  return docs.join('\n').substring(0, 3000);
}

interface Metadata {
  text: string;
  pageNumber: number;
}

type Embedding = number[];
