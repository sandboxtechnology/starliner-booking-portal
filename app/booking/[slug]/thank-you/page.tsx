"use client"

import { useRouter } from "next/navigation"
import { Stepper } from "@/components/booking/stepper"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-config";

export default function ThankYouPage({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // Get query params
    const bookingId = searchParams.ref || "";

    // Define state
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [singleBooking, setSingleBooking] = useState<any>({});

    // Init single tour
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const { data } = await apiRequest("local", "/api/bookings/single", {
                method: "POST",
                body: JSON.stringify({ id: bookingId })
            });
            if (data) setSingleBooking(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    // If booking not found
    if (!bookingId && !singleBooking) {
        router.push(`/`);
    }

    // Loading
    if (loading && bookingId) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Verifying your booking...</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:py-10">
            <Stepper current={4} />
            <section className="flex min-h-[40vh] items-center justify-center">
                <Card className="w-full bg-card text-center shadow-sm">
                    <CardHeader>
                        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">
                            Thank you! Your booking request has been submitted.
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            We’ve sent a confirmation to your email and will follow up to finalize your reservation.
                        </p>
                    </CardHeader>
                    <CardContent className="md:w-[35%] md:mx-auto grid gap-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Booking ID</span>
                            <span className="font-medium">{singleBooking?.booking?.booking_id}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">{singleBooking?.booking?.travel_date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Time</span>
                            <span className="font-medium">{singleBooking?.booking?.travel_time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Total Travelers</span>
                            <span className="font-medium">{singleBooking?.booking?.total_travelers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Final Amount</span>
                            <span className="font-medium">USD {singleBooking?.booking?.total_price}</span>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
