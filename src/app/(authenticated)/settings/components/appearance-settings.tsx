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
                <ThemeSwitcher />
            </CardContent>
        </Card>
    );
}
