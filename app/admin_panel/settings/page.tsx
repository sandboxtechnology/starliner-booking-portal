"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { changePassword, getAdminEmail } from "@/lib/admin-auth"
import { useState } from "react"
import { CheckCircle2, Eye, EyeOff, Loader } from "lucide-react"
import { apiRequest } from "@/lib/api-config"

export default function SettingsPage() {
    // Define state
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");
        setFormLoading(true);

        // Get cookie values
        const email = document.cookie
            .split("; ")
            .find((row) => row.startsWith("admin_email="))
            ?.split("=")[1];

        // Validation
        if (!newPassword || !confirmPassword) {
            setPasswordError("Error: All fields are required");
            return;
        }

        // Check password length
        if (newPassword.length < 6) {
            setPasswordError("Error: New password must be at least 8 characters");
            return;
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            setPasswordError("Error: New passwords do not match");
            return;
        }

        // API Call for password change
        const { data: changeResponse } = await apiRequest<any>("local", "/api/auth/change_password", {
            method: "POST",
            body: JSON.stringify({ email, password: newPassword })
        });

        // Handle response
        if (changeResponse?.success) {
            setPasswordSuccess("Success! Password changed successfully");
            setNewPassword("");
            setConfirmPassword("");
            setFormLoading(false);
        } else {
            setPasswordError("Error: Current password is incorrect");
            setFormLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your platform settings and preferences</p>
            </div>
            <div className="max-w-3xl space-y-6">
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handlePasswordChange} className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                            {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}

                            <Button type="submit" className="shadow-soft hover:shadow-soft-lg transition-smooth cursor-pointer">
                                {formLoading && <Loader className="h-4 w-4 animate-spin" />}
                                {!formLoading && <CheckCircle2 className="h-4 w-4" />}
                                Change Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
