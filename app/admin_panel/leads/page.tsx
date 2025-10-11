"use client"

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, Trash2, Loader, X, CheckCircle, Info, MapPinIcon, CheckCircleIcon } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function LeadsPage() {
    // Define state
    const [loading, setLoading] = useState(true);
    const [leadsList, setLeadsList] = useState<any>([]);
    const [statusFilter, setStatusFilter] = useState<string | "all">("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [locationData, setLocationData] = useState<any>("");
    const [updateLeadId, setUpdateLeadId] = useState<string>("");
    const [updateLeadStatus, setUpdateLeadStatus] = useState<string>("");
    const [deleteLeadId, setDeleteLeadId] = useState<string>("");
    const [modelFormLoading, setModelFormLoading] = useState<boolean>(false);

    // Init leads
    useEffect(() => {
        async function fetchLeadData() {
            setLoading(true);
            const { data } = await apiRequest<any>("local", "/api/leads/list", {
                method: "POST"
            });
            if (data) setLeadsList(data);
            setLoading(false);
        }
        fetchLeadData();
    }, []);

    // Filter leads
    const filteredLeadsList = leadsList && leadsList.length > 0 && leadsList.filter((row: any) => {
        const matchesSearch = row?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row?.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row?.location_data.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || row?.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "working":
                return "bg-green-500/10 border-1 border-green-500 text-green-700 dark:text-green-400";
            case "pending":
                return "bg-yellow-500/10 border-1 border-yellow-500 text-yellow-700 dark:text-yellow-400";
            case "closed":
                return "bg-red-500/10 text-red-700 border-1 border-red-500 dark:text-red-400";
        }
    }

    // Display date and time (e.g. 01 Jan 2023 01:00 AM)
    const displayDateTime = (dateTime: string) => {
        const dateObj = new Date(dateTime);
        return dateObj.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }

    // Handle update lead
    const handleUpdateLead = async () => {
        setModelFormLoading(true);
        const { data } = await apiRequest<any>("local", "/api/leads/update", {
            method: "POST",
            body: JSON.stringify({ lead_id: updateLeadId, status: updateLeadStatus })
        });
        if (data?.success) {
            // Close modal
            setUpdateLeadId("");

            // Update in row
            const updatedLeads = leadsList.map((lead: any) => {
                if (lead?.id === updateLeadId) {
                    return { ...lead, status: updateLeadStatus };
                }
                return lead;
            });
            setLeadsList(updatedLeads);
        }
        setModelFormLoading(false);
    }

    // Handle delete lead
    const handleDeleteLead = async () => {
        setModelFormLoading(true);
        const { data } = await apiRequest<any>("local", "/api/leads/delete", {
            method: "POST",
            body: JSON.stringify({ id: deleteLeadId })
        });
        if (data?.success) {
            setDeleteLeadId("");
            const updatedLeads = leadsList.filter((lead: any) => lead?.lead_id !== deleteLeadId);
            setLeadsList(updatedLeads);
        }
        setModelFormLoading(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading leads...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Leads</h1>
                    <p className="text-muted-foreground mt-1">Manage all leads</p>
                </div>
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
                        <div className="flex gap-2">
                            {(["all", "pending", "working", "closed"] as const).map((status: any) => (
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
                    <CardTitle>All Leads ({filteredLeadsList && filteredLeadsList.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                                    <th className="pb-3 pr-4">ID</th>
                                    <th className="pb-3 pr-4">Email</th>
                                    <th className="pb-3 pr-4">Phone</th>
                                    <th className="pb-3 pr-4">Land From</th>
                                    <th className="pb-3 pr-4">Device</th>
                                    <th className="pb-3 pr-4">Created At</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeadsList && filteredLeadsList.length === 0 && <tr>
                                    <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                                        No lead found!
                                    </td>
                                </tr>}

                                {filteredLeadsList && filteredLeadsList.length > 0 && filteredLeadsList.map((row: any) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-100 transition-smooth"
                                    >
                                        <td className="py-2">
                                            <span className="text-sm font-medium">{row.id}</span>
                                        </td>
                                        <td className="py-2">
                                            <span className="text-sm font-medium">{row.email ?? '-'}</span>
                                        </td>
                                        <td className="py-2">
                                            <span className="text-sm font-medium">{row.phone ? row.phone : '-'}</span>
                                        </td>
                                        <td className="py-2">
                                            <span className="text-sm capitalize font-medium">
                                                {row?.refer_url?.is_link && <Link href={row?.refer_url?.text} target="_blank" className="text-blue-600">Page Link</Link>}

                                                {!row?.refer_url?.is_link && row?.refer_url?.text}
                                            </span>
                                        </td>
                                        <td className="py-2">
                                            <span className="text-sm font-medium capitalize">{row.device}</span>
                                        </td>
                                        <td className="py-2">
                                            <span className="text-sm font-medium">{displayDateTime(row.created_at)}</span>
                                        </td>
                                        <td className="py-2">
                                            <Badge className={cn("capitalize", getStatusColor(row.status))}>{row.status}</Badge>
                                        </td>
                                        <td className="py-2">
                                            <div className="flex gap-2 items-center">
                                                <MapPinIcon className="cursor-pointer h-4 w-4 text-blue-600 mr-2" onClick={() => setLocationData(row)} />
                                                <Edit className="cursor-pointer h-4 w-4 text-green-600 mr-2" onClick={() => setUpdateLeadId(row?.id)} />
                                                <Trash2 className="cursor-pointer h-4 w-4 text-red-600" onClick={() => setDeleteLeadId(row?.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* View lead */}
            {locationData && <Dialog open={locationData !== ""} onOpenChange={() => setLocationData("")}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>View Lead ID: {locationData?.id}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                        <table>
                            <tbody>
                                <tr>
                                    <td className="py-2 pr-4">IP Address:</td>
                                    <td className="py-2 pr-4">{locationData?.location_data?.ip ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">City:</td>
                                    <td className="py-2 pr-4">{locationData?.location_data?.city ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Region:</td>
                                    <td className="py-2 pr-4">{locationData?.location_data?.region ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Country:</td>
                                    <td className="py-2 pr-4">{locationData?.location_data?.country ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Organization:</td>
                                    <td className="py-2 pr-4">{locationData?.location_data?.org ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Postal Code:</td>
                                    <td className="py-2 pr-4">{locationData?.location_data?.postal ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Timezone:</td>
                                    <td className="py-2 pr-4">{locationData?.location_data?.timezone ?? '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>}

            {/* Update lead */}
            {updateLeadId && <Dialog open={updateLeadId !== ""} onOpenChange={() => setUpdateLeadId("")}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Lead Status (ID: {updateLeadId})</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-1.5">
                        <Select value={updateLeadStatus} onValueChange={(e) => setUpdateLeadStatus(e)}>
                            <SelectTrigger className="w-full" aria-label="Filter by status">
                                <SelectValue placeholder="Choose status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="working">Working On</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline_primary" className="cursor-pointer" disabled={modelFormLoading} onClick={handleUpdateLead}>
                            {modelFormLoading && <Loader className="h-4 w-4 animate-spin" />}
                            {!modelFormLoading && <CheckCircleIcon className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>}

            {/* Delete lead */}
            {deleteLeadId && <Dialog open={deleteLeadId !== ""} onOpenChange={() => setDeleteLeadId("")}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Lead ID: {deleteLeadId}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <p>Are you sure you want to delete this lead? This action cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline_danger" className="cursor-pointer" disabled={modelFormLoading} onClick={handleDeleteLead}>
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
