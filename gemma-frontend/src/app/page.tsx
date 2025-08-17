"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ChatHistory } from "@/components/ChatHistory";
import { MessageInput } from "@/components/MessageInput";

interface Message {
  text: string;
  isUser: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Hyperparameters state
  const [temperature, setTemperature] = useState(0.7);
  const [maxNewTokens, setMaxNewTokens] = useState(512);
  const [topP, setTopP] = useState(0.9);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          max_new_tokens: maxNewTokens,
          temperature: temperature,
          top_p: topP,
          repetition_penalty: repetitionPenalty,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = { text: data.response, isUser: false };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to fetch chat response:", error);
      const errorMessage: Message = {
        text: "Sorry, something went wrong. Please check the console and make sure the backend is running.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background text-foreground">
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        temperature={temperature}
        setTemperature={setTemperature}
        maxNewTokens={maxNewTokens}
        setMaxNewTokens={setMaxNewTokens}
        topP={topP}
        setTopP={setTopP}
        repetitionPenalty={repetitionPenalty}
        setRepetitionPenalty={setRepetitionPenalty}
      />
      
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/60 backdrop-blur-sm" 
          onClick={() => setIsSettingsOpen(false)}
        />
      )}

      <main className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-border p-4">
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="rounded-md p-2 text-muted-foreground hover:bg-secondary"
            >
                <Image src="/icons/settings.svg" alt="Settings" width={20} height={20} />
            </button>
            <h1 className="text-lg font-semibold">Gemma Chat</h1>
            <div className="w-9"></div>
        </header>
        
        <ChatHistory messages={messages} isLoading={isLoading} />
        
        <MessageInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}