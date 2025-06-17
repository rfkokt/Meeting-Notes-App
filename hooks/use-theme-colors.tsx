"use client"

import { useState, useEffect } from "react"

export function useThemeColors() {
  const [themeColors, setThemeColors] = useState({ primary: "#14b8a6", secondary: "#f97316" })

  useEffect(() => {
    const updateColors = () => {
      const primary = getComputedStyle(document.documentElement).getPropertyValue("--theme-primary") || "#14b8a6"
      const secondary = getComputedStyle(document.documentElement).getPropertyValue("--theme-secondary") || "#f97316"
      setThemeColors({ primary, secondary })
    }

    updateColors()
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] })

    return () => observer.disconnect()
  }, [])

  const updateTheme = (colors: { primary: string; secondary: string }) => {
    setThemeColors(colors)
    document.documentElement.style.setProperty("--theme-primary", colors.primary)
    document.documentElement.style.setProperty("--theme-secondary", colors.secondary)
  }

  return { themeColors, updateTheme }
}
