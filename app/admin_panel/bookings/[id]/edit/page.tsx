"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getBookingById } from "@/lib/bookings"
import { getTours } from "@/lib/tours"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { notFound } from "next/navigation"
import { apiRequest } from "@/lib/api-config"

export default function EditBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const booking = getBookingById(params.id)
  const tours = getTours()
  const [submitting, setSubmitting] = useState(false)

  if (!booking) {
    notFound()
  }

  const [formData, setFormData] = useState({
    tourId: booking.tourId,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    date: booking.date,
    time: booking.time,
    adults: booking.adults,
    children: booking.children,
    infants: booking.infants,
    postalCode: booking.postalCode,
    country: booking.country,
    status: booking.status,
    notes: booking.notes || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const totalMembers = formData.adults + formData.children + formData.infants
    const selectedTour = tours.find((t) => t.id === formData.tourId)
    const totalPrice = selectedTour ? selectedTour.price * totalMembers : 0

    const payload = {
      ...formData,
      tourTitle: selectedTour?.title || "",
      totalMembers,
      totalPrice,
    }

    const { data, error } = await apiRequest(`/api/bookings/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })

    setSubmitting(false)

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Booking updated",
      description: "The booking has been successfully updated.",
    })
    router.push(`/admin_panel/bookings/${params.id}`)
  }

  const totalMembers = formData.adults + formData.children + formData.infants
  const selectedTour = tours.find((t) => t.id === formData.tourId)
  const totalPrice = selectedTour ? selectedTour.price * totalMembers : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin_panel/bookings/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Edit Booking</h1>
          <p className="text-muted-foreground mt-1">Booking ID: {params.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tour Selection */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Tour Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tour">Select Tour *</Label>
              <Select value={formData.tourId} onValueChange={(value) => setFormData({ ...formData, tourId: value })}>
                <SelectTrigger id="tour">
                  <SelectValue placeholder="Choose a tour" />
                </SelectTrigger>
                <SelectContent>
                  {tours.map((tour) => (
                    <SelectItem key={tour.id} value={tour.id}>
                      {tour.title} - ${tour.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {["09:00", "11:00", "14:00", "16:00"].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal">Postal Code *</Label>
                <Input
                  id="postal"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger id="country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["United States", "Canada", "United Kingdom", "Australia", "India"].map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Travelers */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Travelers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="adults">Adults (12+)</Label>
                <Input
                  id="adults"
                  type="number"
                  min="0"
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="children">Children (3-11)</Label>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="infants">Infants (0-2)</Label>
                <Input
                  id="infants"
                  type="number"
                  min="0"
                  value={formData.infants}
                  onChange={(e) => setFormData({ ...formData, infants: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total travelers: {totalMembers}</p>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any special notes or requirements..."
                rows={4}
              />
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">Total Price:</span>
                <span className="text-2xl font-bold text-primary">${totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={submitting} className="shadow-soft hover:shadow-soft-lg transition-smooth">
            {submitting ? "Updating..." : "Update Booking"}
          </Button>
          <Link href={`/admin_panel/bookings/${params.id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
