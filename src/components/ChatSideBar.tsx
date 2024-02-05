"use client";

import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import SubscriptionButton from "./SubscriptionButton";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro}:props) => {

  const [loading, setLoading] = React.useState(false);

  
    return (
      <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
        <Link href="/">
          <Button className="w-full border-dashed border-white border">
            <PlusCircle className="mr-2 w-4 h-4" />
            New Chat
          </Button>
        </Link>
        <div className="flex flex-col gap-2 mt-4">
          {/* Render each chat here */}
        </div>

        <div className="absolute bottom-4 left-4">
  <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
    <Link href="/">Home</Link>
    <Link href="/">Source</Link>
    {/* Stripe Button */}
  </div>
  <Button className="m-2 text-white bg-slate-700" disabled>
  Upgrade To Pro!
</Button>
</div>
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <Link href="/">Home</Link>
            <Link href="/">Source</Link>
          </div>
          <SubscriptionButton isPro={isPro} />
        </div>
      </div>
    );
  };
  
  export default ChatSideBar;