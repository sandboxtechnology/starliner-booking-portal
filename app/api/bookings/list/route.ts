import { NextResponse } from "next/server"
import { getBookings } from "@/lib/bookings"
import { apiRequest } from "@/lib/api-config";

// POST booking list
export async function POST(req: Request) {
    try {
        // Send API request
        const { data: requestData } = await apiRequest("live", "/api/bookings/list", {
            method: "POST"
        });

        // Return response
        return NextResponse.json(requestData);
    } catch (error: any) {
        // Return response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
