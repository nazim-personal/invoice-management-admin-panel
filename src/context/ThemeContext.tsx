"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeColor = {
    name: string;
    label: string;
    activeColor: string;
    cssVars: {
        light: Record<string, string>;
        dark: Record<string, string>;
    };
};

type ThemeMode = "light" | "dark" | "system";

const themes: ThemeColor[] = [
    {
        name: "blue",
        label: "Blue",
        activeColor: "217 91% 60%",
        cssVars: {
            light: {
                "--primary": "217 91% 60%",
                "--ring": "217 91% 60%",
                "--sidebar-primary": "217 91% 60%",
                "--sidebar-ring": "217 91% 60%",
            },
            dark: {
                "--primary": "217 91% 60%",
                "--ring": "217 91% 60%",
                "--sidebar-primary": "217 91% 60%",
                "--sidebar-ring": "217 91% 60%",
            },
        },
    },
    {
        name: "green",
        label: "Green",
        activeColor: "142 76% 36%",
        cssVars: {
            light: {
                "--primary": "142 76% 36%",
                "--ring": "142 76% 36%",
                "--sidebar-primary": "142 76% 36%",
                "--sidebar-ring": "142 76% 36%",
            },
            dark: {
                "--primary": "142 70% 50%",
                "--ring": "142 70% 50%",
                "--sidebar-primary": "142 70% 50%",
                "--sidebar-ring": "142 70% 50%",
            },
        },
    },
    {
        name: "purple",
        label: "Purple",
        activeColor: "262 83% 58%",
        cssVars: {
            light: {
                "--primary": "262 83% 58%",
                "--ring": "262 83% 58%",
                "--sidebar-primary": "262 83% 58%",
                "--sidebar-ring": "262 83% 58%",
            },
            dark: {
                "--primary": "263 70% 50%",
                "--ring": "263 70% 50%",
                "--sidebar-primary": "263 70% 50%",
                "--sidebar-ring": "263 70% 50%",
            },
        },
    },
    {
        name: "orange",
        label: "Orange",
        activeColor: "24 95% 53%",
        cssVars: {
            light: {
                "--primary": "24 95% 53%",
                "--ring": "24 95% 53%",
                "--sidebar-primary": "24 95% 53%",
                "--sidebar-ring": "24 95% 53%",
            },
            dark: {
                "--primary": "20 90% 60%",
                "--ring": "20 90% 60%",
                "--sidebar-primary": "20 90% 60%",
                "--sidebar-ring": "20 90% 60%",
            },
        },
    },
    {
        name: "red",
        label: "Red",
        activeColor: "0 72% 51%",
        cssVars: {
            light: {
                "--primary": "0 72% 51%",
                "--ring": "0 72% 51%",
                "--sidebar-primary": "0 72% 51%",
                "--sidebar-ring": "0 72% 51%",
            },
            dark: {
                "--primary": "0 70% 60%",
                "--ring": "0 70% 60%",
                "--sidebar-primary": "0 70% 60%",
                "--sidebar-ring": "0 70% 60%",
            },
        },
    },
];

type ThemeContextType = {
    currentTheme: string;
    setTheme: (themeName: string) => void;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    themes: ThemeColor[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [currentTheme, setCurrentTheme] = useState("blue");
    const [mode, setModeState] = useState<ThemeMode>("system");
    const [isInitialized, setIsInitialized] = useState(false);

    const applyThemeVars = (themeName: string, isDark: boolean) => {
        const theme = themes.find((t) => t.name === themeName);
        if (!theme) return;

        const root = document.documentElement;
        const cssVars = isDark ? theme.cssVars.dark : theme.cssVars.light;

        Object.entries(cssVars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    };

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem("app-mode", newMode);

        const root = document.documentElement;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const effectiveMode = newMode === "system" ? systemTheme : newMode;

        if (effectiveMode === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        applyThemeVars(currentTheme, effectiveMode === "dark");
    };

    const setTheme = (themeName: string) => {
        const theme = themes.find((t) => t.name === themeName);
        if (!theme) return;

        setCurrentTheme(themeName);
        localStorage.setItem("app-theme", themeName);

        const root = document.documentElement;
        const isDark = root.classList.contains("dark");
        applyThemeVars(themeName, isDark);
    };

    // Initialize theme and mode on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("app-theme") || "blue";
        const savedMode = (localStorage.getItem("app-mode") as ThemeMode) || "system";

        setCurrentTheme(savedTheme);
        setModeState(savedMode); // Set state directly to avoid closure stale state in setMode helper if used

        // Apply mode
        const root = document.documentElement;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const effectiveMode = savedMode === "system" ? systemTheme : savedMode;

        if (effectiveMode === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        // Apply theme vars using the saved theme (not currentTheme state which is stale)
        applyThemeVars(savedTheme, effectiveMode === "dark");

        setIsInitialized(true);
    }, []);

    // Listen for system theme changes
    useEffect(() => {
        if (mode !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            const root = document.documentElement;
            if (mediaQuery.matches) {
                root.classList.add("dark");
                applyThemeVars(currentTheme, true);
            } else {
                root.classList.remove("dark");
                applyThemeVars(currentTheme, false);
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [mode, currentTheme]);

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme, mode, setMode, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
