"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getTourById, type TourSchedule } from "@/lib/tours"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Trash2, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { notFound } from "next/navigation"

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

export default function TourSchedulePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const tour = getTourById(params.id)

  const [schedule, setSchedule] = useState<TourSchedule>({
    availableDays: [1, 2, 3, 4, 5, 6],
    timeSlots: [
      { time: "09:00", capacity: 10 },
      { time: "11:00", capacity: 10 },
      { time: "14:00", capacity: 10 },
      { time: "16:00", capacity: 10 },
    ],
    blockedDates: [],
    advanceBookingDays: 60,
  })

  const [newTimeSlot, setNewTimeSlot] = useState({ time: "", capacity: 10 })
  const [newBlockedDate, setNewBlockedDate] = useState("")

  useEffect(() => {
    async function fetchSchedule() {
      setLoading(true)
      try {
        const res = await fetch(`/api/tours/${params.id}/schedule`)
        const data = await res.json()
        if (data.schedule) {
          setSchedule(data.schedule)
        }
      } catch (error) {
        console.log("[v0] Error fetching schedule:", error)
      }
      setLoading(false)
    }
    fetchSchedule()
  }, [params.id])

  if (!tour) {
    notFound()
  }

  const handleDayToggle = (day: number) => {
    setSchedule((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day].sort(),
    }))
  }

  const handleAddTimeSlot = () => {
    if (!newTimeSlot.time || newTimeSlot.capacity < 1) {
      toast({
        title: "Invalid time slot",
        description: "Please enter a valid time and capacity",
        variant: "destructive",
      })
      return
    }

    // Check for duplicate time
    if (schedule.timeSlots.some((slot) => slot.time === newTimeSlot.time)) {
      toast({
        title: "Duplicate time slot",
        description: "This time slot already exists",
        variant: "destructive",
      })
      return
    }

    setSchedule((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { ...newTimeSlot }].sort((a, b) => a.time.localeCompare(b.time)),
    }))
    setNewTimeSlot({ time: "", capacity: 10 })
  }

  const handleRemoveTimeSlot = (time: string) => {
    setSchedule((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((slot) => slot.time !== time),
    }))
  }

  const handleUpdateTimeSlot = (time: string, capacity: number) => {
    setSchedule((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot) => (slot.time === time ? { ...slot, capacity } : slot)),
    }))
  }

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return

    if (schedule.blockedDates.includes(newBlockedDate)) {
      toast({
        title: "Duplicate date",
        description: "This date is already blocked",
        variant: "destructive",
      })
      return
    }

    setSchedule((prev) => ({
      ...prev,
      blockedDates: [...prev.blockedDates, newBlockedDate].sort(),
    }))
    setNewBlockedDate("")
  }

  const handleRemoveBlockedDate = (date: string) => {
    setSchedule((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter((d) => d !== date),
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      const res = await fetch(`/api/tours/${params.id}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update schedule")
      }

      toast({
        title: "Schedule updated",
        description: "Tour availability has been successfully updated.",
      })
      router.push(`/admin_panel/tours/${params.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update schedule",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin_panel/tours/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Manage Schedule</h1>
          <p className="text-muted-foreground mt-1">{tour.title}</p>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Available Days */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Available Days of Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Select which days of the week this tour is available</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={schedule.availableDays.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                  />
                  <Label htmlFor={`day-${day.value}`} className="cursor-pointer font-normal">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Time Slots & Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure available time slots and maximum capacity for each slot
            </p>

            {/* Existing Time Slots */}
            <div className="space-y-2">
              {schedule.timeSlots.map((slot) => (
                <div key={slot.time} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Time</Label>
                      <p className="font-medium">{slot.time}</p>
                    </div>
                    <div>
                      <Label htmlFor={`capacity-${slot.time}`} className="text-xs text-muted-foreground">
                        Capacity
                      </Label>
                      <Input
                        id={`capacity-${slot.time}`}
                        type="number"
                        min="1"
                        value={slot.capacity}
                        onChange={(e) => handleUpdateTimeSlot(slot.time, Number.parseInt(e.target.value) || 1)}
                        className="h-8"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTimeSlot(slot.time)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add New Time Slot */}
            <div className="pt-4 border-t border-border">
              <Label className="text-sm font-semibold mb-3 block">Add New Time Slot</Label>
              <div className="flex items-end gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="new-time" className="text-xs">
                      Time
                    </Label>
                    <Input
                      id="new-time"
                      type="time"
                      value={newTimeSlot.time}
                      onChange={(e) => setNewTimeSlot({ ...newTimeSlot, time: e.target.value })}
                      placeholder="HH:MM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-capacity" className="text-xs">
                      Capacity
                    </Label>
                    <Input
                      id="new-capacity"
                      type="number"
                      min="1"
                      value={newTimeSlot.capacity}
                      onChange={(e) =>
                        setNewTimeSlot({ ...newTimeSlot, capacity: Number.parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleAddTimeSlot} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blocked Dates */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Blocked Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Block specific dates when the tour is not available</p>

            {/* Existing Blocked Dates */}
            {schedule.blockedDates.length > 0 && (
              <div className="space-y-2">
                {schedule.blockedDates.map((date) => (
                  <div key={date} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBlockedDate(date)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Blocked Date */}
            <div className="pt-4 border-t border-border">
              <Label className="text-sm font-semibold mb-3 block">Add Blocked Date</Label>
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-2">
                  <Input
                    type="date"
                    value={newBlockedDate}
                    onChange={(e) => setNewBlockedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <Button onClick={handleAddBlockedDate} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advance Booking Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Advance Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="advance-days">How many days in advance can customers book?</Label>
              <Input
                id="advance-days"
                type="number"
                min="1"
                max="365"
                value={schedule.advanceBookingDays}
                onChange={(e) =>
                  setSchedule({ ...schedule, advanceBookingDays: Number.parseInt(e.target.value) || 60 })
                }
              />
              <p className="text-xs text-muted-foreground">
                Customers can book up to {schedule.advanceBookingDays} days in advance
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="shadow-soft hover:shadow-soft-lg transition-smooth"
          >
            {submitting ? "Saving..." : "Save Schedule"}
          </Button>
          <Link href={`/admin_panel/tours/${params.id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
