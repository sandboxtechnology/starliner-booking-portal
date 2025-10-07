import type { Booking } from "./bookings"

export type ReportPeriod = "weekly" | "monthly" | "yearly"

export interface ReportData {
  totalBookings: number
  totalRevenue: number
  averageBookingValue: number
  confirmedBookings: number
  pendingBookings: number
  cancelledBookings: number
  completedBookings: number
  totalTravelers: number
  bookingsByTour: { tourTitle: string; count: number; revenue: number }[]
  revenueByStatus: { status: string; revenue: number; count: number }[]
  periodLabel: string
}

export function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function getStartOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1)
}

export function filterBookingsByDateRange(bookings: Booking[], startDate: Date, endDate: Date): Booking[] {
  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.createdAt)
    return bookingDate >= startDate && bookingDate <= endDate
  })
}

export function generateReportData(bookings: Booking[], period: ReportPeriod, periodLabel: string): ReportData {
  const totalBookings = bookings.length
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length
  const completedBookings = bookings.filter((b) => b.status === "completed").length

  const totalTravelers = bookings.reduce((sum, b) => sum + b.totalMembers, 0)

  // Group by tour
  const tourMap = new Map<string, { count: number; revenue: number }>()
  bookings.forEach((booking) => {
    const existing = tourMap.get(booking.tourTitle) || { count: 0, revenue: 0 }
    tourMap.set(booking.tourTitle, {
      count: existing.count + 1,
      revenue: existing.revenue + booking.totalPrice,
    })
  })

  const bookingsByTour = Array.from(tourMap.entries())
    .map(([tourTitle, data]) => ({ tourTitle, ...data }))
    .sort((a, b) => b.revenue - a.revenue)

  // Group by status
  const statusMap = new Map<string, { revenue: number; count: number }>()
  bookings.forEach((booking) => {
    const existing = statusMap.get(booking.status) || { revenue: 0, count: 0 }
    statusMap.set(booking.status, {
      revenue: existing.revenue + booking.totalPrice,
      count: existing.count + 1,
    })
  })

  const revenueByStatus = Array.from(statusMap.entries())
    .map(([status, data]) => ({ status, ...data }))
    .sort((a, b) => b.revenue - a.revenue)

  return {
    totalBookings,
    totalRevenue,
    averageBookingValue,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    completedBookings,
    totalTravelers,
    bookingsByTour,
    revenueByStatus,
    periodLabel,
  }
}

export function getWeeklyReports(bookings: Booking[], weeksBack = 4): ReportData[] {
  const reports: ReportData[] = []
  const now = new Date()

  for (let i = 0; i < weeksBack; i++) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - (i + 1) * 7)
    const startOfWeek = getStartOfWeek(weekStart)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const weekBookings = filterBookingsByDateRange(bookings, startOfWeek, endOfWeek)
    const periodLabel = `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`

    reports.unshift(generateReportData(weekBookings, "weekly", periodLabel))
  }

  return reports
}

export function getMonthlyReports(bookings: Booking[], monthsBack = 6): ReportData[] {
  const reports: ReportData[] = []
  const now = new Date()

  for (let i = 0; i < monthsBack; i++) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i - 1, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i, 0, 23, 59, 59, 999)

    const monthBookings = filterBookingsByDateRange(bookings, monthStart, monthEnd)
    const periodLabel = monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    reports.unshift(generateReportData(monthBookings, "monthly", periodLabel))
  }

  return reports
}

export function getYearlyReports(bookings: Booking[], yearsBack = 3): ReportData[] {
  const reports: ReportData[] = []
  const now = new Date()

  for (let i = 0; i < yearsBack; i++) {
    const yearStart = new Date(now.getFullYear() - i - 1, 0, 1)
    const yearEnd = new Date(now.getFullYear() - i, 0, 0, 23, 59, 59, 999)

    const yearBookings = filterBookingsByDateRange(bookings, yearStart, yearEnd)
    const periodLabel = yearStart.getFullYear().toString()

    reports.unshift(generateReportData(yearBookings, "yearly", periodLabel))
  }

  return reports
}

export function getReportData(bookings: Booking[], period: ReportPeriod): ReportData[] {
  switch (period) {
    case "weekly":
      return getWeeklyReports(bookings, 4)
    case "monthly":
      return getMonthlyReports(bookings, 6)
    case "yearly":
      return getYearlyReports(bookings, 3)
    default:
      return getMonthlyReports(bookings, 6)
  }
}
