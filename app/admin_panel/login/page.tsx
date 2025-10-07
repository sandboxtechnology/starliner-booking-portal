"use client"

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
import { apiRequest } from "@/lib/api-config";
import Image from "next/image";

export default function AdminLoginPage() {
    // Define state
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset state
        setError("");
        setIsLoading(true);

        // Make API request
        const { data: requestData, error: apiError } = await apiRequest("local", "/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        })

        // Handle response
        if (apiError || !requestData) {
            setError(apiError || "Error: Login failed");
            setIsLoading(false);
            return;
        }

        // Store token in cookie
        if (requestData?.data?.token) {
            document.cookie = `admin_token=${requestData?.data?.token}; path=/;`;
            document.cookie = `admin_name=${requestData?.data?.user?.name}; path=/;`;
        }

        // Redirect to admin panel
        router.push("/admin_panel");
        router.refresh();
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
            <Card className="w-full max-w-md shadow-soft-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex items-center justify-center">
                        <Image src="https://starlinerdreamtours.com/wp-content/uploads/2025/08/large_logo.png" alt="Logo" width={170} height={170} />
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
                    <CardDescription>Enter your credentials to access the admin panel</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email / Username</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="Enter email or username"
                                    value={email}
                                    onChange={(e: any) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={isLoading}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e: any) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {error && <span className="text-sm text-red-500 block mb-4">{error}</span>}

                        <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
