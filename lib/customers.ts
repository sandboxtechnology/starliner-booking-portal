// Customer type
export type Customer = {
    id: string
    name: string
    email: string
    phone: string
    country: string
    address: string
    postalCode: string
    totalBookings: number
    totalSpent: number
    lastBookingDate: string
    createdAt: string
    status: "active" | "inactive"
}