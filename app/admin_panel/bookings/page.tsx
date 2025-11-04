"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiRequest } from "@/lib/api-config"
import type { Booking, BookingStatus } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, Loader } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils"
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function BookingsPage() {
    // Define state
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [viewBooking, setViewBooking] = useState<any>("");
    const [deleteBookingId, setDeleteBookingId] = useState("");
    const [modelFormLoading, setModelFormLoading] = useState(false);

    // Init bookings
    useEffect(() => {
        async function fetchBookings() {
            setLoading(true);
            const { data } = await apiRequest<any>("local", "/api/bookings/list", {
                method: "POST"
            });
            if (data) setBookings(data);
            setLoading(false);
        }
        fetchBookings();
    }, []);

    // Filter bookings
    const filteredBookings = bookings && bookings.length > 0 && bookings.filter((booking: any) => {
        const matchesSearch = booking?.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking?.booking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking?.tour_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking?.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking?.travel_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking?.travel_time.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || booking?.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

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

    // Handle delete booking
    const handleDeleteBooking = async () => {
        setModelFormLoading(true);
        const { data } = await apiRequest<any>("local", "/api/bookings/delete", {
            method: "POST",
            body: JSON.stringify({ id: deleteBookingId })
        });
        if (data?.success) {
            const updatedBookings = bookings.filter((booking: any) => booking?.booking_id !== deleteBookingId);
            setBookings(updatedBookings);
            setDeleteBookingId("");
        }
        setModelFormLoading(false);
    }

    // Display format time (e.g. 01:00 PM)
    const formatTime = (time: string): string => {
        // Normalize whitespace and case
        time = time.trim().toUpperCase();

        let hours: number;
        let minutes: string;

        // Case 1: Contains AM/PM
        if (time.includes("AM") || time.includes("PM")) {
            // Extract parts
            const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
            if (!match) return ""; // invalid format

            hours = parseInt(match[1]);
            minutes = match[2];
            const ampm = match[3].toUpperCase();

            // Reformat with leading zeros
            return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
        }

        // Case 2: 24-hour format (e.g. 13:00)
        const [h, m] = time.split(":");
        hours = parseInt(h);
        minutes = m || "00";

        let ampm = "AM";
        if (hours >= 12) {
            ampm = "PM";
            if (hours > 12) hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }

        return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading bookings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Bookings</h1>
                    <p className="text-muted-foreground mt-1">Manage all tour bookings</p>
                </div>
                <Button className="hidden shadow-soft hover:shadow-soft-lg transition-smooth cursor-pointer">
                    <Plus className="h-4 w-4" /> Create Booking
                </Button>
            </div>
            <Card className="shadow-soft">
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search booking by ID, customer name, or date"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex gap-2">
                            {(["all", "pending", "confirmed", "cancelled", "on hold", "completed"] as const).map((status: any) => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter(status)}
                                    className="capitalize cursor-pointer"
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-soft">
                <CardHeader>
                    <CardTitle>All Bookings ({filteredBookings && filteredBookings.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                                    <th className="pb-3 pr-4">Booking ID</th>
                                    <th className="pb-3 pr-4">Customer</th>
                                    <th className="pb-3 pr-4">Activity</th>
                                    <th className="pb-3 pr-4">Date</th>
                                    <th className="pb-3 pr-4">Time</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3 pr-4">Amount</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings && filteredBookings.length === 0 && <tr>
                                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                                        No bookings found
                                    </td>
                                </tr>}

                                {filteredBookings && filteredBookings.length > 0 && filteredBookings.map((booking: any) => (
                                    <tr
                                        key={booking.booking_id}
                                        className="hover:bg-gray-100 transition-smooth"
                                    >
                                        <td>
                                            <span className="font-mono text-sm">{booking.booking_id}</span>
                                        </td>
                                        <td>
                                            <div>
                                                <Link href={`/admin_panel/customers/${booking.customer_id}`} className="text-foreground hover:underline hover:text-primary text-sm">{booking.customer_name}</Link>
                                            </div>
                                        </td>
                                        <td>
                                            <p data-tooltip-id="tooltip-tbl-activity" data-tooltip-content={booking.tour_name} className="text-foreground text-sm">{booking.tour_name.slice(0, 20) + (booking.tour_name.length > 20 ? "..." : "")}</p>
                                            <Tooltip id="tooltip-tbl-activity" />
                                        </td>
                                        <td>
                                            <p className="text-foreground text-sm">{new Date(booking.travel_date).toLocaleDateString()}</p>
                                        </td>
                                        <td>
                                            <p className="text-sm">{formatTime(booking.travel_time)}</p>
                                        </td>
                                        <td>
                                            <Badge className={cn("capitalize", getStatusColor(booking.status))}>{booking.status}</Badge>
                                        </td>
                                        <td>
                                            <span className="font-semibold text-sm text-foreground">${booking.total_price}</span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer" onClick={() => setViewBooking(booking)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setDeleteBookingId(booking.booking_id)}
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-destructive cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* View booking */}
            {viewBooking && <Dialog open={viewBooking !== ""} onOpenChange={() => setViewBooking("")}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>View Booking ID: {viewBooking?.booking_id}</DialogTitle>
                    </DialogHeader>
                    {/* Display in table format */}
                    <div className="text-sm">
                        <table>
                            <tbody>
                                <tr>
                                    <td className="py-2 pr-4">Travel Date:</td>
                                    <td className="py-2 pr-4">{new Date(viewBooking?.travel_date).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Travel Time:</td>
                                    <td className="py-2 pr-4">{viewBooking?.travel_time}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Adults:</td>
                                    <td className="py-2 pr-4">{viewBooking?.adults}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Child (8-12):</td>
                                    <td className="py-2 pr-4">{viewBooking?.children812}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Child (3-7):</td>
                                    <td className="py-2 pr-4">{viewBooking?.children37}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Infants:</td>
                                    <td className="py-2 pr-4">{viewBooking?.infants}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Total Travelers:</td>
                                    <td className="py-2 pr-4">{viewBooking?.total_travelers}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Payment Method:</td>
                                    <td className="py-2 pr-4">{viewBooking?.payment_method}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>}

            {/* Delete booking */}
            {deleteBookingId && <Dialog open={deleteBookingId !== ""} onOpenChange={() => setDeleteBookingId("")}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Booking ID: {deleteBookingId}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <p>Are you sure you want to delete this booking? This action cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline_danger" className="cursor-pointer" disabled={modelFormLoading} onClick={handleDeleteBooking}>
                            {modelFormLoading && <Loader className="h-4 w-4 animate-spin" />}
                            {!modelFormLoading && <Trash2 className="h-4 w-4" />}
                            Yes! Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>}
        </div>
    )
}
