// src/components/ChatHistory.tsx
"use client";

import { useEffect, useRef } from "react";
import { ChatBubble, LoadingBubble } from "./ChatBubble";
import { Welcome } from "./Welcome";

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatHistory = ({ messages, isLoading }: ChatHistoryProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto flex h-full max-w-3xl flex-col space-y-6">
        {messages.length === 0 && !isLoading ? (
          <Welcome />
        ) : (
          messages.map((msg, index) => (
            <ChatBubble key={index} text={msg.text} isUser={msg.isUser} />
          ))
        )}
        {isLoading && <LoadingBubble />}
      </div>
    </div>
  );
};
