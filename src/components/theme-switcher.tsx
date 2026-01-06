"use client";

import * as React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Check, Laptop, Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
    const { currentTheme, setTheme, mode, setMode, themes } = useTheme();

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Theme Mode
                </label>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setMode("light")}
                        className={cn(
                            "flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground",
                            mode === "light"
                                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                : "bg-background"
                        )}
                    >
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                    </button>
                    <button
                        onClick={() => setMode("dark")}
                        className={cn(
                            "flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground",
                            mode === "dark"
                                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                : "bg-background"
                        )}
                    >
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                    </button>
                    <button
                        onClick={() => setMode("system")}
                        className={cn(
                            "flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground",
                            mode === "system"
                                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                : "bg-background"
                        )}
                    >
                        <Laptop className="mr-2 h-4 w-4" />
                        System
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Theme Color
                </label>
                <div className="flex flex-wrap gap-2">
                    {themes.map((theme) => (
                        <button
                            key={theme.name}
                            onClick={() => setTheme(theme.name)}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs transition-all",
                                currentTheme === theme.name
                                    ? "border-primary"
                                    : "border-muted-foreground/20 hover:border-muted-foreground/40"
                            )}
                            title={theme.label}
                        >
                            <span
                                className="flex h-6 w-6 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: `hsl(${theme.activeColor})`,
                                }}
                            >
                                {currentTheme === theme.name && (
                                    <Check className="h-4 w-4 text-white" />
                                )}
                            </span>
                            <span className="sr-only">{theme.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
