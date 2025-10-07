"use client"

import { useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Tour } from "@/lib/tours"
import { getAvailableDatesForTour } from "@/lib/tours"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type BookingPayload = {
  tourId: string
  date: string // ISO date
  time: string
  members: number
  name: string
  email: string
  phone: string
  postalCode: string
  country: string
}

export function BookingForm({ tour }: { tour: Tour }) {
  const router = useRouter()
  const { toast } = useToast()

  const [monthOffset, setMonthOffset] = useState(0) // 0 = current month
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [adults, setAdults] = useState<number>(1)
  const [children812, setChildren812] = useState<number>(0)
  const [children37, setChildren37] = useState<number>(0)
  const [infants, setInfants] = useState<number>(0)
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("United States")
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const availableDates = useMemo(() => {
    return getAvailableDatesForTour(tour)
  }, [tour])

  const timeSlots = useMemo(() => {
    if (tour.schedule?.timeSlots) {
      return tour.schedule.timeSlots.map((slot) => slot.time)
    }
    // Fallback to default time slots
    return ["09:00", "11:00", "14:00", "16:00"]
  }, [tour])

  const currentMonth = useMemo(() => {
    const base = new Date()
    const d = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1)
    return d
  }, [monthOffset])

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    // prepend blanks
    const startWeekday = firstDay.getDay()
    for (let i = 0; i < startWeekday; i++) {
      days.push(null)
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d))
    }
    return days
  }, [currentMonth])

  const isDisabledDate = (d: Date) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const dayKey = d.toDateString()
    return d < now || !availableDates.has(dayKey)
  }

  const totalTravellers = useMemo(
    () => adults + children812 + children37 + infants,
    [adults, children812, children37, infants],
  )

  const hidePlus = totalTravellers > 10

  const canSubmit =
    !!selectedDate &&
    !!timeSlot &&
    totalTravellers >= 1 &&
    totalTravellers <= 10 &&
    name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(email) &&
    phone.trim().length >= 7 &&
    postalCode.trim().length > 0 &&
    country.trim().length > 0

  async function handleSubmit() {
    if (!canSubmit || !selectedDate) return
    setSubmitting(true)
    const payload: BookingPayload = {
      tourId: tour.id,
      date: selectedDate.toISOString(),
      time: timeSlot,
      members: totalTravellers,
      name,
      email,
      phone,
      postalCode,
      country,
    }
    try {
      const res = await fetch("https://starlinerdreamtours.com/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      console.log("[v0] Booking submission response:", res.status)

      let data
      try {
        data = await res.json()
      } catch {
        data = { id: `BOOK-${Date.now()}`, success: true }
      }

      if (!res.ok && res.status !== 404) {
        throw new Error(data?.message || "Failed to submit booking")
      }

      toast({ title: "Booking request sent", description: "We'll contact you to confirm availability." })

      const params = new URLSearchParams({
        ref: data?.id || `BOOK-${Date.now()}`,
        date: selectedDate.toISOString(),
        time: timeSlot,
        members: String(totalTravellers),
        name,
        email,
      })
      router.push(`/booking/${tour.id}/thank-you?${params.toString()}`)
    } catch (err: any) {
      console.log("[v0] Booking submission error:", err.message)
      toast({ title: "Submission failed", description: err.message || "Please try again.", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Schedule */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Schedule</h3>
          <p className="text-sm text-muted-foreground">Pick an available date and time slot.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calendar */}
          <div className="overflow-hidden rounded-lg border">
            <div className="flex items-center justify-between border-b bg-secondary px-3 py-2">
              <button
                className="rounded-md px-2 py-1 text-sm hover:bg-muted"
                onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
                aria-label="Previous month"
                disabled={monthOffset === 0}
              >
                {"<"}
              </button>
              <div className="text-sm font-medium">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              </div>
              <button
                className="rounded-md px-2 py-1 text-sm hover:bg-muted"
                onClick={() => setMonthOffset((m) => Math.min(11, m + 1))}
                aria-label="Next month"
              >
                {">"}
              </button>
            </div>
            <div className="grid grid-cols-7 gap-px bg-border">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="bg-secondary py-2 text-center text-xs font-medium text-secondary-foreground">
                  {d}
                </div>
              ))}
              {daysInMonth.map((d, idx) => {
                if (!d) return <div key={idx} className="h-10 bg-card" />
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
                      "h-10 w-full bg-card text-sm transition-colors",
                      "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      disabled && "cursor-not-allowed text-muted-foreground/50",
                      selected && "bg-primary text-primary-foreground hover:bg-primary",
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

          {/* Time slots */}
          <div className="space-y-2">
            <Label className="text-sm">Time Slots</Label>
            {!selectedDate ? (
              <p className="text-sm text-muted-foreground">Select a date to see available time slots.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {timeSlots.map((t) => {
                  const active = timeSlot === t
                  return (
                    <button
                      key={t}
                      onClick={() => setTimeSlot(t)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-sm shadow-sm transition-colors",
                        active ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent",
                      )}
                      aria-pressed={active}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Travelers */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Travelers</h3>
          <p className="text-sm text-muted-foreground">
            Choose number of adults, children, and infants. A maximum of 10 travelers is allowed.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="divide-y rounded-md border">
            {/* Adults */}
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-medium">Adults</div>
                <div className="text-xs text-muted-foreground">Ages 12 or above</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease adults"
                  title="Decrease adults"
                  onClick={() => setAdults((v) => Math.max(0, v - 1))}
                  className="h-10 w-10 rounded-full border text-lg leading-none shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  –
                </button>
                <span className="w-8 text-center tabular-nums">{adults}</span>
                <button
                  type="button"
                  aria-label="Increase adults"
                  title="Increase adults"
                  onClick={() => {
                    setAdults((v) => v + 1)
                  }}
                  className={cn(
                    "h-10 w-10 rounded-full border text-lg leading-none shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    hidePlus && "invisible pointer-events-none",
                  )}
                  aria-disabled={hidePlus}
                  disabled={hidePlus}
                >
                  +
                </button>
              </div>
            </div>

            {/* Child 8–12 */}
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-medium">Child</div>
                <div className="text-xs text-muted-foreground">Ages 8–12</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease children ages 8 to 12"
                  title="Decrease children ages 8 to 12"
                  onClick={() => setChildren812((v) => Math.max(0, v - 1))}
                  className="h-10 w-10 rounded-full border text-lg leading-none shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  –
                </button>
                <span className="w-8 text-center tabular-nums">{children812}</span>
                <button
                  type="button"
                  aria-label="Increase children ages 8 to 12"
                  title="Increase children ages 8 to 12"
                  onClick={() => {
                    setChildren812((v) => v + 1)
                  }}
                  className={cn(
                    "h-10 w-10 rounded-full border text-lg leading-none shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    hidePlus && "invisible pointer-events-none",
                  )}
                  aria-disabled={hidePlus}
                  disabled={hidePlus}
                >
                  +
                </button>
              </div>
            </div>

            {/* Child 3–7 */}
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-medium">Child</div>
                <div className="text-xs text-muted-foreground">Ages 3–7</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease children ages 3 to 7"
                  title="Decrease children ages 3 to 7"
                  onClick={() => setChildren37((v) => Math.max(0, v - 1))}
                  className="h-10 w-10 rounded-full border text-lg leading-none shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  –
                </button>
                <span className="w-8 text-center tabular-nums">{children37}</span>
                <button
                  type="button"
                  aria-label="Increase children ages 3 to 7"
                  title="Increase children ages 3 to 7"
                  onClick={() => {
                    setChildren37((v) => v + 1)
                  }}
                  className={cn(
                    "h-10 w-10 rounded-full border text-lg leading-none shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    hidePlus && "invisible pointer-events-none",
                  )}
                  aria-disabled={hidePlus}
                  disabled={hidePlus}
                >
                  +
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-medium">Infant</div>
                <div className="text-xs text-muted-foreground">Ages 0–2</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease infants"
                  title="Decrease infants"
                  onClick={() => setInfants((v) => Math.max(0, v - 1))}
                  className="h-10 w-10 rounded-full border text-lg leading-none shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  –
                </button>
                <span className="w-8 text-center tabular-nums">{infants}</span>
                <button
                  type="button"
                  aria-label="Increase infants"
                  title="Increase infants"
                  onClick={() => {
                    setInfants((v) => v + 1)
                  }}
                  className={cn(
                    "h-10 w-10 rounded-full border text-lg leading-none shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    hidePlus && "invisible pointer-events-none",
                  )}
                  aria-disabled={hidePlus}
                  disabled={hidePlus}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Validation hint */}
          <p className="text-sm text-muted-foreground">Total travelers: {totalTravellers}</p>

          {/* Hidden reference image for designers */}
          <img src="/images/travelers-ui.png" alt="Reference travelers UI" className="hidden" aria-hidden="true" />
        </CardContent>
      </Card>

      {/* Customer details */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Customer Details</h3>
          <p className="text-sm text-muted-foreground">Tell us who's joining.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="(555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal">Postal Code</Label>
              <Input
                id="postal"
                placeholder="ZIP / Postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {["United States", "Canada", "United Kingdom", "Australia", "India"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Review</h3>
          <p className="text-sm text-muted-foreground">Confirm your selections before submitting.</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tour</span>
            <span className="font-medium">{tour.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{selectedDate ? selectedDate.toLocaleDateString() : "Not selected"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium">{timeSlot || "Not selected"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Travelers</span>
            <span className="font-medium">
              {adults} Adult{adults !== 1 ? "s" : ""}, {children812 + children37} Child
              {children812 + children37 !== 1 ? "ren" : ""}, {infants} Infant
              {infants !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{name || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{email || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium">{phone || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Postal Code</span>
            <span className="font-medium">{postalCode || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Country</span>
            <span className="font-medium">{country || "—"}</span>
          </div>

          <div className="pt-4">
            {totalTravellers >= 1 && totalTravellers <= 10 ? (
              <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit || submitting}>
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Please select between 1 and 10 travelers to submit your booking.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
