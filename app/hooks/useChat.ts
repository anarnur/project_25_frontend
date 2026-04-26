import { useState, useCallback, useRef } from "react";
import { Message, ApiError } from "../lib/types";
import { streamGenerate } from "../lib/api";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    setError(null);

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: prompt,
    };

    const assistantMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: "",
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      await streamGenerate(
        prompt,
        (token) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: msg.content + token }
                : msg
            )
          );
        },
        abortControllerRef.current.signal
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        // пользователь остановил — это нормально
      } else if (err.status === 429) {
        setError("Превышен лимит запросов. Подождите минуту.");
      } else if (err.status >= 500) {
        setError("Ошибка сервера. Попробуйте ещё раз.");
      } else {
        setError("Что-то пошло не так. Проверьте соединение.");
      }
    } finally {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading]);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const clearChat = useCallback(() => {
    if (isLoading) abortControllerRef.current?.abort();
    setMessages([]);
    setError(null);
  }, [isLoading]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearChat,
  };
}