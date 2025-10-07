"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiRequest } from "@/lib/api-config"
import type { Tour } from "@/lib/tours"
import type { Booking } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, Clock, DollarSign } from "lucide-react"
import Image from "next/image"

export default function ToursPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [tours, setTours] = useState<Tour[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [toursRes, bookingsRes] = await Promise.all([
                apiRequest<Tour[]>("local", "/api/tours"),
                apiRequest<Booking[]>("local", "/api/bookings"),
            ]);

            if (toursRes.data) setTours(toursRes?.data);
            if (bookingsRes.data) setBookings(bookingsRes.data);
            setLoading(false);
        }
        fetchData();
    }, []);

    // Calculate stats for each tour
    const tourStats = tours && tours.length > 0 && tours.map((tour) => {
        const tourBookings = bookings && bookings.length > 0 && bookings.filter((b) => b.tourId === tour.id) || [];
        return {
            ...tour,
            totalBookings: tourBookings.length,
            totalRevenue: tourBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        }
    }) || [];

    // Filter tours
    const filteredTours = tourStats && tourStats.length > 0 && tourStats.filter(
        (tour) =>
            tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.id.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

    // Calculate stats
    const stats = {
        total: tours.length,
        totalBookings: bookings.length || 0,
        totalRevenue: bookings && bookings.length > 0 && bookings.reduce((sum, b) => sum + b.totalPrice, 0),
        avgPrice: tours.length > 0 ? Math.round(tours.reduce((sum, t) => Number(sum) + Number(t.price), 0) / tours.length) : 0,
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading tours...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Tours & Activities</h1>
                    <p className="text-muted-foreground mt-1">Manage your tour offerings</p>
                </div>
                <Link href="/admin_panel/tours/create">
                    <Button className="shadow-soft hover:shadow-soft-lg transition-smooth cursor-pointer">
                        <Plus className="h-4 w-4" /> Add Tour
                    </Button>
                </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Tours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.total || 0}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.totalBookings || 0}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${stats.totalRevenue || 0}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">${stats.avgPrice || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card className="shadow-soft">
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tours by name, description, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Tours Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTours.length === 0 ? (
                    <Card className="shadow-soft md:col-span-2 lg:col-span-3">
                        <CardContent className="py-12 text-center text-muted-foreground">No tours found</CardContent>
                    </Card>
                ) : (
                    filteredTours.map((tour) => (
                        <Card key={tour?.id} className="shadow-soft hover:shadow-soft-lg pt-0 transition-smooth overflow-hidden">
                            <div className="relative h-55 w-full bg-muted">
                                <Image
                                    src={tour?.image}
                                    alt={tour?.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-lg">{tour?.title}</CardTitle>
                                    <Badge className="bg-primary/10 text-primary shrink-0">${tour?.price}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{tour?.short_description}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{tour?.duration_hours} Hours</span>
                                    </div>
                                    {tour.totalBookings > 0 && <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="h-4 w-4" />
                                        <span>{tour?.totalBookings} bookings</span>
                                    </div>}
                                </div>
                                {tour.totalRevenue > 0 && <div className="rounded-lg bg-muted p-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Total Revenue</span>
                                        <span className="font-semibold text-foreground">${tour.totalRevenue}</span>
                                    </div>
                                </div>}
                                <div className="grid grid-cols-3 gap-2">
                                    <Link href={`/admin_panel/tours/${tour.id}`}>
                                        <Button variant="outline" size="sm" className="w-full cursor-pointer bg-transparent">
                                            <Eye className="mr-1 h-4 w-4" /> View
                                        </Button>
                                    </Link>
                                    <Link href={`/admin_panel/tours/${tour.id}/edit`}>
                                        <Button variant="outline" size="sm" className="w-full cursor-pointer bg-transparent">
                                            <Edit className="mr-1 h-4 w-4" /> Update
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="sm" className="text-destructive cursor-pointer bg-transparent">
                                        <Trash2 className="mr-1 h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
