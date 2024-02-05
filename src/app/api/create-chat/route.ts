import { db } from "@/lib/db";
import chats from "@/lib/db/schema";
import loadS3IntoPinecone from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import auth from "@clerk/nextjs";
import NextResponse from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
  const userId = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name);
    await loadS3IntoPinecone();
    const s3Url = await getS3Url(file_key);
    const chat = await chats.create({
      user_id: userId,
      file_key: file_key,
      file_name: file_name,
      s3_url: s3Url,
    });
    return NextResponse.json({
      chat_id: chat.insertedId,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "internal server error",
      status: 500,
    });
  }
}