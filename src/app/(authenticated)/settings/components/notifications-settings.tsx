

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function NotificationsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Notification Settings</CardTitle>
        <CardDescription>
          Manage how you receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="font-semibold">Email Notifications</div>
        <div className="flex items-center space-x-2">
          <Checkbox id="invoice-paid" defaultChecked />
          <Label htmlFor="invoice-paid">Invoice Paid</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="invoice-overdue" />
          <Label htmlFor="invoice-overdue">Invoice Overdue</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="promotions" defaultChecked />
          <Label htmlFor="promotions">Promotions & Updates</Label>
        </div>
        <div className="font-semibold pt-4">Push Notifications</div>
        <div className="flex items-center space-x-2">
            <Checkbox id="push-all" defaultChecked />
            <Label htmlFor="push-all">Enable all push notifications</Label>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}
