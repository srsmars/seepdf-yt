import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { messages } from "@/lib/db/schema";
export const runtime = "edge";
export const POST = async (req: Request) => {
  const { chatId } = await req.json();

  const messages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId));
  return NextResponse.json(messages);
};