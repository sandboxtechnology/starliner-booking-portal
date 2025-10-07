"use client"

import { useEffect, useState } from "react"
import { Stepper } from "@/components/booking/stepper"
import { TourGrid } from "@/components/booking/tour-grid"
import { apiRequest } from "@/lib/api-config"
import type { Tour } from "@/lib/tours"

export default function Page() {
    // Define state
    const [tours, setTours] = useState<Tour[]>([])
    const [loading, setLoading] = useState(true)

    // Init tours
    useEffect(() => {
        async function fetchTours() {
            setLoading(true);
            const { data } = await apiRequest<Tour[]>("local", "/api/tours");
            if (data) setTours(data);
            setLoading(false);
        }
        fetchTours();
    }, []);

    // Loading
    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading activities...</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-7xl space-y-8 px-4 py-10">
            <Stepper current={1} />
            <header className="space-y-3 text-center hidden">
                <h1 className="text-balance text-3xl font-bold text-foreground md:text-3xl lg:text-3xl tracking-tight">
                    Explore Our Tours
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Choose a tour to begin your booking journey.
                </p>
            </header>
            <TourGrid tours={tours} />
        </main>
    )
}
