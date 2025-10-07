"use client"

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown, MoveRightIcon, Phone, Search } from "lucide-react";
import { Button } from "./ui/button";

// Define navigation
const navItems = [
    { href: "https://starlinerdreamtours.com/about-us/", label: "About Us" },
    { href: "https://starlinerdreamtours.com/destinations/", label: "Destinations" },
    { href: "https://starlinerdreamtours.com/activities/", label: "Activities", caret: true },
    { href: "https://starlinerdreamtours.com/special-offer/", label: "Offers" },
    { href: "https://starlinerdreamtours.com/blog/", label: "Blog" },
    { href: "https://starlinerdreamtours.com/contact-us/", label: "Contact Us" }
]

export function SiteHeader() {
    // Define path
    const pathname = usePathname();

    // Skip header for admin panel
    if (pathname?.startsWith("/admin_panel")) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50">
            <div
                className="mx-4 my-4 rounded-full border-1 bg-gray-50 px-4 md:px-6"
                aria-label="Site Header"
            >
                <div className="mx-auto">
                    <div className="flex h-16 items-center justify-between gap-3 md:h-20">
                        <Link href="/" className="flex items-center gap-3" aria-label="Homepage">
                            <Image
                                src="https://starlinerdreamtours.com/wp-content/uploads/2025/08/large_logo.png"
                                width={150}
                                height={60}
                                alt="Starliner Dream Tours"
                                className="h-7 w-auto sm:h-10 md:h-14"
                                priority
                            />
                        </Link>
                        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
                                >
                                    <span className="inline-flex font-semibold text-[16px] items-center gap-1">
                                        {item.label}
                                    </span>
                                </Link>
                            ))}
                        </nav>

                        {/* Right: Utility actions */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-transparent hover:bg-[#02549e] cursor-pointer" aria-label="Call us">
                                <Link href="tel:+113459276764">
                                    <Phone className="size-4" />
                                </Link>
                            </Button>
                            <Button className="rounded-full h-12 w-auto px-[20px] bg-[#02549e] border-1 border-[#02549e] hover:bg-white hover:text-[#02549e] hover:border-1 hover:border-[#02549e] cursor-pointer">
                                <span className="font-semibold">Book Now</span>
                                <MoveRightIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
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
                    <Link href="https://starlinerdreamtours.com/contact-us/" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
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
