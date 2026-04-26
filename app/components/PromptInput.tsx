import { useState, KeyboardEvent } from "react";

interface Props {
  onSend: (prompt: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export default function PromptInput({ onSend, onStop, isLoading }: Props) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 py-3 bg-white">
      <div className="flex gap-2 items-end max-w-3xl mx-auto">
        <textarea
          className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[120px]"
          placeholder="Введите сообщение... (Enter для отправки)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={false}
        />
        {isLoading ? (
          <button
            onClick={onStop}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Стоп
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!value.trim()}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Отправить
          </button>
        )}
      </div>
    </div>
  );
}