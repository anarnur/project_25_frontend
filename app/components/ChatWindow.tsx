import { useEffect, useRef } from "react";
import { Message } from "../lib/types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: Message[];
}

export default function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-20 text-sm">
          Напишите что-нибудь, чтобы начать диалог
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}