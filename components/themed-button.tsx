"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { forwardRef } from "react";

interface ThemedButtonProps extends React.ComponentProps<typeof Button> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children: React.ReactNode;
}

export const ThemedButton = forwardRef<HTMLButtonElement, ThemedButtonProps>(
  (
    { variant = "primary", className = "", style = {}, children, ...props },
    ref
  ) => {
    const { themeColors } = useThemeColors();

    const getButtonStyle = () => {
      switch (variant) {
        case "primary":
          return {
            backgroundColor: themeColors.primary,
            color: "white",
            ...style,
          };
        case "secondary":
          return {
            backgroundColor: themeColors.secondary,
            color: "white",
            ...style,
          };
        case "outline":
          return {
            borderColor: themeColors.primary,
            color: themeColors.primary,
            ...style,
          };
        default:
          return style;
      }
    };

    const getHoverClass = () => {
      switch (variant) {
        case "primary":
          return "hover:opacity-90";
        case "secondary":
          return "hover:opacity-90";
        case "outline":
          return "hover:bg-opacity-10";
        default:
          return "";
      }
    };

    return (
      <Button
        ref={ref}
        className={`transition-all duration-200 ${getHoverClass()} ${className}`}
        style={getButtonStyle()}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ThemedButton.displayName = "ThemedButton";
