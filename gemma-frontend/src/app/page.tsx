"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ChatHistory } from "@/components/ChatHistory";
import { MessageInput } from "@/components/MessageInput";
import { v4 as uuidv4 } from "uuid";

// Expanded message interface to match backend
export interface Message {
  text: string;
  isUser: boolean;
  params?: {
    max_new_tokens: number;
    temperature: number;
    top_p: number;
    repetition_penalty: number;
  };
  latency?: number;
  meta?: {
    model: string;
    device: string;
    dtype: string;
  };
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // User and session management
  const [userId, setUserId] = useState("");
  const [sessionId, setSessionId] = useState(uuidv4());
  const [userSessions, setUserSessions] = useState<Record<string, Message[]>>({});

  // Hyperparameters state
  const [temperature, setTemperature] = useState(0.7);
  const [maxNewTokens, setMaxNewTokens] = useState(512);
  const [topP, setTopP] = useState(0.9);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.1);

  // Get or create user ID
  useEffect(() => {
    let storedUserId = localStorage.getItem("gemma-chat-user-id");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("gemma-chat-user-id", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Fetch user's chat history when userId is available
  useEffect(() => {
    if (userId) {
      fetchUserSessions();
    }
  }, [userId]);

  const fetchUserSessions = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get_chats/${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Transform backend session data to frontend message format
        const transformedSessions: Record<string, Message[]> = {};
        for (const [sid, sessionMessages] of Object.entries(data.sessions)) {
          transformedSessions[sid] = sessionMessages.flatMap((turn: any) => [
            { text: turn.user, isUser: true },
            { text: turn.assistant, isUser: false },
          ]);
        }
        setUserSessions(transformedSessions);
      }
    } catch (error) {
      console.error("Failed to fetch user sessions:", error);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(uuidv4());
  };

  const loadSession = (sid: string) => {
    setMessages(userSessions[sid]);
    setSessionId(sid);
    setIsHistoryOpen(false);
  };

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
          user_id: userId,
          session_id: sessionId,
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

      // The backend now returns the full history, so we can just use that
      const fullHistory: Message[] = data.history.flatMap((turn: any) => [
        { text: turn.user, isUser: true },
        {
          text: turn.assistant,
          isUser: false,
          params: data.params,
          latency: data.latency_sec,
          meta: data.meta,
        },
      ]);

      setMessages(fullHistory);
      // Also update the session history for the side panel
      setUserSessions(prev => ({...prev, [sessionId]: fullHistory}));

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

      {/* Chat History Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-full max-w-md transform bg-background shadow-2xl transition-transform duration-300 ease-in-out ${
          isHistoryOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col border-l border-border">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button onClick={() => setIsHistoryOpen(false)} className="rounded-md p-1 hover:bg-secondary">
              <Image src="/icons/x.svg" alt="Close" width={20} height={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <button
              onClick={handleNewChat}
              className="mb-4 w-full rounded-md bg-primary py-2 text-primary-foreground hover:bg-primary/90"
            >
              + New Chat
            </button>
            <div className="space-y-2">
              {Object.keys(userSessions).map((sid) => (
                <div
                  key={sid}
                  onClick={() => loadSession(sid)}
                  className="cursor-pointer rounded-md p-2 hover:bg-secondary"
                >
                  <p className="truncate text-sm font-medium">
                    {userSessions[sid][0]?.text || "Empty Chat"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userSessions[sid].length} messages
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(isSettingsOpen || isHistoryOpen) && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setIsSettingsOpen(false);
            setIsHistoryOpen(false);
          }}
        />
      )}

      <main className={`flex h-full flex-col transition-transform duration-300 ease-in-out ${isSettingsOpen ? "translate-x-[22rem]" : ""} ${isHistoryOpen ? "-translate-x-[22rem]" : ""}`}>
        <header className="flex items-center justify-between border-b border-border p-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary"
          >
            <Image src="/icons/settings.svg" alt="Settings" width={20} height={20} />
          </button>
          <h1 className="text-lg font-semibold">Gemma Chat</h1>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary"
          >
            <Image src="/globe.svg" alt="History" width={20} height={20} />
          </button>
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