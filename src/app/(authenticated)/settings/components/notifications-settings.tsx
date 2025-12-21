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
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { getRequest, putRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { NotificationSettings, NotificationSettingsApiResponse } from "@/lib/types/notification-settings";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    invoice_created: false,
    payment_received: false,
    invoice_overdue: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response: NotificationSettingsApiResponse = await getRequest({
        url: "/api/notification-settings",
      });
      if (response.success && response.data?.results) {
        setSettings(response.data.results);
      }
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response: NotificationSettingsApiResponse = await putRequest({
        url: "/api/notification-settings",
        body: {
          invoice_created: settings.invoice_created,
          payment_received: settings.payment_received,
          invoice_overdue: settings.invoice_overdue,
        },
      });

      if (response.success) {
        toast({
          title: "Settings Saved",
          description: "Your notification preferences have been updated.",
          variant: "success",
        });
      }
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckboxChange = (key: keyof NotificationSettings, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Notification Settings</CardTitle>
        <CardDescription>
          Manage how you receive email notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="font-semibold">Email Notifications</div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="invoice-created"
                checked={settings.invoice_created}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("invoice_created", checked as boolean)
                }
              />
              <Label htmlFor="invoice-created" className="cursor-pointer">
                Invoice Created
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="payment-received"
                checked={settings.payment_received}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("payment_received", checked as boolean)
                }
              />
              <Label htmlFor="payment-received" className="cursor-pointer">
                Payment Received
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="invoice-overdue"
                checked={settings.invoice_overdue}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("invoice_overdue", checked as boolean)
                }
              />
              <Label htmlFor="invoice-overdue" className="cursor-pointer">
                Invoice Overdue
              </Label>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSave} loading={isSaving} disabled={isLoading}>
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}
