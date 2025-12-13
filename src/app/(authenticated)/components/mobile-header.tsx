
"use client";

import Logo from "@/components/logo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export function MobileHeader() {
    return (
        <header className="flex md:hidden items-center justify-between border-b px-4 h-14">
             <div className="flex items-center gap-2">
                <SidebarTrigger>
                    <Menu className="h-6 w-6" />
                </SidebarTrigger>
                <Logo />
            </div>
        </header>
    )
}
