import { getTourById } from "@/lib/tours"
import { getBookings } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Clock, DollarSign, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"

export default function TourDetailPage({ params }: { params: { id: string } }) {
  const tour = getTourById(params.id)

  if (!tour) {
    notFound()
  }

  const allBookings = getBookings()
  const tourBookings = allBookings.filter((b) => b.tourId === tour.id)
  const totalRevenue = tourBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const totalTravelers = tourBookings.reduce((sum, b) => sum + b.totalMembers, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin_panel/tours">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{tour.title}</h1>
            <p className="text-muted-foreground mt-1">Tour ID: {tour.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin_panel/tours/${tour.id}/schedule`}>
            <Button variant="outline" className="shadow-soft hover:shadow-soft-lg transition-smooth bg-transparent">
              Manage Schedule
            </Button>
          </Link>
          <Link href={`/admin_panel/tours/${tour.id}/edit`}>
            <Button className="shadow-soft hover:shadow-soft-lg transition-smooth">
              <Edit className="mr-2 h-4 w-4" />
              Edit Tour
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tour Image */}
          <Card className="shadow-soft overflow-hidden">
            <div className="relative h-96 w-full bg-muted">
              <Image
                src={tour.image || "/placeholder.svg"}
                alt={tour.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          </Card>

          {/* Tour Information */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Tour Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Short Description</h3>
                <p className="text-foreground">{tour.shortDescription}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Details</h3>
                <p className="text-foreground leading-relaxed">{tour.details}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price per Person</p>
                    <p className="text-lg font-bold text-foreground">${tour.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-lg font-bold text-foreground">{tour.durationHours} hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Recent Bookings ({tourBookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {tourBookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {tourBookings.slice(0, 5).map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/admin_panel/bookings/${booking.id}`}
                      className="block rounded-lg border border-border p-3 hover:bg-accent/50 transition-smooth"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString()} • {booking.totalMembers} travelers
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">${booking.totalPrice}</p>
                          <Badge className="mt-1 capitalize bg-green-500/10 text-green-700 dark:text-green-400">
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Bookings</span>
                </div>
                <span className="text-lg font-bold text-foreground">{tourBookings.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Travelers</span>
                </div>
                <span className="text-lg font-bold text-foreground">{totalTravelers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                </div>
                <span className="text-lg font-bold text-primary">${totalRevenue}</span>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg per Booking</span>
                  <span className="text-lg font-bold text-foreground">
                    ${tourBookings.length > 0 ? Math.round(totalRevenue / tourBookings.length) : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/admin_panel/tours/${tour.id}/schedule`}>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Manage Schedule
                </Button>
              </Link>
              <Link href={`/booking/${tour.id}`} target="_blank">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  View on Site
                </Button>
              </Link>
              <Link href={`/admin_panel/bookings/create?tourId=${tour.id}`}>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Create Booking
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
              >
                Delete Tour
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
