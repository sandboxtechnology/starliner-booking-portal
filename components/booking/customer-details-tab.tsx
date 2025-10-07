"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CustomerDetailsTabProps = {
    name: string
    setName: (n: string) => void
    email: string
    setEmail: (e: string) => void
    phone: string
    setPhone: (p: string) => void
    address: string
    setAddress: (p: string) => void
    country: string
    setCountry: (c: string) => void
}

export function CustomerDetailsTab({
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    address,
    setAddress,
    country,
    setCountry,
}: CustomerDetailsTabProps) {
    return (
        <Card className="bg-card shadow-soft border-border/50">
            <CardHeader className="space-y-2">
                <h3 className="text-xl font-bold">Customer Details</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Please provide your contact information for booking confirmation.
                </p>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">
                            Full Name *
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter full name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11 transition-smooth focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11 transition-smooth focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">
                            Phone Number *
                        </Label>
                        <Input
                            id="phone"
                            placeholder="Enter phone number"
                            autoComplete="off"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-11 transition-smooth focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-semibold">
                            Address *
                        </Label>
                        <Input
                            id="address"
                            placeholder="Enter address"
                            autoComplete="off"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="h-11 transition-smooth focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    {/* <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="country" className="text-sm font-semibold">
                            Country *
                        </Label>
                        <Select value={country} onValueChange={setCountry}>
                            <SelectTrigger id="country" className="h-11 transition-smooth">
                                <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                            <SelectContent>
                                {["United States", "Canada", "United Kingdom", "Australia", "India"].map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div> */}
                </div>
            </CardContent>
        </Card>
    )
}
