"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiRequest } from "@/lib/api-config"
import type { Customer } from "@/lib/customers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Mail, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CustomersPage() {
    // Define state
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)

    // Init customer list
    useEffect(() => {
        async function fetchCustomers() {
            setLoading(true);
            const { data } = await apiRequest<Customer[]>("local", "/api/customers", {
                method: "POST"
            });
            if (data) setCustomers(data);
            setLoading(false);
        }
        fetchCustomers();
    }, []);

    // Filter customers
    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.address.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
    })

    // Define status
    const stats = {
        total: customers.length,
        active: customers.filter((c) => c.status === "active").length,
        inactive: customers.filter((c) => c.status === "inactive").length,
        totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading customers...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Customers</h1>
                    <p className="text-muted-foreground mt-1">Manage your customers</p>
                </div>
            </div>
            <Card className="shadow-soft">
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, phone, location or customer ID"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex gap-2">
                            {(["all", "active", "inactive"] as const).map((status) => (
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
                    <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                                    <th className="pb-3 pr-4">ID</th>
                                    <th className="pb-3 pr-4">Name</th>
                                    <th className="pb-3 pr-4">Email</th>
                                    <th className="pb-3 pr-4">Phone</th>
                                    <th className="pb-3 pr-4">Total Bookings</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-muted-foreground">
                                            No customers found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer: any) => (
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-gray-100 transition-smooth"
                                        >
                                            <td className="py-4 pr-4">
                                                <span className="text-sm">SDT{customer.id}</span>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <p className="text-sm text-foreground">{customer.name}</p>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className="text-sm text-foreground">{customer.email}</span>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className="text-sm text-foreground">{customer.phone}</span>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className="text-sm font-medium">{customer.bookings}</span>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <Badge
                                                    className={cn(
                                                        "capitalize",
                                                        customer.status === "active"
                                                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                                            : "bg-red-500/10 text-red-700 dark:text-red-400",
                                                    )}
                                                >
                                                    {customer.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4">
                                                <Link href={`/admin_panel/customers/${customer.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 cursor-pointer">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
