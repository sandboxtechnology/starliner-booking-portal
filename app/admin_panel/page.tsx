"use client"

import { useEffect, useState } from "react";
import { Calendar, Users, MapPin, DollarSign, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiRequest } from "@/lib/api-config"
import Link from "next/link"
import { Badge } from "@/components/ui/badge";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function AdminDashboard() {
    // Define state
    const [dashboardData, setDashboardData] = useState<any>([]);
    const [bookingData, setBookingData] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // Fetch data
            const { data: dashboardRes } = await apiRequest<any>("local", "/api/dashboard", {
                method: "POST"
            });

            // Fetch data
            const { data: bookingRes } = await apiRequest<any>("local", "/api/bookings/list", {
                method: "POST"
            });

            // Update state
            if (dashboardRes) setDashboardData(dashboardRes || []);
            if (bookingRes) setBookingData(bookingRes.slice(0, 5) || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your booking platform.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-soft hover:shadow-soft-lg transition-smooth">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                        <DollarSign className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardData?.count?.revenue ?? 0}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-soft hover:shadow-soft-lg transition-smooth">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                        <Calendar className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardData?.count?.booking ?? 0}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-soft hover:shadow-soft-lg transition-smooth">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
                        <Users className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardData?.count?.customer ?? 0}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-soft hover:shadow-soft-lg transition-smooth">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Tours</CardTitle>
                        <MapPin className="h-5 w-5 text-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardData?.count?.activity ?? 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-base">Booking Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Confirmed</span>
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">{dashboardData?.booking_status?.confirmed ?? 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Pending</span>
                            <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">{dashboardData?.booking_status?.pending ?? 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total</span>
                            <Badge className="bg-primary/10 text-primary">{dashboardData?.booking_status?.total ?? 0}</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/admin_panel/bookings" className="block">
                            <button className="w-full text-left text-sm text-foreground hover:text-primary transition-smooth py-1">
                                All bookings
                            </button>
                        </Link>
                        <Link href="/admin_panel/customers" className="block">
                            <button className="w-full text-left text-sm text-foreground hover:text-primary transition-smooth py-1">
                                All Customers
                            </button>
                        </Link>
                        <Link href="/admin_panel/block_days" className="block">
                            <button className="w-full text-left text-sm text-foreground hover:text-primary transition-smooth py-1">
                                All Block Days
                            </button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-6 lg:grid-cols-1">
                <Card className="shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Bookings</CardTitle>
                        <Link href="/admin_panel/bookings" className="text-sm text-primary hover:underline">
                            View all
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {bookingData.map((booking: any) => (
                                <div className="grid grid-cols-2 bg-gray-50 p-4 border border-gray-200 rounded-md">
                                    <div>
                                        <p data-tooltip-id="tooltip-booking-activity" data-tooltip-content={booking.tour_name} className="font-medium text-foreground">
                                            {booking.tour_name.slice(0, 60) + (booking.tour_name.length > 60 ? "..." : "")}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.customer_name} • {booking.total_travelers} travelers
                                        </p>
                                        <Tooltip id="tooltip-booking-activity" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-foreground">${booking.total_price}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(booking.travel_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
