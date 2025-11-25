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
    selectedDate: Date | null
    setSelectedDate: (date: Date | null) => void
    monthOffset: number
    setMonthOffset: (offset: number) => void
}

export function ScheduleTab({
    tour,
    selectedDate,
    setSelectedDate,
    monthOffset,
    setMonthOffset,
}: ScheduleTabProps) {
    // Define state
    const [blockedDates, setBlockedDates] = useState<Array<any>>([]);

    useEffect(() => {
        async function fetchData() {
            const { data: disabledDates } = await apiRequest<any>("local", "/api/block_days/display", {
                method: "POST"
            });
            setBlockedDates(disabledDates || []);
        }
        fetchData();
    }, []);

    // Helper: parse local date
    function parseLocalDate(dateStr: string) {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

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
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        const startWeekday = firstDay.getDay();
        for (let i = 0; i < startWeekday; i++) {
            days.push(null);
        }
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }
        return days;
    }, [currentMonth]);

    // Helper: get title for blocked date
    const getBlockedTitle = (d: Date): string | null => {
        for (const { title, start_date, end_date } of blockedDates) {
            const start = parseLocalDate(start_date);
            const end = parseLocalDate(end_date);
            if (!start || !end) continue;
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            if (d >= start && d <= end) {
                return title;
            }
        }
        return null;
    };

    // Check if date is disabled
    const isDisabledDate = (d: Date) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const dayKey = d.toDateString();
        const isUnavailable = d < now || !availableDates.has(dayKey);
        const isBlocked = blockedDates.some(({ start_date, end_date }) => {
            const start = parseLocalDate(start_date);
            const end = parseLocalDate(end_date);
            if (!start || !end) return false;
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return d >= start && d <= end;
        });
        return isUnavailable || isBlocked;
    };

    // Convert time in AM and PM
    const convertTimeToAMPM = (time: string) => {
        const [hours, minutes] = time.split(":");
        const hoursInt = parseInt(hours);
        const ampm = hoursInt >= 12 ? "PM" : "AM";
        const formattedHours = hoursInt % 12 || 12;
        return `${formattedHours}:${minutes} ${ampm}`;
    };

    return (
        <Card className="bg-card shadow-soft border-border/50">
            <CardHeader className="space-y-2">
                <h3 className="text-[14px]">Pick an available date. Activity start from {convertTimeToAMPM(tour?.tour_start_time)}.</h3>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full overflow-hidden rounded-xl border border-border/50 shadow-sm">
                        <div className="flex items-center justify-between bg-primary/5 px-4 py-3 border-b border-border/50">
                            <button
                                className="cursor-pointer rounded-lg p-2 text-sm hover:bg-primary/10 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))}
                                aria-label="Previous month"
                                disabled={monthOffset === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <div className="text-[14px] font-bold text-foreground">
                                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                            </div>
                            <button
                                className="cursor-pointer rounded-lg p-2 text-sm hover:bg-primary/10 transition-smooth"
                                onClick={() => setMonthOffset(Math.min(11, monthOffset + 1))}
                                aria-label="Next month"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-px bg-border/30">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                                <div
                                    key={d}
                                    className="bg-muted py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                                >
                                    {d}
                                </div>
                            ))}

                            {daysInMonth.map((d, idx) => {
                                if (!d) return <div key={idx} className="h-12 bg-card" />;
                                const disabled = isDisabledDate(d);
                                const selected = !!selectedDate && d.toDateString() === selectedDate.toDateString();
                                const blockedTitle = getBlockedTitle(d);
                                return (
                                    <button
                                        key={d.toISOString()}
                                        onClick={() => {
                                            if (!disabled) {
                                                setSelectedDate(d);
                                            }
                                        }}
                                        title={disabled && blockedTitle ? blockedTitle : ""}
                                        className={cn(
                                            "cursor-pointer h-12 w-full bg-card text-xs font-medium transition-smooth relative",
                                            "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                            disabled && "cursor-not-allowed text-muted-foreground/30 hover:bg-card",
                                            selected && "bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-sm"
                                        )}
                                        aria-pressed={selected}
                                        disabled={disabled}
                                    >
                                        {d.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
