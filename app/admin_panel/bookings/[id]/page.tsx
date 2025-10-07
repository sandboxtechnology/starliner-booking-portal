import { getBookingById } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Clock, Users } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const booking = getBookingById(params.id)

  if (!booking) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "completed":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin_panel/bookings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Booking Details</h1>
            <p className="text-muted-foreground mt-1">Booking ID: {booking.id}</p>
          </div>
        </div>
        <Link href={`/admin_panel/bookings/${booking.id}/edit`}>
          <Button className="shadow-soft hover:shadow-soft-lg transition-smooth">
            <Edit className="mr-2 h-4 w-4" />
            Edit Booking
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tour Information */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Tour Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{booking.tourTitle}</h3>
                <Badge className={cn("mt-2 capitalize", getStatusColor(booking.status))}>{booking.status}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-foreground">{booking.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Travelers</p>
                    <p className="font-medium text-foreground">
                      {booking.adults} Adults, {booking.children} Children, {booking.infants} Infants
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">
                      {booking.postalCode}, {booking.country}
                    </p>
                  </div>
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
              <div>
                <h3 className="text-xl font-bold text-foreground">{booking.customerName}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a
                    href={`mailto:${booking.customerEmail}`}
                    className="text-foreground hover:text-primary transition-smooth"
                  >
                    {booking.customerEmail}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <a
                    href={`tel:${booking.customerPhone}`}
                    className="text-foreground hover:text-primary transition-smooth"
                  >
                    {booking.customerPhone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {booking.notes && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{booking.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Members</span>
                  <span className="font-medium text-foreground">{booking.totalMembers}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price per Person</span>
                  <span className="font-medium text-foreground">
                    ${(booking.totalPrice / booking.totalMembers).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">${booking.totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium text-foreground">{new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-medium text-foreground">{booking.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tour ID</span>
                <span className="font-mono font-medium text-foreground">{booking.tourId}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
