import Image from "next/image";
import { useState } from "react";
import { Message } from "../app/page"; // Import the Message type

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const { text, isUser, params, latency, meta } = message;
  const [isMetaVisible, setIsMetaVisible] = useState(false);

  const bubbleClasses = isUser
    ? "bg-primary text-primary-foreground"
    : "bg-secondary text-secondary-foreground";
  const iconSrc = isUser ? "/icons/user.svg" : "/icons/bot.svg";
  const iconAlt = isUser ? "User" : "Bot";

  return (
    <div
      className={`flex w-full max-w-2xl animate-fade-in-up items-start space-x-4 ${
        isUser ? "self-end justify-end" : "self-start"
      }`}
    >
      <div className="flex-shrink-0">
        <Image src={iconSrc} alt={iconAlt} width={24} height={24} />
      </div>
      <div className={`rounded-lg px-4 py-3 ${bubbleClasses}`}>
        <p className="text-balance leading-relaxed">{text}</p>
        {!isUser && params && (
          <div className="mt-2">
            <button
              onClick={() => setIsMetaVisible(!isMetaVisible)}
              className="text-xs text-muted-foreground hover:underline"
            >
              {isMetaVisible ? "Hide" : "Show"} Details
            </button>
            {isMetaVisible && (
              <div className="mt-1 rounded-md bg-background/50 p-2 text-xs text-foreground">
                <p>Latency: {latency?.toFixed(2)}s</p>
                <p>
                  Temp: {params.temperature}, Top-P: {params.top_p}, Rep Pen:{" "}
                  {params.repetition_penalty}
                </p>
                <p>
                  Model: {meta?.model}, Device: {meta?.device}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const LoadingBubble = () => (
  <div className="flex w-full max-w-2xl items-start space-x-4 self-start">
    <div className="flex-shrink-0">
      <Image src="/icons/bot.svg" alt="Bot" width={24} height={24} />
    </div>
    <div className="rounded-lg bg-secondary px-4 py-3 text-secondary-foreground">
      <div className="flex items-center justify-center space-x-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-0"></span>
        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-150"></span>
        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground delay-300"></span>
      </div>
    </div>
  </div>
);