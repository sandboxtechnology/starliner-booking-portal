import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/api-config";

// POST list of customers
export async function POST(req: Request) {
    try {
        // Fetch API request
        const { data: countStateData } = await apiRequest("live", "/api/dashboard/count", {
            method: "POST"
        });

        // Return response
        return NextResponse.json(countStateData);
    } catch (error: any) {
        // Return response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
