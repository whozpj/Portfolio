"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Prithvi (The AI version). Ask me anything about myself, my experience, projects, or skills!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please make sure the API is set up correctly.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", damping: 25, stiffness: 200 }}
      className="hidden lg:flex fixed right-0 top-0 h-screen w-96 z-40 flex-col bg-neutral-950 border-l border-neutral-800 relative overflow-hidden"
      style={{ position: 'fixed' }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #8b5cf6 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, #8b5cf6 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, #8b5cf6 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Animated Accent Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Header */}
      <div className="p-6 border-b border-neutral-800 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="text-white text-xs font-medium relative z-10">PR</span>
          </motion.div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-white">Prithvi's AI</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Ask me anything</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent relative z-10">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: idx * 0.05,
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <motion.div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 relative ${
                msg.role === "user"
                  ? "bg-white text-black"
                  : "bg-neutral-900 text-neutral-200 border border-neutral-800"
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {msg.role === "user" && (
                <motion.div
                  className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: idx * 0.05 + 0.2, duration: 0.3 }}
                />
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </motion.div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-neutral-900 rounded-lg px-4 py-2.5 border border-neutral-800">
              <div className="flex gap-1.5">
                <motion.div
                  className="w-2 h-2 bg-purple-500 rounded-full"
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0,
                  }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                />
                <motion.div
                  className="w-2 h-2 bg-purple-500 rounded-full"
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0.4,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-neutral-800 relative z-10">
        <div className="flex gap-2">
          <motion.div
            className="flex-1 relative"
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about Prithvi..."
              className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder:text-neutral-600"
              disabled={isLoading}
            />
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 pointer-events-none opacity-0"
              animate={{
                opacity: input.length > 0 ? [0, 0.1, 0] : 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>
          <motion.button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center gap-2 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              <path
                d="M1.5 8L14.5 1.5L10 14.5L7 11.5L1.5 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
