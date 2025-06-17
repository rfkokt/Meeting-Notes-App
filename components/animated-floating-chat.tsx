"use client";

import type React from "react";

import { ThemedButton } from "@/components/themed-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Bot, Send, User, X } from "lucide-react";
import { useCallback, useState } from "react";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AnimatedFloatingChatProps {
  transcript: string;
  chatMessages: ChatMessage[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onChatSubmit: () => void;
}

export function AnimatedFloatingChat({
  transcript,
  chatMessages,
  chatInput,
  onChatInputChange,
  onChatSubmit,
}: AnimatedFloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { themeColors } = useThemeColors();

  const handleSubmit = useCallback(() => {
    if (!chatInput.trim() || !transcript) return;

    onChatSubmit();
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  }, [chatInput, transcript, onChatSubmit]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <ThemedButton
            variant="primary"
            onClick={toggleChat}
            disabled={!transcript}
            className={`w-16 h-16 rounded-full shadow-xl transition-all duration-300 ${
              transcript
                ? "hover:scale-110 hover:shadow-2xl"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            Ask AI
          </ThemedButton>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="h-full backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/20 flex flex-col overflow-hidden">
            {/* Header */}
            <div
              className="text-white p-4 flex items-center justify-between"
              style={{ backgroundColor: themeColors.primary }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs opacity-80">Ready to help</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:bg-white/20 p-2 h-9 w-9 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-8">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                          style={{
                            backgroundColor: `${themeColors.primary}20`,
                          }}
                        >
                          <Bot
                            className="h-8 w-8"
                            style={{ color: themeColors.primary }}
                          />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Ask me anything about the meeting content
                        </p>
                      </div>
                    )}

                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] ${
                            message.type === "user"
                              ? "text-white shadow-lg"
                              : "bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 border border-white/20 dark:border-gray-700/20"
                          }`}
                          style={
                            message.type === "user"
                              ? { backgroundColor: themeColors.secondary }
                              : {}
                          }
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            {message.type === "user" ? (
                              <User className="h-4 w-4 opacity-75" />
                            ) : (
                              <Bot className="h-4 w-4 opacity-75" />
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

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20">
                          <div className="flex items-center space-x-2 mb-2">
                            <Bot className="h-4 w-4 opacity-75" />
                            <span className="text-xs opacity-75 font-medium">
                              AI is thinking...
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            <div
                              className="w-3 h-3 rounded-full animate-bounce"
                              style={{ backgroundColor: themeColors.primary }}
                            />
                            <div
                              className="w-3 h-3 rounded-full animate-bounce"
                              style={{
                                backgroundColor: themeColors.secondary,
                                animationDelay: "0.2s",
                              }}
                            />
                            <div
                              className="w-3 h-3 rounded-full animate-bounce"
                              style={{
                                backgroundColor: themeColors.primary,
                                animationDelay: "0.4s",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Fixed Input Area */}
              <div className="flex-shrink-0 p-4 border-t border-white/20 dark:border-gray-800/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
                <div className="flex space-x-3">
                  <Input
                    value={chatInput}
                    onChange={(e) => onChatInputChange(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={handleKeyPress}
                    disabled={!transcript}
                    className="flex-1 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20 dark:border-gray-700/20 focus:bg-white/80 dark:focus:bg-gray-800/80 transition-colors"
                  />
                  <ThemedButton
                    variant="secondary"
                    onClick={handleSubmit}
                    disabled={!chatInput.trim() || !transcript}
                    className="rounded-2xl px-4 hover:scale-105 transition-transform duration-200"
                  >
                    <Send className="h-4 w-4" />
                  </ThemedButton>
                </div>
                {!transcript && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Upload and process a meeting first to start chatting
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={toggleChat}
        />
      )}
    </>
  );
}
