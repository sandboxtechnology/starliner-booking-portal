"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users, Minus, Plus } from "lucide-react"

type TravelersTabProps = {
    adults: number
    setAdults: (n: number) => void
    children812: number
    setChildren812: (n: number) => void
    children37: number
    setChildren37: (n: number) => void
    infants: number
    setInfants: (n: number) => void
}

export function TravelersTab({
    adults,
    setAdults,
    children812,
    setChildren812,
    children37,
    setChildren37,
    infants,
    setInfants,
}: TravelersTabProps) {
    // Calculate total travelers
    const totalTravellers = useMemo(() => adults + children812 + children37 + infants, [adults, children812, children37, infants]);

    // Hide the plus button if there are 10 or more travelers
    const allowedTravellers = 10;
    const hidePlus = totalTravellers >= allowedTravellers;

    return (
        <Card className="bg-card shadow-soft border-border/50">
            <CardHeader className="space-y-2">
                <h3 className="text-xl font-bold">Select Travelers</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Choose the number of adults, children, and infants. Maximum of {allowedTravellers} travelers allowed.
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="divide-y divide-border/50 rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/30 transition-smooth">
                        <div className="flex-1">
                            <div className="font-semibold text-base">Adults</div>
                            <div className="text-sm text-muted-foreground">Ages 12 or above</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                aria-label="Decrease adults"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="h-8 w-8 rounded-full cursor-pointer border-2 border-border hover:border-primary hover:bg-primary/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center tabular-nums text-primary font-bold text-md">{adults || 1}</span>
                            <button
                                type="button"
                                aria-label="Increase adults"
                                onClick={() => setAdults(adults + 1)}
                                className={cn(
                                    "h-8 w-8 rounded-full cursor-pointer border-2 border-border hover:border-primary hover:bg-primary/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center",
                                    hidePlus && "invisible pointer-events-none",
                                )}
                                disabled={hidePlus}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/30 transition-smooth">
                        <div className="flex-1">
                            <div className="font-semibold text-base">Child</div>
                            <div className="text-sm text-muted-foreground">Ages 8–12</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                aria-label="Decrease children ages 8 to 12"
                                onClick={() => setChildren812(Math.max(0, children812 - 1))}
                                className="h-8 w-8 rounded-full cursor-pointer border-2 border-border hover:border-primary hover:bg-primary/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center tabular-nums text-primary font-bold text-md">{children812}</span>
                            <button
                                type="button"
                                aria-label="Increase children ages 8 to 12"
                                onClick={() => setChildren812(children812 + 1)}
                                className={cn(
                                    "h-8 w-8 rounded-full cursor-pointer border-2 border-border hover:border-primary hover:bg-primary/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center",
                                    hidePlus && "invisible pointer-events-none",
                                )}
                                disabled={hidePlus}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/30 transition-smooth">
                        <div className="flex-1">
                            <div className="font-semibold text-base">Child</div>
                            <div className="text-sm text-muted-foreground">Ages 3–7</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                aria-label="Decrease children ages 3 to 7"
                                onClick={() => setChildren37(Math.max(0, children37 - 1))}
                                className="h-8 w-8 rounded-full cursor-pointer border-2 border-border hover:border-primary hover:bg-primary/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center tabular-nums text-primary font-bold text-md">{children37}</span>
                            <button
                                type="button"
                                aria-label="Increase children ages 3 to 7"
                                onClick={() => setChildren37(children37 + 1)}
                                className={cn(
                                    "h-8 w-8 rounded-full cursor-pointer border-2 border-border hover:border-primary hover:bg-primary/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center",
                                    hidePlus && "invisible pointer-events-none",
                                )}
                                disabled={hidePlus}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/30 transition-smooth">
                        <div className="flex-1">
                            <div className="font-semibold text-base">Infant</div>
                            <div className="text-sm text-muted-foreground">Ages 0–2</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                aria-label="Decrease infants"
                                onClick={() => setInfants(Math.max(0, infants - 1))}
                                className="h-8 w-8 rounded-full cursor-pointer border-2 border-border hover:border-primary hover:bg-primary/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center tabular-nums text-primary font-bold text-md">{infants}</span>
                            <button
                                type="button"
                                aria-label="Increase infants"
                                onClick={() => setInfants(infants + 1)}
                                className={cn(
                                    "h-8 w-8 rounded-full cursor-pointer border-2 border-border hover:border-primary hover:bg-primary/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center",
                                    hidePlus && "invisible pointer-events-none",
                                )}
                                disabled={hidePlus}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-primary/5 rounded-lg px-5 py-3 border border-primary/20">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Total Travelers</span>
                    </div>
                    <span className="text-md font-bold text-primary">{totalTravellers}</span>
                </div>
            </CardContent>
        </Card>
    )
}
