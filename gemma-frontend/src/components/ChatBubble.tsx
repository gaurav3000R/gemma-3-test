import Image from "next/image";

interface ChatBubbleProps {
  text: string;
  isUser: boolean;
}

export const ChatBubble = ({ text, isUser }: ChatBubbleProps) => {
  const bubbleClasses = isUser
    ? "bg-primary text-primary-foreground"
    : "bg-secondary text-secondary-foreground";
  const iconSrc = isUser ? "/icons/user.svg" : "/icons/bot.svg";
  const iconAlt = isUser ? "User" : "Bot";

  return (
    <div className={`flex w-full max-w-2xl animate-fade-in-up items-start space-x-4 ${isUser ? 'self-end justify-end' : 'self-start'}`}>
      <div className="flex-shrink-0">
        <Image src={iconSrc} alt={iconAlt} width={24} height={24} />
      </div>
      <div
        className={`rounded-lg px-4 py-3 ${bubbleClasses}`}
      >
        <p className="text-balance leading-relaxed">{text}</p>
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