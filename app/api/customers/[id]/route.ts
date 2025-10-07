import { NextResponse } from "next/server"
import { getCustomerById } from "@/lib/customers"

// GET single customer
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const customer = getCustomerById(params.id)
    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: customer })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// PUT update customer
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    console.log("[v0] Customer updated:", params.id, body)

    // Mock successful update
    return NextResponse.json({
      success: true,
      data: { id: params.id, ...body },
      message: "Customer updated successfully",
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE customer
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Customer deleted:", params.id)

    // Mock successful deletion
    return NextResponse.json({ success: true, message: "Customer deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
