import { NextResponse } from "next/server"
import { getCustomers } from "@/lib/customers"
import { apiRequest } from "@/lib/api-config";

// POST list of customers
export async function POST(req: Request) {
    try {
        // Fetch API request
        const { data: requestData } = await apiRequest("live", "/api/customers/list", {
            method: "POST"
        });

        // Return response
        return NextResponse.json(requestData);
    } catch (error: any) {
        // Return response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
