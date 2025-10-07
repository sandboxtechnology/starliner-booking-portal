import { NextResponse } from "next/server"
import { getBookings } from "@/lib/bookings"
import { getReportData } from "@/lib/report-utils"

// GET reports data
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "weekly" // weekly, monthly, yearly

    const bookings = getBookings()
    const reportData = getReportData(bookings, period as "weekly" | "monthly" | "yearly")

    console.log("[v0] Report generated for period:", period)

    return NextResponse.json({ success: true, data: reportData, period })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
