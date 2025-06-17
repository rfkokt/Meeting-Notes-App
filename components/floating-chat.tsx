"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, MessageCircle, Send, User, X } from "lucide-react";
import { useState } from "react";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface FloatingChatProps {
  transcript: string;
  chatMessages: ChatMessage[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onChatSubmit: () => void;
}

export function FloatingChat({
  transcript,
  chatMessages,
  chatInput,
  onChatInputChange,
  onChatSubmit,
}: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    onChatSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 z-50"
          disabled={!transcript}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">Tanya AI</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      Ask me anything about the meeting content
                    </p>
                  </div>
                )}
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 ${
                        message.type === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-900 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.type === "user" ? (
                          <User className="h-3 w-3 opacity-75" />
                        ) : (
                          <Bot className="h-3 w-3 opacity-75" />
                        )}
                        <span className="text-xs opacity-75 font-medium">
                          {message.type === "user" ? "You" : "AI"}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => onChatInputChange(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={handleKeyPress}
                  disabled={!transcript}
                  className="flex-1 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!chatInput.trim() || !transcript}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {!transcript && (
                <p className="text-xs text-gray-500 mt-2">
                  Upload and process a meeting first to start chatting
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
