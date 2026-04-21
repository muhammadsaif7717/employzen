"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"


interface EmployzenThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeProviderProps["defaultTheme"]
  forcedTheme?: ThemeProviderProps["forcedTheme"]
  storageKey?: ThemeProviderProps["storageKey"]
}

export default function ThemeProvider({
  children,
  defaultTheme = "system",
  forcedTheme,
  storageKey = "employzen-theme",
}: EmployzenThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"        // matches darkMode: 'class' in tailwind.config.ts
      defaultTheme={defaultTheme}
      enableSystem             // respects OS light/dark preference
      disableTransitionOnChange // prevents color flash on theme switch
      storageKey={storageKey}  // key used in localStorage
      {...(forcedTheme ? { forcedTheme } : {})}
    >
      {children}
    </NextThemesProvider>
  )
}