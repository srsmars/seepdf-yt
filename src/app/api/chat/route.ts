import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Message } from 'postcss';
export const runtime = 'edge';
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    try {
      const { messages, chatId } = await req.json();
      const chats = await db.select().from('chats').where(eq(chats.id, chatId));
      if (chats.length !== 1) {
        return NextResponse.json({ error: 'chat not found' }, { status: 404 });
      }
      const fileKey = chats[0].fileKey;
      const lastMessage = messages[messages.length - 1];
      const context = await getContext(lastMessage.content, fileKey);
      const prompt = {
        role: "system",
        content:
          "AI assistant is a brand new, powerful, human-like artificial intelligence.\n" +
          "The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.\n" +
          "AI is a well-behaved and well-mannered individual.\n" +
          "AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to\n" +
          "AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question ab\n" +
          "AI assistant is a big fan of Pinecone and Vercel.\n\n" +
          "START CONTEXT BLOCK\n" +
          "${context})\n" +
          "END OF CONTEXT BLOCK\n" +
          "AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.\n" +
          "If the context does not provide the answer to question, the AI assistant will say, \"I'm sorry, but I don't know the answer to that.\"\n" +
          "AI assistant will not apologize for previous responses, but instead will indicate new information was\n" +
          "AI assistant will not invent anything that is not drawn directly from the context.",
      };
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages:{
            prompt,
            ...messages.filter((messages: Message) => message.role ==="user")
        }
        stream: true,
      });



      const stream = OpenAIStream(response, {
        onStart: async () => {
          // save user message into db
          await db.insert(messages).values({
            chatId,
            content: lastMessage.content,
            role: "user",
          });
        },
        onCompletion: async (completion) => {
          // save AI message into db
          await db.insert(messages).values({
            chatId,
            content: completion,
            role: "system",
          });
        },
      });
      
      return new StreamingTextResponse(stream);
    } catch (error) {
      
    }
  }