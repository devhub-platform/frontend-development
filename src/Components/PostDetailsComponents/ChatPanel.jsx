import {
  X,
  Sparkles,
  FileText,
  Lightbulb,
  ListChecks,
  MessageSquarePlus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

const quickActions = [
  { icon: FileText, label: 'Summarize post' },
  { icon: Lightbulb, label: 'Explain simply' },
  { icon: ListChecks, label: 'Key points' },
  { icon: MessageSquarePlus, label: 'Ask a question' },
];

export function ChatPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi! I can help you understand this article better. Try using one of the quick actions above, or ask me anything!',
      sender: 'assistant',
      timestamp: 'Just now',
    },
  ]);

  const [inputValue, setInputValue] = useState('');

  const handleQuickAction = (label) => {
    const userMessage = {
      id: messages.length + 1,
      text: label,
      sender: 'user',
      timestamp: 'Just now',
    };

    let responseText = '';
    switch (label) {
      case 'Summarize post':
        responseText =
          'This article explores the evolution of modern workspaces, emphasizing flexibility and technology integration.';
        break;
      case 'Explain simply':
        responseText =
          'Modern offices are becoming flexible, tech-powered spaces designed around people.';
        break;
      case 'Key points':
        responseText =
          '• Flexible workspaces\n• Technology integration\n• Human-centered design';
        break;
      case 'Ask a question':
        responseText = 'What would you like to know about the article?';
        break;
      default:
        responseText = '';
    }

    setMessages([
      ...messages,
      userMessage,
      {
        id: messages.length + 2,
        text: responseText,
        sender: 'assistant',
        timestamp: 'Just now',
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: 'Just now',
      },
      {
        id: messages.length + 2,
        text: 'That’s a great question! 🤍',
        sender: 'assistant',
        timestamp: 'Just now',
      },
    ]);

    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="hidden lg:flex flex-col w-[340px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-lg sticky top-0 h-screen"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-center items-center gap-3 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <Sparkles className="w-5 h-5 text-text-light dark:text-text-dark" />
          <span>AI Assistant</span>    
        </div>

        {/* Quick Actions + Close */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <div className="flex gap-2 flex-wrap flex-1">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.label)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <Icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full shrink-0"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                  m.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-3 rounded-full text-gray-900 outline-0 border-2 border-transparent dark:text-gray-100 focus-within:border-gray-300 dark:focus-within:border-gray-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-3 hover:shadow-lg hover:shadow-primary/50 transition-all rounded-full shrink-0 bg-text-light text-white w-10 h-10 relative dark:bg-text-dark dark:focus:ring-blue-900"
          >
            <MessageSquarePlus className="w-5 h-5 absolute left-2.5 top-2.5" />
          </button>
        </div>
      </motion.div>

      {/* Mobile (لو حابة نكمّله بعدين) */}
      <AnimatePresence>
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
        />
      </AnimatePresence>
    </>
  );
}
