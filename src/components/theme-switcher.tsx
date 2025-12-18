"use client";

import * as React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ThemeSwitcher() {
    const { currentTheme, setTheme, themes } = useTheme();

    return (
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
    );
}
