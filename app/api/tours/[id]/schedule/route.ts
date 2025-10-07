import { type NextRequest, NextResponse } from "next/server"
import { getTourById } from "@/lib/tours"

// GET /api/tours/[id]/schedule - Get tour schedule
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const tour = getTourById(params.id)

  if (!tour) {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 })
  }

  return NextResponse.json({
    schedule: tour.schedule || {
      availableDays: [1, 2, 3, 4, 5, 6],
      timeSlots: [
        { time: "09:00", capacity: 10 },
        { time: "11:00", capacity: 10 },
        { time: "14:00", capacity: 10 },
        { time: "16:00", capacity: 10 },
      ],
      blockedDates: [],
      advanceBookingDays: 60,
    },
  })
}

// PUT /api/tours/[id]/schedule - Update tour schedule
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const tour = getTourById(params.id)

  if (!tour) {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 })
  }

  try {
    const body = await request.json()

    // In a real app, this would update the database
    // For now, we'll just validate and return success
    console.log("[v0] Updating schedule for tour:", params.id, body)

    return NextResponse.json({
      success: true,
      message: "Schedule updated successfully",
      schedule: body,
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
