import { NextResponse } from "next/server"
import { apiRequest } from "@/lib/api-config"

// POST fetch single tour
export async function POST(req: Request) {
    try {
        // Get request body
        const body = await req.json();
        const { slug } = body;

        // Validate required fields
        if (!slug) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Send API request
        const { data: requestData, error } = await apiRequest("live", "/api/tours/single_slug", {
            method: "POST",
            body: JSON.stringify({ slug })
        });

        // Handle response
        if (error || !requestData) {
            return NextResponse.json({ success: false, message: error || "Error: Single tour not found" }, { status: 500 })
        }

        // Send response
        return NextResponse.json(requestData);
    } catch (error: any) {
        // Send response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
