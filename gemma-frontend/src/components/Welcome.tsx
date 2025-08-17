import Image from "next/image";

export const Welcome = () => (
  <div className="flex flex-1 flex-col items-center justify-center text-center">
    <div className="mb-4 rounded-full bg-secondary p-4">
      <Image src="/icons/bot.svg" alt="Bot" width={40} height={40} />
    </div>
    <h1 className="text-2xl font-semibold text-foreground">
      How can I help you today?
    </h1>
  </div>
);