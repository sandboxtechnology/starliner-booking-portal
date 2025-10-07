"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiRequest } from "@/lib/api-config"
import type { Tour } from "@/lib/tours"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { notFound } from "next/navigation"

export default function EditTourPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tour, setTour] = useState<Tour | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    details: "",
    price: 0,
    durationHours: 0,
    image: "",
  })

  useEffect(() => {
    async function fetchTour() {
      setLoading(true)
      const { data, error } = await apiRequest<Tour>(`/api/tours/${params.id}`)

      if (error || !data) {
        setLoading(false)
        return
      }

      setTour(data)
      setFormData({
        title: data.title,
        shortDescription: data.shortDescription,
        details: data.details,
        price: data.price,
        durationHours: data.durationHours,
        image: data.image,
      })
      setLoading(false)
    }
    fetchTour()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { data, error } = await apiRequest(`/api/tours/${params.id}`, {
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
      title: "Tour updated",
      description: "The tour has been successfully updated.",
    })
    router.push(`/admin_panel/tours/${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tour...</p>
        </div>
      </div>
    )
  }

  if (!tour) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin_panel/tours/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Edit Tour</h1>
          <p className="text-muted-foreground mt-1">Tour ID: {params.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tour Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Sunset Sail Cruise"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief description for tour cards"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Full Details *</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Detailed description of the tour experience..."
                rows={6}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Pricing & Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price per Person ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.durationHours}
                  onChange={(e) => setFormData({ ...formData, durationHours: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/tour-image.jpg or https://..."
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL or path to the tour image. Recommended size: 800x600px
              </p>
            </div>
            {formData.image && (
              <div className="rounded-lg border border-border overflow-hidden">
                <img src={formData.image || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={submitting} className="shadow-soft hover:shadow-soft-lg transition-smooth">
            {submitting ? "Updating..." : "Update Tour"}
          </Button>
          <Link href={`/admin_panel/tours/${params.id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
