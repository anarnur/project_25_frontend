import { useEffect, useRef } from "react";
import { Message } from "../lib/types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: Message[];
  isLoading: boolean; // Добавляем проп isLoading
}

export default function ChatWindow({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]); // Скроллим и при появлении индикатора тоже

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

      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="text-xs text-gray-500 italic ml-4 mb-4">
          TinyLlama is typing...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}