"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SingleBookingPage() {
    // Define state
    const router = useRouter();
    const [loading] = useState(true);

    // Init single tour
    useEffect(() => {
        router.push("/");
    }, []);

    // Loading
    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Redirecting listing page...</p>
                    </div>
                </div>
            </main>
        )
    }
}
