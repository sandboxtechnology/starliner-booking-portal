import { NextResponse } from "next/server"
import { getBookingById } from "@/lib/bookings"

// GET single booking
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const booking = getBookingById(params.id)
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: booking })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// PUT update booking
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    console.log("[v0] Booking updated:", params.id, body)

    // Mock successful update
    return NextResponse.json({
      success: true,
      data: { id: params.id, ...body },
      message: "Booking updated successfully",
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE booking
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Booking deleted:", params.id)

    // Mock successful deletion
    return NextResponse.json({ success: true, message: "Booking deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
