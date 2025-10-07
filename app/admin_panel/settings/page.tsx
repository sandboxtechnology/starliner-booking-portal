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
import { CheckCircle2, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [passwordSuccess, setPasswordSuccess] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError("")
        setPasswordSuccess("")

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("All fields are required")
            return
        }

        if (newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters")
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match")
            return
        }

        const success = changePassword(currentPassword, newPassword)
        if (success) {
            setPasswordSuccess("Password changed successfully")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } else {
            setPasswordError("Current password is incorrect")
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
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

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

                            <Button type="submit" className="shadow-soft hover:shadow-soft-lg transition-smooth">
                                <CheckCircle2 className="h-4 w-4" /> Change Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
