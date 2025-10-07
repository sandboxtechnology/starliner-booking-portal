import { NextResponse } from "next/server"
import { apiRequest } from "@/lib/api-config"

// POST create new block days
export async function POST(req: Request) {
    try {
        // Get request body
        const body = await req.json();
        const { title, startDate, endDate } = body;

        // Validate required fields
        if (!title || !startDate || !endDate) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Send API request
        const { data: requestData, error } = await apiRequest("live", "/api/block_days/create", {
            method: "POST",
            body: JSON.stringify(body)
        });

        // Handle response
        if (error || !requestData) {
            return NextResponse.json({ success: false, message: error || "Error: Record not created" }, { status: 500 })
        }

        // Send response
        return NextResponse.json(requestData);
    } catch (error: any) {
        // Send response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
