import { NextResponse } from "next/server"
import { getBookings } from "@/lib/bookings"
import { apiRequest } from "@/lib/api-config";

// POST create new booking
export async function POST(req: Request) {
    try {
        // Get request body
        const body = await req.json();

        // Extract data
        const { tourId, date, time, singlePrice, adults, children812, children37, infants, totalTravelers, name, email, phone, address } = body;

        // Define payload data
        const newBooking = {
            tourId: tourId,
            travelDate: date,
            travelTime: time,
            adults: adults || 0,
            children812: children812 || 0,
            children37: children37 || 0,
            infants: infants || 0,
            totalTravelers,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            customerAddress: address,
            totalPrice: Number(singlePrice)
        }

        // Send API request
        const { data: requestData } = await apiRequest("live", "/api/bookings/create", {
            method: "POST",
            body: JSON.stringify(newBooking)
        });

        // Return response
        return NextResponse.json(requestData);
    } catch (error: any) {
        // Return response
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
