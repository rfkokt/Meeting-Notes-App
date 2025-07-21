"use client";

import { ThemeCustomizer } from "@/components/theme-customizer";
import { useTheme } from "@/components/theme-provider";
import { ThemedButton } from "@/components/themed-button";
import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Home, Menu, Mic, Moon, Plus, Sun, X } from "lucide-react";
import { useCallback, useState } from "react";

interface TopNavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onNewMeeting: () => void;
}

const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "new-meeting", label: "New Meeting", icon: Mic },
  // { id: "summaries", label: "Summaries", icon: BookOpen },
  // { id: "settings", label: "Settings", icon: Settings },
];

export function TopNavbar({
  currentPage,
  onPageChange,
  onNewMeeting,
}: TopNavbarProps) {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { themeColors, updateTheme } = useThemeColors();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handlePageChange = useCallback(
    (pageId: string) => {
      onPageChange(pageId);
      setIsMobileMenuOpen(false);
    },
    [onPageChange]
  );

  const handleNewMeeting = useCallback(() => {
    onNewMeeting();
    setIsMobileMenuOpen(false);
  }, [onNewMeeting]);

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: themeColors.primary }}
            >
              <Mic className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              MeetingAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return isActive ? (
                <ThemedButton
                  key={item.id}
                  variant="primary"
                  onClick={() => handlePageChange(item.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </ThemedButton>
              ) : (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handlePageChange(item.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:scale-105"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <ThemeCustomizer onThemeChange={updateTheme} />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:scale-110"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            <ThemedButton
              variant="secondary"
              onClick={handleNewMeeting}
              className="hover:scale-105 transition-transform duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Meeting
            </ThemedButton>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden p-2 transition-transform duration-200 hover:scale-110"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 dark:border-gray-800/20 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return isActive ? (
                  <ThemedButton
                    key={item.id}
                    variant="primary"
                    onClick={() => handlePageChange(item.id)}
                    className="justify-start transition-all duration-200"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </ThemedButton>
                ) : (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handlePageChange(item.id)}
                    className="justify-start text-gray-700 dark:text-gray-300 transition-all duration-200"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
