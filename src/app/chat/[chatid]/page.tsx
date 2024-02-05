import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { chats as chatModel } from '@/lib/db/schema';
import ChatComponent from "@/components/ChatComponent";
import { checkSubscription } from '@/lib/subscription';

const ChatPage = () => {
  const router = useRouter();
  const { params: { chatId } } = router;
  const { userId } = useAuth();
  const [userChats, setUserChats] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) {
        router.push("/sign-in");
        return;
      }
      const _userChats = await db.select().from(chatModel).where(eq(chatModel.userId, userId));
      setUserChats(_userChats);
      if (!_userChats) {
        router.push("/");
        return;
      }
      if (!_userChats.find(chat => chat.id === parseInt(chatId))) {
        router.push("/");
        return;
      }
    };
    fetchChats();
  }, [userId, chatId]);

  if (!userChats) {
    return <div>Loading...</div>;
  }

  const currentChat = userChats.find(chat => chat.id === parseInt(chatId));
  const isPro = await checkSubscription(); // Assuming checkSubscription is a function

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-X8">
          <ChatSideBar chats={userChats} chatId={parseInt(chatId)} isPro={isPro} />
        </div>
        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        <div className="flex-[3] border-red-100">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ChatPage;
