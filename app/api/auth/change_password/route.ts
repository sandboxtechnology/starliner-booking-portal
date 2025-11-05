import { apiRequest } from "@/lib/api-config";
import { NextResponse } from "next/server"

// POST admin login
export async function POST(req: Request) {
    try {
        // Get request body
        const body = await req.json();
        const { email, password } = body;

        // Mock authentication
        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
        }

        // Make API request
        const { data, error: apiError } = await apiRequest("live", "/api/auth/change_password", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        // Handle response
        if (apiError || !data) {
            return NextResponse.json({ success: false, message: apiError || "Login failed" }, { status: 401 });
        }

        // Mock successful login
        return NextResponse.json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error: any) {
        // Mock successful login
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
