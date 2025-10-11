import { NextResponse } from "next/server"
import { getBookings } from "@/lib/bookings"
import { apiRequest } from "@/lib/api-config";

// POST create new booking
export async function POST(req: Request) {
    try {
        // Get request body
        const body = await req.json();

        // Send API request
        const { data: requestData } = await apiRequest("live", "/api/leads/update", {
            method: "POST",
            body: JSON.stringify(body)
        });

        // Return response
        return NextResponse.json(requestData);
    } catch (error: any) {
        // Return response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
