import { NextResponse } from "next/server"
import { apiRequest } from "@/lib/api-config"

// GET all tours
export async function GET() {
    try {
        // Send API request
        const { data: requestData, error } = await apiRequest("live", "/api/tours/list", {
            method: "POST"
        });

        // Handle response
        if (error || !requestData) {
            return NextResponse.json({ success: false, message: error || "Error: Tour list not found" }, { status: 500 })
        }

        // Send response
        return NextResponse.json(requestData);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

// POST create new tour
export async function POST(req: Request) {
    try {
        // Get request body
        const body = await req.json();
        const { title, shortDescription, details, price, durationHours, image } = body;

        // Validate required fields
        if (!title || !shortDescription || !details || !price || !durationHours || !image) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Mock successful creation
        const newTour = {
            title,
            shortDescription,
            details,
            price: Number(price),
            durationHours: Number(durationHours),
            image
        };

        // Send API request
        const { data: requestData, error } = await apiRequest("live", "/api/tours/create", {
            method: "POST",
            body: JSON.stringify(newTour)
        });

        // Handle response
        if (error || !requestData) {
            return NextResponse.json({ success: false, message: error || "Error: Tour not created" }, { status: 500 })
        }

        // Send response
        return NextResponse.json(requestData);
    } catch (error: any) {
        // Send response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
