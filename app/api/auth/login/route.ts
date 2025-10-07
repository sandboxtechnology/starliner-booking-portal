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
        const { data, error: apiError } = await apiRequest("live", "/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        // Handle response
        if (apiError || !data) {
            return NextResponse.json({ success: false, message: apiError || "Login failed" }, { status: 401 });
        }

        // In production, verify credentials and generate JWT token
        const mockToken = `token_${data?.token}` ?? `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Mock successful login
        return NextResponse.json({
            success: true,
            message: "Login successful",
            data: {
                token: mockToken,
                user: {
                    id: data?.user?.id,
                    email,
                    name: data?.user?.name,
                    role: "admin"
                },
            },
        })
    } catch (error: any) {
        // Mock successful login
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
