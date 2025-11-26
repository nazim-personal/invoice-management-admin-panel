

"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProfileSettings } from "./components/profile-settings";
import { SecuritySettings } from "./components/security-settings";
import { NotificationsSettings } from "./components/notifications-settings";
import { BillingSettings } from "./components/billing-settings";

export default function SettingsPage() {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold font-headline">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl">
        <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-6">
          <TabsList className="flex flex-row md:flex-col h-auto md:h-full justify-start items-start gap-2 bg-transparent p-0 border-none">
            <TabsTrigger value="profile" className="w-full justify-start">Profile</TabsTrigger>
            <TabsTrigger value="security" className="w-full justify-start">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="w-full justify-start">Notifications</TabsTrigger>
            <TabsTrigger value="billing" className="w-full justify-start">Billing</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsSettings />
            </TabsContent>
            <TabsContent value="billing">
              <BillingSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
