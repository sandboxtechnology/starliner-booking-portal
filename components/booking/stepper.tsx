import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

type StepperProps = {
    current: 1 | 2 | 3 | 4 | 5
    className?: string
}

export function Stepper({ current, className }: StepperProps) {
    // Define steps
    const steps = [
        { id: 1, label: "Schedule" },
        { id: 2, label: "Travelers" },
        { id: 3, label: "Customer Details" },
        { id: 4, label: "Booking Confirmation" }
    ] as const;

    return (
        <nav
            aria-label="Progress"
            className={cn("w-full rounded-xl hidden md:block lg:block border border-border/50 bg-card px-4 py-4 shadow-soft", className)}
        >
            <ol className="mx-auto flex max-w-4xl flex-wrap text-center items-center gap-2 md:gap-4">
                {steps.map((s, i) => {
                    const active = s.id === current
                    const completed = s.id < current
                    return (
                        <li key={s.id} className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "flex items-center gap-2 rounded-full px-3 py-1.5 transition-smooth",
                                    active && "bg-primary text-primary-foreground shadow-sm",
                                    completed && "bg-primary/10 text-primary",
                                    !active && !completed && "bg-muted text-muted-foreground",
                                )}
                            >
                                <span
                                    className={cn(
                                        "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold transition-smooth",
                                        active && "bg-primary-foreground text-primary shadow-sm",
                                        completed && "bg-primary text-primary-foreground",
                                        !active && !completed && "bg-background text-foreground",
                                    )}
                                    aria-current={active ? "step" : undefined}
                                >
                                    {completed ? <Check className="h-4 w-4" /> : s.id}
                                </span>
                                <span className="hidden text-sm font-medium sm:inline">{s.label}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        "mx-1 h-0.5 w-6 md:w-10 rounded-full transition-smooth",
                                        completed ? "bg-primary" : "bg-border",
                                    )}
                                />
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
