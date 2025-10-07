// Define booking status
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "ON HOLD";

export type Booking = {
  id: string
  tourId: string
  tourTitle: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  adults: number
  children: number
  infants: number
  totalMembers: number
  postalCode: string
  country: string
  status: BookingStatus
  totalPrice: number
  createdAt: string
  notes?: string
}

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    id: "BK001",
    tourId: "sunset-sail",
    tourTitle: "Sunset Sail Cruise",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+1 (555) 123-4567",
    date: "2025-01-15",
    time: "16:00",
    adults: 2,
    children: 0,
    infants: 0,
    totalMembers: 2,
    postalCode: "10001",
    country: "United States",
    status: "confirmed",
    totalPrice: 258,
    createdAt: "2025-01-10T10:30:00Z",
    notes: "Anniversary celebration",
  },
  {
    id: "BK002",
    tourId: "wine-country",
    tourTitle: "Wine Country Day Trip",
    customerName: "Sarah Smith",
    customerEmail: "sarah.smith@example.com",
    customerPhone: "+1 (555) 234-5678",
    date: "2025-01-18",
    time: "09:00",
    adults: 4,
    children: 0,
    infants: 0,
    totalMembers: 4,
    postalCode: "94102",
    country: "United States",
    status: "pending",
    totalPrice: 636,
    createdAt: "2025-01-11T14:20:00Z",
  },
  {
    id: "BK003",
    tourId: "reef-snorkel",
    tourTitle: "Coral Reef Snorkeling",
    customerName: "Michael Johnson",
    customerEmail: "michael.j@example.com",
    customerPhone: "+1 (555) 345-6789",
    date: "2025-01-20",
    time: "11:00",
    adults: 2,
    children: 2,
    infants: 0,
    totalMembers: 4,
    postalCode: "33139",
    country: "United States",
    status: "confirmed",
    totalPrice: 556,
    createdAt: "2025-01-12T09:15:00Z",
  },
]

export function getBookings(): Booking[] {
  return mockBookings
}

export function getBookingById(id: string): Booking | undefined {
  return mockBookings.find((b) => b.id === id)
}

export function getBookingsByStatus(status: BookingStatus): Booking[] {
  return mockBookings.filter((b) => b.status === status)
}
