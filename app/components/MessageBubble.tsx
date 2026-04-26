import { Message } from "../lib/types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {message.content}
        {message.isStreaming && (
          <span className="inline-block w-1.5 h-4 ml-1 bg-gray-400 animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  );
}