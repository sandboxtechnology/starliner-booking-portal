"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import { Stepper } from "@/components/booking/stepper"
import { BookingSummary } from "@/components/booking/booking-summary"
import { ScheduleTab } from "@/components/booking/schedule-tab"
import { TravelersTab } from "@/components/booking/travelers-tab"
import { CustomerDetailsTab } from "@/components/booking/customer-details-tab"
import { PaymentTab } from "@/components/booking/payment-tab"
import { Tour } from "@/lib/tours"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/api-config"
import { CheckCircle, Loader, MoveLeftIcon, MoveRightIcon } from "lucide-react"

export default function BookingPage({ params }: { params: { slug: string } }) {
    // Define state
    const [loading, setLoading] = useState(false);
    const [singleTour, setSingleTour] = useState<any>({});
    const [timeSlotList, setTimeslotList] = useState<any>({});
    const [activeTab, setActiveTab] = useState("schedule");
    const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set(["schedule"]));
    const [monthOffset, setMonthOffset] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [timeSlot, setTimeSlot] = useState<string>("");
    const [adults, setAdults] = useState<number>(1);
    const [children812, setChildren812] = useState<number>(0);
    const [children37, setChildren37] = useState<number>(0);
    const [infants, setInfants] = useState<number>(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("United States");
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Init single tour
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const { data } = await apiRequest<any>("local", "/api/tours/single_slug", {
                method: "POST",
                body: JSON.stringify({ slug: params?.slug })
            });
            if (data) setSingleTour(data as Tour[]);

            // Get tour duration
            const tourDuration = Number(data?.duration_timeslot) || 4;

            // Generate time slot as per tour duration
            const startTime = '09:00';
            const endTime = '18:00';
            const timeSlots: any = [];

            let start = new Date();
            start.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]), 0, 0);
            let end = new Date();
            end.setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]), 0, 0);

            while (start < end) {
                timeSlots.push(start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                start.setMinutes(start.getMinutes() + tourDuration * 60);
            }

            // Update state
            setTimeslotList(timeSlots);
            setLoading(false);
        }
        fetchData();
    }, []);

    // define route
    const router = useRouter();
    const { toast } = useToast();

    // Handle not found
    if (!singleTour) return notFound();

    // Define total travellers
    const totalTravellers = adults + children812 + children37 + infants

    // Define can proceed
    const canProceedFromSchedule = !!selectedDate && !!timeSlot
    const canProceedFromTravelers = totalTravellers >= 1 && totalTravellers <= 10
    const canProceedFromCustomer =
        name.trim().length > 1 &&
        /\S+@\S+\.\S+/.test(email) &&
        phone.trim().length >= 7 &&
        address.trim().length > 0 &&
        country.trim().length > 0
    const canProceedFromPayment =
        cardNumber.trim().length >= 15 &&
        cardName.trim().length > 1 &&
        expiryDate.trim().length === 5 &&
        cvv.trim().length >= 3

    const handleNext = () => {
        if (activeTab === "schedule" && canProceedFromSchedule) {
            setCompletedTabs((prev) => new Set(prev).add("travelers"))
            setActiveTab("travelers")
        } else if (activeTab === "travelers" && canProceedFromTravelers) {
            setCompletedTabs((prev) => new Set(prev).add("customer"))
            setActiveTab("customer")
        } else if (activeTab === "customer" && canProceedFromCustomer) {
            handleSubmit();
        }
    }

    const handleBack = () => {
        if (activeTab === "travelers") setActiveTab("schedule")
        else if (activeTab === "customer") setActiveTab("travelers")
        else if (activeTab === "payment") setActiveTab("customer")
    }

    async function handleSubmit() {
        // Handle submit
        if (!selectedDate) return;
        setSubmitting(true);
        setErrorMessage("");

        try {
            // Submit booking
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tourId: singleTour?.id,
                    date: selectedDate.toISOString(),
                    time: timeSlot,
                    adults,
                    children812,
                    children37,
                    infants,
                    totalTravelers: totalTravellers,
                    name,
                    email,
                    phone,
                    address,
                    singlePrice: singleTour?.price
                })
            });

            // Handle response
            const data = await res.json();

            // Handle error
            if (!res.ok) throw new Error(data?.message || "Failed to submit booking");

            // If booking done
            if (!data?.booking_id) {
                setErrorMessage(`Error: ${data?.message}`);
            } else {
                // Handle success
                const params = new URLSearchParams({ ref: data?.booking_id });

                // Redirect to thank you
                router.push(`/booking/${singleTour?.slug}/thank-you?${params.toString()}`);
            }
        } catch (err: any) {
            // Handle error
            toast({
                title: "Submission failed",
                description: err.message || "Please try again.",
                variant: "destructive"
            });
        } finally {
            // Set submitting
            setSubmitting(false);
        }
    }

    // Define current step
    const getCurrentStep = (): 1 | 2 | 3 | 4 => {
        if (activeTab === "schedule") return 1;
        if (activeTab === "travelers") return 2;
        if (activeTab === "customer") return 3;
        return 4;
    }

    // Define can proceed
    const canProceed =
        (activeTab === "schedule" && canProceedFromSchedule) ||
        (activeTab === "travelers" && canProceedFromTravelers) ||
        (activeTab === "customer" && canProceedFromCustomer);

    // Loading
    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading selected tour...</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-7xl md:space-y-6 sm:space-y-2 px-4 py-1 md:py-1">
            <Stepper current={getCurrentStep()} />
            <header className="space-y-2 hidden">
                <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Complete Your Booking</h1>
                <p className="text-muted-foreground">Follow the steps to reserve your tour.</p>
            </header>
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsContent value="schedule">
                            <ScheduleTab
                                tour={singleTour}
                                timeSlotList={timeSlotList}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                timeSlot={timeSlot}
                                setTimeSlot={setTimeSlot}
                                monthOffset={monthOffset}
                                setMonthOffset={setMonthOffset}
                            />
                        </TabsContent>
                        <TabsContent value="travelers">
                            <TravelersTab
                                adults={adults}
                                setAdults={setAdults}
                                children812={children812}
                                setChildren812={setChildren812}
                                children37={children37}
                                setChildren37={setChildren37}
                                infants={infants}
                                setInfants={setInfants}
                            />
                        </TabsContent>
                        <TabsContent value="customer">
                            <CustomerDetailsTab
                                name={name}
                                setName={setName}
                                email={email}
                                setEmail={setEmail}
                                phone={phone}
                                setPhone={setPhone}
                                address={address}
                                setAddress={setAddress}
                                country={country}
                                setCountry={setCountry}
                            />
                        </TabsContent>
                        {/* <TabsContent value="payment">
                            <PaymentTab
                                cardNumber={cardNumber}
                                setCardNumber={setCardNumber}
                                cardName={cardName}
                                setCardName={setCardName}
                                expiryDate={expiryDate}
                                setExpiryDate={setExpiryDate}
                                cvv={cvv}
                                setCvv={setCvv}
                            />
                        </TabsContent> */}
                    </Tabs>

                    {errorMessage && <span className="mt-3 block text-sm text-red-500">{errorMessage}</span>}

                    <div className="mt-6 flex items-center justify-between">
                        <Button variant="outline" className="cursor-pointer" onClick={handleBack} disabled={activeTab === "schedule"}>
                            <MoveLeftIcon className="h-4 w-4" /> Back
                        </Button>
                        <Button onClick={handleNext} className="cursor-pointer" disabled={!canProceed || submitting}>
                            {!submitting && activeTab === "customer" && <CheckCircle className="h-4 w-4" />}
                            {submitting && <Loader className="h-4 w-4 animate-spin" />}
                            {activeTab === "customer" ? (submitting ? "Submitting..." : "Submit Booking") : "Next"}
                            {activeTab !== "customer" && <MoveRightIcon className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <aside className="lg:col-span-1">
                    <BookingSummary
                        tour={singleTour}
                        selectedDate={selectedDate}
                        timeSlot={timeSlot}
                        adults={adults}
                        children812={children812}
                        children37={children37}
                        infants={infants}
                    />
                </aside>
            </section>
        </main>
    )
}
