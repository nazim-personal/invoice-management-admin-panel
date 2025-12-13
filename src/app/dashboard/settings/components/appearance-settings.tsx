"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function AppearanceSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                    Customize the appearance of the application. Automatically switch between day and night themes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Theme Color
                        </label>
                        <p className="text-[0.8rem] text-muted-foreground">
                            Select the primary color for the dashboard.
                        </p>
                        <ThemeSwitcher />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
