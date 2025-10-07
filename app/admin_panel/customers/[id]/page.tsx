"use client"

import { BookingStatus, getBookings } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign, CalendarClockIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { apiRequest } from "@/lib/api-config"

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    // Define state
    const [loading, setLoading] = useState(true);
    const [customerData, setCustomerData] = useState<any>([]);

    // Init customer data
    useEffect(() => {
        async function fetchCustomer() {
            setLoading(true);
            const { data } = await apiRequest<any>("local", "/api/customers/single", {
                method: "POST",
                body: JSON.stringify({ id: params.id })
            });
            if (data) setCustomerData(data);
            setLoading(false);
        }
        fetchCustomer();
    }, []);

    // Fetch customer data
    if (!customerData) {
        notFound()
    }

    // Define status color
    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-500/10 border-1 border-green-500 text-green-700 dark:text-green-400";
            case "PENDING":
                return "bg-yellow-500/10 border-1 border-yellow-500 text-yellow-700 dark:text-yellow-400";
            case "CANCELLED":
                return "bg-red-500/10 text-red-700 border-1 border-red-500 dark:text-red-400";
            case "ON HOLD":
                return "bg-black-500/10 text-black-700 border-1 border-black-500 dark:text-black-400";
            case "COMPLETED":
                return "bg-blue-500/10 text-blue-700 border-1 border-blue-500 dark:text-blue-400";
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading selected customer...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin_panel/customers">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">{customerData.name}</h1>
                    <p className="text-muted-foreground mt-1">Customer ID: {customerData.id}</p>
                </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card className="shadow-soft">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Contact Information</CardTitle>
                                <Badge
                                    className={cn(
                                        "capitalize",
                                        customerData.status === "active"
                                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                            : "bg-gray-500/10 text-gray-700 dark:text-gray-400",
                                    )}
                                >
                                    {customerData.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary" />
                                <a href={`mailto:${customerData.email}`} className="text-foreground hover:text-primary transition-smooth">
                                    {customerData.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary" />
                                <a href={`tel:${customerData.phone}`} className="text-foreground hover:text-primary transition-smooth">
                                    {customerData.phone}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span className="text-foreground">
                                    {customerData.location}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking History */}
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Booking History ({customerData?.booking_list.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {customerData?.booking_list && customerData?.booking_list.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {customerData?.booking_list.map((booking: any) => (
                                        <div className="flex items-start justify-between rounded-lg border border-border p-4 hover:bg-gray-100 transition-smooth">
                                            <div>
                                                <h4 className="font-semibold text-foreground">{booking.tour_name}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {new Date(booking.travel_date).toLocaleDateString()} at {booking.travel_time}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{booking.total_travelers} travelers</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-foreground">${booking.total_price}</p>
                                                <Badge className={cn("mt-1 capitalize", getStatusColor(booking.status))}>{booking.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Total Bookings</span>
                                </div>
                                <span className="text-lg font-bold text-foreground">{customerData?.booking_list.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Total Spent</span>
                                </div>
                                <span className="text-lg font-bold text-green-600">${customerData?.total_spent || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CalendarClockIcon className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Avg per Booking</span>
                                </div>
                                <span className="text-lg font-bold text-foreground">
                                    ${customerData?.average_per_booking || 0}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Customer Since</span>
                                <span className="font-medium text-foreground">{new Date(customerData?.create_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Last Booking</span>
                                <span className="font-medium text-foreground">
                                    {new Date(customerData?.last_booking_date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Customer ID</span>
                                <span className="font-mono font-medium text-foreground">{customerData?.id}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
