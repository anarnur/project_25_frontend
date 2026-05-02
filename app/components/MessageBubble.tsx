import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Message } from "../lib/types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md"
            : "bg-white border border-gray-200 text-gray-800 shadow-sm"
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                const isBlock = match || String(children).includes("\n");
                return isBlock ? (
                  <SyntaxHighlighter
                    style={oneLight}
                    language={match ? match[1] : "text"}
                    PreTag="div"
                    className="rounded-lg text-xs my-2"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-xs"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              ul({ children }) {
                return (
                  <ul className="list-disc list-inside mb-2 space-y-1">
                    {children}
                  </ul>
                );
              },
              ol({ children }) {
                return (
                  <ol className="list-decimal list-inside mb-2 space-y-1">
                    {children}
                  </ol>
                );
              },
              strong({ children }) {
                return <strong className="font-semibold">{children}</strong>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        {message.isStreaming && (
          <span className="inline-block w-1.5 h-4 ml-1 bg-gray-400 animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  );
}