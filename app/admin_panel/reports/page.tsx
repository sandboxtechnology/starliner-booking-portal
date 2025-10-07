"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  XCircle,
  CheckCheck,
} from "lucide-react"
import { apiRequest } from "@/lib/api-config"
import type { ReportPeriod } from "@/lib/report-utils"

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("monthly")
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    async function fetchReports() {
      setLoading(true)
      const { data, error } = await apiRequest(`/api/reports?period=${period}`)

      if (data) {
        setReportData(data)
      }
      setLoading(false)
    }

    fetchReports()
  }, [period])

  if (loading || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  const reports = reportData.data || []
  const currentReport = reports[reports.length - 1] || {}
  const previousReport = reports[reports.length - 2] || {}

  const revenueTrend =
    previousReport && previousReport.totalRevenue > 0
      ? ((currentReport.totalRevenue - previousReport.totalRevenue) / previousReport.totalRevenue) * 100
      : 0

  const bookingsTrend =
    previousReport && previousReport.totalBookings > 0
      ? ((currentReport.totalBookings - previousReport.totalBookings) / previousReport.totalBookings) * 100
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">View booking performance and revenue analytics</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === "weekly" ? "default" : "outline"}
            onClick={() => setPeriod("weekly")}
            className="shadow-soft"
          >
            Weekly
          </Button>
          <Button
            variant={period === "monthly" ? "default" : "outline"}
            onClick={() => setPeriod("monthly")}
            className="shadow-soft"
          >
            Monthly
          </Button>
          <Button
            variant={period === "yearly" ? "default" : "outline"}
            onClick={() => setPeriod("yearly")}
            className="shadow-soft"
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Current Period Overview */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Current Period: {currentReport.periodLabel}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft hover:shadow-soft-lg transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${(currentReport.totalRevenue || 0).toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {revenueTrend >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <p className={`text-xs ${revenueTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {revenueTrend >= 0 ? "+" : ""}
                  {revenueTrend.toFixed(1)}% from previous period
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{currentReport.totalBookings || 0}</div>
              <div className="flex items-center gap-1 mt-1">
                {bookingsTrend >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <p className={`text-xs ${bookingsTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {bookingsTrend >= 0 ? "+" : ""}
                  {bookingsTrend.toFixed(1)}% from previous period
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Booking Value</CardTitle>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${Math.round(currentReport.averageBookingValue || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per booking average</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-soft-lg transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Travelers</CardTitle>
              <Users className="h-5 w-5 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{currentReport.totalTravelers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg {((currentReport.totalTravelers || 0) / (currentReport.totalBookings || 1)).toFixed(1)} per booking
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Booking Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-foreground">{currentReport.confirmedBookings || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{currentReport.pendingBookings || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10">
              <CheckCheck className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{currentReport.completedBookings || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-foreground">{currentReport.cancelledBookings || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Trends */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Historical Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report: any, index: number) => {
              const isCurrentPeriod = index === reports.length - 1
              return (
                <div
                  key={report.periodLabel}
                  className={`flex items-center justify-between p-4 rounded-lg border ${isCurrentPeriod ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{report.periodLabel}</p>
                      {isCurrentPeriod && <Badge className="bg-primary/10 text-primary text-xs">Current</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {report.totalBookings} bookings • {report.totalTravelers} travelers
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">${report.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">${Math.round(report.averageBookingValue)} avg</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Revenue by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(currentReport.revenueByStatus || []).map((item: any) => {
                const percentage =
                  currentReport.totalRevenue > 0 ? ((item.revenue / currentReport.totalRevenue) * 100).toFixed(1) : "0"

                const statusColors: Record<string, string> = {
                  confirmed: "bg-green-500",
                  pending: "bg-yellow-500",
                  completed: "bg-blue-500",
                  cancelled: "bg-red-500",
                }

                return (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground capitalize">{item.status}</span>
                      <span className="text-sm font-semibold text-foreground">${item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${statusColors[item.status] || "bg-gray-500"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {percentage}% • {item.count} bookings
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Top Performing Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(currentReport.bookingsByTour || []).slice(0, 5).map((tour: any, index: number) => (
                <div key={tour.tourTitle} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tour.tourTitle}</p>
                      <p className="text-sm text-muted-foreground">{tour.count} bookings</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">${tour.revenue.toLocaleString()}</span>
                </div>
              ))}
              {(!currentReport.bookingsByTour || currentReport.bookingsByTour.length === 0) && (
                <p className="text-center text-muted-foreground py-4">No tour data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
