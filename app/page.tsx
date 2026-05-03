"use client";

import { useChat } from "./hooks/useChat";
import ChatWindow from "./components/ChatWindow";
import PromptInput from "./components/PromptInput";

export default function Home() {
  const { messages, isLoading, error, sendMessage, stopGeneration, clearChat } =
    useChat();

  return (
    <div className="flex flex-col h-screen bg-white max-w-3xl mx-auto">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h1 className="text-base font-medium text-gray-900">AI Chat</h1>
        <button
          onClick={clearChat}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Очистить
        </button>
      </header>

      {error && (
        <div className="mx-4 mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <ChatWindow messages={messages} isLoading={isLoading} />

      <PromptInput
        onSend={sendMessage}
        onStop={stopGeneration}
        isLoading={isLoading}
      />
    </div>
  );
}