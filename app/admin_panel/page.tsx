"use client"

import { useEffect, useState } from "react"
import { Calendar, Users, MapPin, DollarSign, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiRequest } from "@/lib/api-config"
import type { Booking } from "@/lib/bookings"
import type { Customer } from "@/lib/customers"
import type { Tour } from "@/lib/tours"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
    // Define state
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // Fetch data
            const [bookingsRes, customersRes, toursRes] = await Promise.all([
                apiRequest<Booking[]>("local", "/api/bookings"),
                apiRequest<Customer[]>("local", "/api/customers"),
                apiRequest<Tour[]>("local", "/api/tours"),
            ]);

            // Update state
            if (bookingsRes?.data) setBookings(bookingsRes.data || []);
            if (customersRes?.data) setCustomers(customersRes.data || []);
            if (toursRes?.data) setTours(toursRes.data || []);
            setLoading(false);
        }
        fetchData();
    }, [])

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

    // Calculate stats
    const totalRevenue = bookings && bookings.length > 0 && bookings.reduce((sum, b) => sum + b.totalPrice, 0) || 0;
    const confirmedBookings = bookings && bookings.length > 0 && bookings.filter((b) => b.status === "confirmed").length || 0;
    const pendingBookings = bookings && bookings.length > 0 && bookings.filter((b) => b.status === "pending").length || 0;
    const activeCustomers = customers && customers.length > 0 && customers.filter((c) => c.status === "active").length || 0;

    // Calculate tour performance
    const tourPerformance = tours && tours.length > 0 && tours.map((tour) => {
        const tourBookings = bookings && bookings.length > 0 && bookings.filter((b) => b.tourId === tour.id) || [];
        return {
            ...tour,
            bookings: tourBookings.length,
            revenue: tourBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        }
    })
    const topTours = tourPerformance && tourPerformance.length > 0 && tourPerformance.sort((a, b) => b.revenue - a.revenue).slice(0, 5)

    // Recent bookings
    const recentBookings = bookings && bookings.length > 0 && [...bookings]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5) || [];

    // Top customers
    const topCustomers = customers && customers.length > 0 && [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5) || [];

    // Mock growth data (in real app, compare with previous period)
    const stats = [
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            change: "+18.2%",
            trend: "up" as const,
            icon: DollarSign,
            color: "text-green-600",
        },
        {
            title: "Total Bookings",
            value: bookings.length ? bookings.length.toString() : "0",
            change: "+12.5%",
            trend: "up" as const,
            icon: Calendar,
            color: "text-primary",
        },
        {
            title: "Active Customers",
            value: activeCustomers.toString(),
            change: "+8.3%",
            trend: "up" as const,
            icon: Users,
            color: "text-blue-600",
        },
        {
            title: "Active Tours",
            value: tours.length ? tours.length.toString() : "0",
            change: "0%",
            trend: "neutral" as const,
            icon: MapPin,
            color: "text-foreground",
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your booking platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="shadow-soft hover:shadow-soft-lg transition-smooth">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {stat.trend === "up" && <ArrowUp className="h-3 w-3 text-green-600" />}
                                {stat.trend !== "up" && <ArrowDown className="h-3 w-3 text-red-600" />}
                                <p
                                    className={`text-xs ${stat.trend === "up" ? "text-green-600" : stat.trend !== "up" ? "text-red-600" : "text-muted-foreground"}`}
                                >
                                    {stat.change} from last month
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-base">Booking Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Confirmed</span>
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">{confirmedBookings}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Pending</span>
                            <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">{pendingBookings}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total</span>
                            <Badge className="bg-primary/10 text-primary">{bookings.length}</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-base">Average Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Booking Value</span>
                            <span className="font-semibold text-foreground">
                                ${bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Customer Spend</span>
                            <span className="font-semibold text-foreground">
                                ${customers.length > 0 ? Math.round(totalRevenue / customers.length) : 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Tour Revenue</span>
                            <span className="font-semibold text-foreground">
                                ${tours.length > 0 ? Math.round(totalRevenue / tours.length) : 0}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/admin_panel/bookings/create" className="block">
                            <button className="w-full text-left text-sm text-foreground hover:text-primary transition-smooth py-1">
                                Create New Booking
                            </button>
                        </Link>
                        <Link href="/admin_panel/customers/create" className="block">
                            <button className="w-full text-left text-sm text-foreground hover:text-primary transition-smooth py-1">
                                Add New Customer
                            </button>
                        </Link>
                        <Link href="/admin_panel/tours/create" className="block">
                            <button className="w-full text-left text-sm text-foreground hover:text-primary transition-smooth py-1">
                                Create New Tour
                            </button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Bookings */}
                <Card className="shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Bookings</CardTitle>
                        <Link href="/admin_panel/bookings" className="text-sm text-primary hover:underline">
                            View all
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentBookings.map((booking) => (
                                <Link
                                    key={booking.id}
                                    href={`/admin_panel/bookings/${booking.id}`}
                                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0 hover:opacity-80 transition-smooth"
                                >
                                    <div>
                                        <p className="font-medium text-foreground">{booking.tourTitle}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.customerName} • {booking.totalMembers} travelers
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-foreground">${booking.totalPrice}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(booking.date).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Tours */}
                <Card className="shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Top Performing Tours</CardTitle>
                        <Link href="/admin_panel/tours" className="text-sm text-primary hover:underline">
                            View all
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topTours && topTours.map((tour, index) => (
                                <Link
                                    key={tour.id}
                                    href={`/admin_panel/tours/${tour.id}`}
                                    className="flex items-center justify-between hover:opacity-80 transition-smooth"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{tour.title}</p>
                                            <p className="text-sm text-muted-foreground">{tour.bookings} bookings</p>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-primary">${tour.revenue}</span>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Customers */}
                <Card className="shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Top Customers</CardTitle>
                        <Link href="/admin_panel/customers" className="text-sm text-primary hover:underline">
                            View all
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topCustomers.map((customer) => (
                                <Link
                                    key={customer.id}
                                    href={`/admin_panel/customers/${customer.id}`}
                                    className="flex items-center justify-between hover:opacity-80 transition-smooth"
                                >
                                    <div>
                                        <p className="font-medium text-foreground">{customer.name}</p>
                                        <p className="text-sm text-muted-foreground">{customer.totalBookings} bookings</p>
                                    </div>
                                    <span className="font-semibold text-primary">${customer.totalSpent}</span>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Breakdown */}
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle>Revenue by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {["confirmed", "pending", "completed", "cancelled"].map((status) => {
                                const statusBookings = bookings && bookings.length > 0 && bookings.filter((b) => b.status === status) || [];
                                const statusRevenue = statusBookings && statusBookings.length > 0 && statusBookings.reduce((sum, b) => sum + b.totalPrice, 0) || 0;
                                const percentage = totalRevenue > 0 ? ((statusRevenue / totalRevenue) * 100).toFixed(1) : "0";

                                return (
                                    <div key={status}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-foreground capitalize">{status}</span>
                                            <span className="text-sm font-semibold text-foreground">${statusRevenue}</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${status === "confirmed"
                                                        ? "bg-green-500"
                                                        : status === "pending"
                                                            ? "bg-yellow-500"
                                                            : status === "completed"
                                                                ? "bg-blue-500"
                                                                : "bg-red-500"
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {percentage}% • {statusBookings.length} bookings
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
