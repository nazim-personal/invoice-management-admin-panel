"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { UserMeResponse } from "@/lib/types/users";
import { putRequest } from "@/lib/helpers/axios/RequestService";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

// Same regex rules as backend
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export function SecuritySettings() {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Live password match check
  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError(null);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (newPassword && value !== newPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError(null);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    // Validation before request
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must include uppercase, lowercase, number, and special character"
      );
      return;
    }

    try {
      setLoading(true);
      const response: UserMeResponse = await putRequest({
        url: `/api/users/password`,
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      });
      toast({
        title: "Password Updated",
        description: "Password updated successfully.",
        variant: "success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({
        title: "Password Not Updated",
        description: "Password not updated.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Change Password</CardTitle>
          <CardDescription>
            Update your password here. Choose a strong one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handlePasswordUpdate}>
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* New Password */}
              <div className="grid gap-2 relative">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => handleNewPasswordChange(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2 relative">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Live error message */}
            {passwordMatchError && (
              <p className="text-red-600">{passwordMatchError}</p>
            )}
            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Auth */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa-switch">Enable 2FA</Label>
            <Switch id="2fa-switch" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Configure 2FA</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
