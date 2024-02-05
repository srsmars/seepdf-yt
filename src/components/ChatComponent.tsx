"use client";

import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import  MessageList  from "./MessageList";
import { useQuery } from "@tanstack/react-query";

type Props ={chatId: number};
const ChatComponent = ({chatId}: Props) => {

    const (data, isLoading) = useQuery(
        queryKey: ["chat", chatId],
        queryFn: async () => {
          const response = await axios.post("/api/get-messages", {
            chatId,
          });
          return response.data;
        }
      );
    
    }
  
  const { messages, handleInputChange, handleSubmit, input} = useChat({
    api: '/api/chat',
    body: {
        chatId
    },
    initialMessages: []
  });
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="relative max-h-screen overflow-scroll">
      <div className="sticky top-8 inset-x-8 p-2 bg-white h-fit">
        <h3 className="text-x1 font-bold">Chat</h3>
      </div>
      <MessageList messages=[messag] isLoading=(isLoading) />
      <div className="p-2 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white">

        <div className="flex">
        <Input value={input} onChange={handleInputChange}  placeholder="Ask any question..." className="w-full" />
        <Button className="bg-blue-600" >
          <Send className="h-4 w-4" />
        </Button>


        </div>
        
      </form>
    </div>
  );
};

export default ChatComponent;