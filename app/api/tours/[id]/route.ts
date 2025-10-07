import { NextResponse } from "next/server"
import { getTourById } from "@/lib/tours"

// GET single tour
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const tour = getTourById(params.id)
    if (!tour) {
      return NextResponse.json({ success: false, message: "Tour not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: tour })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// PUT update tour
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    console.log("[v0] Tour updated:", params.id, body)

    // Mock successful update
    return NextResponse.json({
      success: true,
      data: { id: params.id, ...body },
      message: "Tour updated successfully",
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE tour
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Tour deleted:", params.id)

    // Mock successful deletion
    return NextResponse.json({ success: true, message: "Tour deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
