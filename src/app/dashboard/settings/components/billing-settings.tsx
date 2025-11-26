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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { UserDataTypes, UserMeResponse } from "@/lib/types/users";
import { getRequest, putRequest } from "@/lib/helpers/axios/RequestService";
import { useToast } from "@/hooks/use-toast";

export function BillingSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserDataTypes>({
    billing_address: "",
    billing_city: "",
    billing_gst: "",
    billing_pin: "",
    billing_state: "",
    id: "",
    name: "",
    email: "",
    phone: "",
  });

  // Fetch profile
  const getProfile = async () => {
    try {
      setLoading(true);
      const response: UserMeResponse = await getRequest({
        url: "/api/users/me",
      });
      setUserProfile(response.user_info as unknown as UserDataTypes);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Update billing info
  const handleBillingUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await putRequest({
        url: `/api/users/billing`,
        body: JSON.stringify({
          billing_address: userProfile.billing_address,
          billing_city: userProfile.billing_city,
          billing_state: userProfile.billing_state,
          billing_pin: userProfile.billing_pin,
          billing_gst: userProfile.billing_gst,
        }),
      });
      toast({
        title: "Billing Updated",
        description: "Your billing details were updated successfully.",
        variant: "success",
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Payment Methods (static demo for now) */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <CreditCard className="h-6 w-6" />
              <div>
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-sm text-muted-foreground">
                  Expires 12/2026
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Remove
            </Button>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </CardFooter>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Billing Address</CardTitle>
          <CardDescription>Update your billing address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleBillingUpdate}>
            <div className="grid gap-2">
              <Label htmlFor="billing-name">Name</Label>
              <Input
                id="billing-name"
                value={userProfile.name}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="billing-address">Address</Label>
              <Input
                id="billing-address"
                value={userProfile.billing_address}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    billing_address: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={userProfile.billing_city}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      billing_city: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={userProfile.billing_state}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      billing_state: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={userProfile.billing_pin}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      billing_pin: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gstin">GST Number</Label>
              <Input
                id="gstin"
                value={userProfile.billing_gst}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    billing_gst: e.target.value,
                  })
                }
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Billing Address"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
