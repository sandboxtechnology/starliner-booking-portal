import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Tour } from "@/lib/tours"
import { Clock } from "lucide-react"

function formatPrice(n: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

function decodeHtmlEntities(str: string) {
    if (typeof window === "undefined") return str; // SSR safety
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

export function TourCard({ tour }: { tour: Tour }) {
    return (
        <Card className="group overflow-hidden bg-card pt-0 shadow-soft hover:shadow-soft-lg transition-smooth border-border/50">
            <div className="relative h-52 w-full overflow-hidden sm:h-60 lg:h-52">
                <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-smooth group-hover:scale-105"
                    priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            </div>
            <CardHeader className="space-y-2 pb-3">
                <h3 className="text-balance text-lg font-semibold leading-tight group-hover:text-primary transition-smooth">
                    {decodeHtmlEntities(tour.title)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{tour.short_description}</p>
            </CardHeader>
            <CardContent className="flex items-center justify-between pb-4">
                <span className="text-lg font-bold text-primary">
                    {formatPrice(tour.price)}
                    {tour.price_prefix && `/${tour.price_prefix}`}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{tour.duration_hours}</span>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Button asChild className="w-full font-semibold shadow-sm hover:shadow-md transition-smooth">
                    <Link href={`/booking/${tour.slug}`} aria-label={`Book ${tour.title} now`}>
                        Book Now
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
