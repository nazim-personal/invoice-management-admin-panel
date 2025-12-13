"use client";

import { useState, useEffect } from "react";
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
import { getRequest, putRequest } from "@/lib/helpers/axios/RequestService";
import { UserApiResponseTypes, UserDataTypes, UserMeResponse, UserResultsReponseType } from "@/lib/types/users";
import { useToast } from "@/hooks/use-toast";

export function ProfileSettings() {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserDataTypes>({
    id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch default profile data on mount
  const getProfile = async () => {
    try {
      setLoading(true);
      const response: UserMeResponse = await getRequest({
        url: "/api/users/me",
      });
      setUserProfile(response.user_info as unknown as UserDataTypes);
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response: UserMeResponse = await putRequest({
        url: `/api/users/profile`,
        body: JSON.stringify({
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
        }),
      });
      toast({
      title: 'Profile Updated',
      description: 'Profile updated successfully.',
      variant: "success",
    });      
    } catch (err: any) {
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UserDataTypes, value: string) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Profile Information</CardTitle>
        <CardDescription>Update your personal details here.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userProfile.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={userProfile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button type="submit" onClick={handleSubmit} disabled={saving || loading}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
