"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/admin-auth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === "/admin_panel/login") {
            setIsChecking(false);
            return;
        }

        // Check authentication
        if (!isAuthenticated()) {
            router.push("/admin_panel/login");
        } else {
            setIsChecking(false);
        }
    }, [pathname, router])

    // Show loading state while checking auth
    if (isChecking) {
        return (
            <div className="flex h-screen items-center justify-center bg-muted/30">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
