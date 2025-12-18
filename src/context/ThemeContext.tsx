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
    themes: ThemeColor[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [currentTheme, setCurrentTheme] = useState("blue");
    const [isInitialized, setIsInitialized] = useState(false);

    const setTheme = (themeName: string) => {
        const theme = themes.find((t) => t.name === themeName);
        if (!theme) return;

        setCurrentTheme(themeName);
        localStorage.setItem("app-theme", themeName);

        const root = document.documentElement;
        const isDark = root.classList.contains("dark");
        const cssVars = isDark ? theme.cssVars.dark : theme.cssVars.light;

        Object.entries(cssVars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    };

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("app-theme");
        const themeToApply = savedTheme || "blue";

        // Apply the theme immediately
        setTheme(themeToApply);
        setIsInitialized(true);
    }, []);

    // Listen for dark mode changes to update variables if needed
    useEffect(() => {
        if (!isInitialized) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    // Re-apply current theme to ensure correct mode variables are used
                    const theme = themes.find((t) => t.name === currentTheme);
                    if (!theme) return;

                    const root = document.documentElement;
                    const isDark = root.classList.contains("dark");
                    const cssVars = isDark ? theme.cssVars.dark : theme.cssVars.light;

                    Object.entries(cssVars).forEach(([key, value]) => {
                        root.style.setProperty(key, value);
                    });
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, [currentTheme, isInitialized]);

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
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
