import {
  User,
  Bot,
  Bug,
  Code,
  Zap,
  Database,
  TestTube,
  FileJson,
} from "lucide-react";

const suggestions = [
  { icon: Bug, text: "Explain React error", color: "text-red-500" },
  { icon: Code, text: "Write unit tests", color: "text-green-500" },
  { icon: Zap, text: "Optimize code", color: "text-blue-500" },
  { icon: Database, text: "Database design", color: "text-purple-500" },
  { icon: TestTube, text: "Setup CI/CD", color: "text-indigo-500" },
  { icon: FileJson, text: "Performance tips", color: "text-yellow-500" },
];

export default function ChatArea({ messages, selectedModel }) {
  const hasMessages = messages.length > 0;

  return (
    <div className="overflow-y-auto min-h-0">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        <div className="text-xs text-gray-500 mb-6">
          Model:{" "}
          <span className="text-primary font-semibold">{selectedModel}</span>
        </div>

        {!hasMessages ? (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold dark:text-white mb-2">
              Ask <span className="text-primary">DevHub AI</span> anything
            </h1>
            <p className="text-gray-500 max-w-xl mb-10">
              Get help with code, debug errors, or learn new concepts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
              {suggestions.map((item, i) => (
                <button
                  key={i}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-primary transition"
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-medium dark:text-gray-200">
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-primary" : "bg-gray-700"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={18} color="white" />
                  ) : (
                    <Bot size={18} color="white" />
                  )}
                </div>
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
