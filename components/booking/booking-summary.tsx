"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Tour } from "@/lib/tours"
import { Calendar, Clock, Users, Mail, Phone, DollarSign } from "lucide-react"

function formatPrice(n: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

type BookingSummaryProps = {
    tour: Tour
    selectedDate: Date | null
    timeSlot: string
    adults: number
    children812: number
    children37: number
    infants: number
}

export function BookingSummary({
    tour,
    selectedDate,
    timeSlot,
    adults,
    children812,
    children37,
    infants
}: BookingSummaryProps) {
    const totalTravellers = adults + children812 + children37 + infants

    return (
        <Card className="sticky top-24 h-fit overflow-hidden bg-card shadow-soft-lg pt-0 border-border/50">
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={tour.image || "/placeholder.svg"}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-smooth hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <CardHeader className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">{tour.title}</h3>
                <p className="text-sm hidden text-muted-foreground leading-relaxed">{tour.short_description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Duration</span>
                    </div>
                    <span className="text-sm font-semibold">{tour.duration_hours} hrs</span>
                </div>

                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>Price per person</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{formatPrice(tour.price)}</span>
                </div>

                {selectedDate && (
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Date</span>
                        </div>
                        <span className="text-sm font-semibold">{selectedDate.toLocaleDateString()}</span>
                    </div>
                )}

                {timeSlot && (
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Time</span>
                        </div>
                        <span className="text-sm font-semibold">{timeSlot}</span>
                    </div>
                )}

                {totalTravellers > 0 && (
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Travelers</span>
                        </div>
                        <span className="text-sm font-semibold">{totalTravellers}</span>
                    </div>
                )}

                {totalTravellers > 0 && <div className="flex items-center justify-between pt-4 border-primary/20">
                    <span className="text-md font-bold text-foreground">Payable Amount</span>
                    <span className="text-md font-bold text-primary">{formatPrice(tour.price)}</span>
                </div>}
            </CardContent>
        </Card>
    )
}
