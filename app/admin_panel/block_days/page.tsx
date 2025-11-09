"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiRequest } from "@/lib/api-config"
import type { Booking, BookingStatus } from "@/lib/bookings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, Loader, X, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils"

export default function BlockDaysPage() {
    // Define state
    const [loading, setLoading] = useState(true);
    const [refreshContent, setRefreshContent] = useState(false);
    const [daysList, setDaysList] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [newFormData, setNewFormData] = useState<any>([]);
    const [openAddDay, setOpenAddDay] = useState(false);
    const [deleteBlockId, setDeleteBlockId] = useState("");
    const [modelFormLoading, setModelFormLoading] = useState(false);

    // Init bookings
    useEffect(() => {
        async function fetchBlockDays() {
            setLoading(true);
            const { data } = await apiRequest<any>("local", "/api/block_days/list", {
                method: "POST"
            });
            if (data) setDaysList(data);
            setLoading(false);
        }
        fetchBlockDays();
    }, [refreshContent]);

    // Filter bookings
    const filteredDaysList = daysList && daysList.length > 0 && daysList.filter((row: any) => {
        const matchesSearch = row?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row?.start_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row?.end_date.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    }) || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500/10 border-1 border-green-500 text-green-700 dark:text-green-400";
            case "expired":
                return "bg-yellow-500/10 border-1 border-yellow-500 text-yellow-700 dark:text-yellow-400";
            case "inactive":
                return "bg-red-500/10 text-red-700 border-1 border-red-500 dark:text-red-400";
        }
    }

    // Handle add day
    const handleAddDay = async (e: any) => {
        e.preventDefault();
        setModelFormLoading(true);
        const { data } = await apiRequest<any>("local", "/api/block_days/create", {
            method: "POST",
            body: JSON.stringify(newFormData)
        });
        if (data?.success) {
            setOpenAddDay(false);
            setRefreshContent(true);
        }
        setModelFormLoading(false);
    }

    // Handle delete booking
    const handleDeleteDay = async () => {
        setModelFormLoading(true);
        const { data } = await apiRequest<any>("local", "/api/block_days/delete", {
            method: "POST",
            body: JSON.stringify({ id: deleteBlockId })
        });
        if (data?.success) {
            setDeleteBlockId("");
            setRefreshContent(true);
        }
        setModelFormLoading(false);
    }

    // Format date (e.g. 10 Jan 2025)
    const formatDate = (date: string) => {
        const [year, month, day] = date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const dayStr = dateObj.getDate();
        const monthStr = dateObj.toLocaleString('default', { month: 'short' });
        const yearStr = dateObj.getFullYear();
        return `${dayStr} ${monthStr} ${yearStr}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading block days...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Block Days</h1>
                    <p className="text-muted-foreground mt-1">Manage all tour block days</p>
                </div>
                <Button className="shadow-soft hover:shadow-soft-lg transition-smooth cursor-pointer" onClick={() => setOpenAddDay(true)}>
                    <Plus className="h-4 w-4" /> Add Block Day
                </Button>
            </div>
            <Card className="shadow-soft">
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by title, start date, or end date"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-soft">
                <CardHeader>
                    <CardTitle>All Days ({filteredDaysList && filteredDaysList.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                                    <th className="pb-3 pr-4">Title</th>
                                    <th className="pb-3 pr-4">Start Date</th>
                                    <th className="pb-3 pr-4">End Date</th>
                                    <th className="pb-3 pr-4">Total Days</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDaysList && filteredDaysList.length === 0 && <tr>
                                    <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                                        No block days found
                                    </td>
                                </tr>}

                                {filteredDaysList && filteredDaysList.length > 0 && filteredDaysList.map((row: any) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-100 transition-smooth"
                                    >
                                        <td className="py-4 pr-4">
                                            <span className="text-sm font-medium">{row.title}</span>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <span className="text-sm font-medium">{formatDate(row.start_date)}</span>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <span className="text-sm font-medium">{formatDate(row.end_date)}</span>
                                        </td>
                                        <td>
                                            <span className="text-sm font-medium">{row.total_days}</span>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <Badge className={cn("capitalize", getStatusColor(row.status))}>{row.status}</Badge>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setDeleteBlockId(row.id)}
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

            {/* Add block day */}
            <Dialog open={openAddDay} onOpenChange={setOpenAddDay}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Block Day</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-foreground">Title</label>
                            <Input
                                placeholder="Title"
                                value={newFormData.title}
                                onChange={(e) => setNewFormData({ ...newFormData, title: e.target.value })}
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-foreground">Start Date</label>
                            <Input
                                type="date"
                                value={newFormData.startDate}
                                onChange={(e) => setNewFormData({ ...newFormData, startDate: e.target.value })}
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-foreground">End Date</label>
                            <Input
                                type="date"
                                value={newFormData.endDate}
                                onChange={(e) => setNewFormData({ ...newFormData, endDate: e.target.value })}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="default" className="cursor-pointer" disabled={modelFormLoading} onClick={handleAddDay}>
                            {modelFormLoading && <Loader className="h-4 w-4 animate-spin" />}
                            {!modelFormLoading && <CheckCircle className="h-4 w-4" />}
                            Add Block Day
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete block day */}
            {deleteBlockId && <Dialog open={deleteBlockId !== ""} onOpenChange={() => setDeleteBlockId("")}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Block Day ID: {deleteBlockId}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <p>Are you sure you want to delete this block day? This action cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline_danger" className="cursor-pointer" disabled={modelFormLoading} onClick={handleDeleteDay}>
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
