"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiRequest } from "@/lib/api-config"
import type { Customer } from "@/lib/customers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { notFound } from "next/navigation"

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<Customer | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postalCode: "",
    country: "United States",
  })

  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true)
      const { data, error } = await apiRequest<Customer>(`/api/customers/${params.id}`)

      if (error || !data) {
        setLoading(false)
        return
      }

      setCustomer(data)
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        postalCode: data.postalCode,
        country: data.country,
      })
      setLoading(false)
    }
    fetchCustomer()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { data, error } = await apiRequest(`/api/customers/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    })

    setSubmitting(false)

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Customer updated",
      description: "The customer has been successfully updated.",
    })
    router.push(`/admin_panel/customers/${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading customer...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin_panel/customers/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Edit Customer</h1>
          <p className="text-muted-foreground mt-1">Customer ID: {params.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postal">Postal Code *</Label>
                <Input
                  id="postal"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="10001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger id="country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["United States", "Canada", "United Kingdom", "Australia", "India"].map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={submitting} className="shadow-soft hover:shadow-soft-lg transition-smooth">
            {submitting ? "Updating..." : "Update Customer"}
          </Button>
          <Link href={`/admin_panel/customers/${params.id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
