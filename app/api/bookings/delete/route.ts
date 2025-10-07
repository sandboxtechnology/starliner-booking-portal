import { NextResponse } from "next/server"
import { apiRequest } from "@/lib/api-config";

// POST create new booking
export async function POST(req: Request) {
    try {
        // Get request body
        const body = await req.json();

        // Extract data
        const { id } = body;

        // Send API request
        const { data: requestData } = await apiRequest("live", "/api/bookings/delete", {
            method: "POST",
            body: JSON.stringify({ id })
        });

        // Return response
        return NextResponse.json(requestData);
    } catch (error: any) {
        // Return response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
