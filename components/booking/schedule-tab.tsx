"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Tour } from "@/lib/tours"
import { getAvailableDatesForTour } from "@/lib/tours"
import { apiRequest } from "@/lib/api-config"

type ScheduleTabProps = {
    tour: Tour,
    timeSlotList: string[]
    selectedDate: Date | null
    setSelectedDate: (date: Date | null) => void
    timeSlot: string
    setTimeSlot: (time: string) => void
    monthOffset: number
    setMonthOffset: (offset: number) => void
}

export function ScheduleTab({
    tour,
    timeSlotList,
    selectedDate,
    setSelectedDate,
    timeSlot,
    setTimeSlot,
    monthOffset,
    setMonthOffset,
}: ScheduleTabProps) {
    // Define state
    const [blockedDates, setBlockedDates] = useState<Array<any>>([]);

    // Init single tour
    useEffect(() => {
        async function fetchData() {
            // Fetch disabled dates
            const { data: disabledDates } = await apiRequest<any>("local", "/api/block_days/display", {
                method: "POST"
            });
            setBlockedDates(disabledDates || []);
        }
        fetchData();
    }, []);

    // Generate available dates
    const availableDates = useMemo(() => {
        return getAvailableDatesForTour(tour)
    }, [tour])

    // Generate current month
    const currentMonth = useMemo(() => {
        const base = new Date()
        const d = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1)
        return d
    }, [monthOffset])

    // Generate days in month
    const daysInMonth = useMemo(() => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const days = [];
        const startWeekday = firstDay.getDay()
        for (let i = 0; i < startWeekday; i++) {
            days.push(null)
        }
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d))
        }
        return days
    }, [currentMonth])

    // Check if date is disabled
    const isDisabledDate = (d: Date) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const dayKey = d.toDateString();

        // Condition 1: Past dates or unavailable dates
        const isUnavailable = d < now || !availableDates.has(dayKey);

        // Condition 2: Blocked date ranges
        const isBlocked = blockedDates.some(({ start_date, end_date }) => {
            const start = new Date(start_date);
            const end = new Date(end_date);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return d >= start && d <= end;
        });

        // Return true if either condition is met
        return isUnavailable || isBlocked;
    };


    return (
        <Card className="bg-card shadow-soft border-border/50">
            <CardHeader className="space-y-2">
                <h3 className="text-xl font-bold">Schedule Your Tour</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Pick an available date and time slot for your experience.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="overflow-hidden rounded-xl border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between bg-primary/5 px-4 py-3 border-b border-border/50">
                        <button
                            className="rounded-lg p-2 text-sm hover:bg-primary/10 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))}
                            aria-label="Previous month"
                            disabled={monthOffset === 0}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="text-base font-bold text-foreground">
                            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                        </div>
                        <button
                            className="rounded-lg p-2 text-sm hover:bg-primary/10 transition-smooth"
                            onClick={() => setMonthOffset(Math.min(11, monthOffset + 1))}
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-border/30">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div
                                key={d}
                                className="bg-muted py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wide"
                            >
                                {d}
                            </div>
                        ))}
                        {daysInMonth.map((d, idx) => {
                            if (!d) return <div key={idx} className="h-12 bg-card" />
                            const disabled = isDisabledDate(d)
                            const selected = !!selectedDate && d.toDateString() === selectedDate.toDateString()
                            return (
                                <button
                                    key={d.toISOString()}
                                    onClick={() => {
                                        if (!disabled) {
                                            setSelectedDate(d)
                                            setTimeSlot("")
                                        }
                                    }}
                                    className={cn(
                                        "cursor-pointer h-12 w-full bg-card text-sm font-medium transition-smooth",
                                        "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                        disabled && "cursor-not-allowed text-muted-foreground/30 hover:bg-card",
                                        selected && "bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-sm",
                                    )}
                                    aria-pressed={selected}
                                    disabled={disabled}
                                >
                                    {d.getDate()}
                                </button>
                            )
                        })}
                    </div>
                </div>
                {timeSlotList && timeSlotList.length > 0 && <div className="space-y-3">
                    <Label className="text-base font-semibold">Available Time Slots</Label>
                    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-${timeSlotList.length}`}>
                        {timeSlotList.map((t) => {
                            const active = timeSlot === t;
                            return (
                                <button
                                    key={t}
                                    onClick={() => setTimeSlot(t)}
                                    className={cn(
                                        "cursor-pointer rounded-lg border-2 px-4 py-3 text-sm font-semibold shadow-sm transition-smooth",
                                        active
                                            ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                            : "bg-card border-border/50 hover:border-primary/50 hover:bg-primary/5",
                                    )}
                                    aria-pressed={active}
                                >
                                    {t}
                                </button>
                            )
                        })}
                    </div>
                </div>}
            </CardContent>
        </Card>
    )
}
