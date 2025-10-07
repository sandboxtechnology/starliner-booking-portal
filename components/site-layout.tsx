"use client"

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function SiteHeader() {
    // Define path
    const pathname = usePathname();

    // Skip header for admin panel
    if (pathname?.startsWith("/admin_panel")) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border/50 glass-effect shadow-soft">
            <div className="mx-auto max-w-7xl px-4 py-5">
                <div className="flex items-center justify-start">
                    <Link href="/" aria-label="Starline Dream Tours">
                        <Image src="https://starlinerdreamtours.com/wp-content/uploads/2025/08/large_logo.png" alt="Logo" width={150} height={150}></Image>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export function SiteFooter() {
    // Define path
    const pathname = usePathname();

    // Skip footer for admin panel
    if (pathname?.startsWith("/admin_panel")) {
        return null;
    }

    return (
        <footer className="border-t border-border/50 bg-secondary/5 mt-12">
            <div className="mx-auto max-w-7xl px-4 py-5">
                <nav className="flex flex-wrap items-center justify-center gap-6 text-sm mb-3">
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
                        Terms of Service
                    </Link>
                    <span className="text-border" aria-hidden="true">
                        |
                    </span>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
                        Privacy Policy
                    </Link>
                    <span className="text-border" aria-hidden="true">
                        |
                    </span>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
                        Contact Us
                    </Link>
                </nav>
                <p className="text-center text-sm text-muted-foreground">
                    Copyright © {new Date().getFullYear()} Starline Dream Tours. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}

export function MainWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminPanel = pathname?.startsWith("/admin_panel")

    return <main className={isAdminPanel ? "" : "min-h-[calc(100vh-8rem)]"}>{children}</main>
}
