import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Tour } from "@/lib/tours"

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

export function SummaryCard({ tour }: { tour: Tour }) {
  return (
    <Card className="sticky top-6 h-fit overflow-hidden bg-card shadow-sm">
      <div className="relative aspect-[16/9]">
        <Image
          src={tour.image || "/placeholder.svg"}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold">{tour.title}</h3>
        <p className="text-sm text-muted-foreground">{tour.shortDescription}</p>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{tour.durationHours} hrs</span>
        <span className="text-sm font-medium">{formatPrice(tour.price)}</span>
      </CardContent>
    </Card>
  )
}
