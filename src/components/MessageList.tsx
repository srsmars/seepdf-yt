
import {on} from "@/lib/utils";
import { Message } from "ai/react";
import React from 'react';

type Props = {
    messages: Message();
    isLoading: boolean;
};


    const MessageList = ({ messages, isLoading }) => {
        if (isLoading) {
          return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          );
        }
    if (!messages) return <></>;
    return (
      <div className="flex flex-col gap-2 px-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end p-1.5" : "justify-start pr-10"}`}
          >
            <div className={`rounded-1g px-3 text-sm py-1.5 ${message.role === "user" ? "bg-blue-800 text-white" : "bg-gray-200"}`}>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageList;