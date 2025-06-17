"use client";

import { Button } from "@/components/ui/button";
import { Check, Palette, X } from "lucide-react";
import { useState } from "react";

interface ThemeCustomizerProps {
  onThemeChange: (colors: { primary: string; secondary: string }) => void;
}

const colorPresets = [
  { name: "Teal & Orange", primary: "#14b8a6", secondary: "#f97316" },
  { name: "Blue & Purple", primary: "#3b82f6", secondary: "#8b5cf6" },
  { name: "Green & Pink", primary: "#10b981", secondary: "#ec4899" },
  { name: "Red & Yellow", primary: "#ef4444", secondary: "#f59e0b" },
  { name: "Indigo & Rose", primary: "#6366f1", secondary: "#f43f5e" },
  { name: "Cyan & Amber", primary: "#06b6d4", secondary: "#f59e0b" },
  { name: "Gray & Black", primary: "#374151", secondary: "#111827" },
];

export function ThemeCustomizer({ onThemeChange }: ThemeCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(colorPresets[0]);

  const handleThemeSelect = (theme: (typeof colorPresets)[0]) => {
    setSelectedTheme(theme);
    onThemeChange({ primary: theme.primary, secondary: theme.secondary });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <Palette className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-20 right-4 w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/20 z-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Theme Colors
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1 h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {colorPresets.map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => handleThemeSelect(preset)}
                    className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {preset.name}
                      </span>
                    </div>
                    {selectedTheme.name === preset.name && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
