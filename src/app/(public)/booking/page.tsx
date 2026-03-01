"use client";

import { useState } from "react";
import Image from "next/image";

type BookingStep = "service" | "datetime" | "details";

export default function PublicBookingPage() {
    const [currentStep, setCurrentStep] = useState<BookingStep>("datetime");

    // Progress calculation
    const getProgressWidth = () => {
        switch (currentStep) {
            case "service": return "33%";
            case "datetime": return "66%";
            case "details": return "100%";
            default: return "0%";
        }
    };

    return (
        <>
            {/* Page Title & Progress */}
            <div className="flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="mb-2 text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                        Book Your Relaxation
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Experience the ultimate wellness journey in just a few clicks.
                    </p>
                </div>

                {/* Progress Bar Component */}
                <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-lg">
                                check_circle
                            </span>
                            <span className="text-sm font-bold">
                                {currentStep === "service" && "Step 1: Select Service"}
                                {currentStep === "datetime" && "Step 2: Choose Date & Time"}
                                {currentStep === "details" && "Step 3: Confirm Details"}
                            </span>
                        </div>
                        <span className="text-sm font-medium text-slate-400">
                            {getProgressWidth()} Completed
                        </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: getProgressWidth() }}
                        ></div>
                    </div>
                    <div className="mt-3 flex justify-between text-[12px] font-bold uppercase tracking-wider text-slate-400">
                        <span className={currentStep === "service" ? "text-primary" : ""}>Service</span>
                        <span className={currentStep === "datetime" ? "text-primary" : ""}>Schedule</span>
                        <span className={currentStep === "details" ? "text-primary" : ""}>Details</span>
                    </div>
                </div>
            </div>

            {currentStep === "datetime" && (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            2. Select Your Slot
                        </h2>
                        <button
                            onClick={() => setCurrentStep("service")}
                            className="flex items-center gap-1 text-sm font-semibold text-primary"
                        >
                            <span className="material-symbols-outlined text-sm">
                                arrow_back
                            </span>
                            Back to Services
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Left: Calendar Sidebar Placeholder */}
                        <div className="flex flex-col gap-4 rounded-xl border border-primary/10 bg-white p-4 dark:bg-slate-900 md:col-span-1">
                            <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                                <span className="text-sm font-bold">October 2023</span>
                                <div className="flex gap-2">
                                    <span className="material-symbols-outlined cursor-pointer text-slate-400">
                                        chevron_left
                                    </span>
                                    <span className="material-symbols-outlined cursor-pointer text-slate-400">
                                        chevron_right
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
                                <span>M</span>
                                <span>T</span>
                                <span>W</span>
                                <span>T</span>
                                <span>F</span>
                                <span>S</span>
                                <span>S</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                <span className="p-2 text-slate-300">28</span>
                                <span className="p-2 text-slate-300">29</span>
                                <span className="p-2 text-slate-300">30</span>
                                <span className="cursor-pointer rounded p-2 hover:bg-primary/10">1</span>
                                <span className="cursor-pointer rounded p-2 hover:bg-primary/10">2</span>
                                <span className="cursor-pointer rounded p-2 hover:bg-primary/10">3</span>
                                <span className="cursor-pointer rounded p-2 hover:bg-primary/10">4</span>
                                <span className="cursor-pointer rounded bg-primary font-bold text-slate-900">5</span>
                                <span className="cursor-pointer rounded p-2 hover:bg-primary/10">6</span>
                                <span className="cursor-pointer rounded p-2 hover:bg-primary/10">7</span>
                                <span className="cursor-pointer rounded p-2 hover:bg-primary/10">8</span>
                                <span className="cursor-pointer rounded p-2 hover:bg-primary/10">9</span>
                                <span className="cursor-pointer rounded p-2 hover:bg-primary/10">10</span>
                                <span className="cursor-pointer rounded p-2 hover:bg-primary/10">11</span>
                            </div>
                        </div>

                        {/* Right: Time Slots Grid */}
                        <div className="flex flex-col gap-4 md:col-span-2">
                            <p className="text-sm font-semibold text-slate-500">
                                Available slots for Thursday, Oct 5
                            </p>
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                <button className="rounded-lg border border-primary/20 px-2 py-3 text-center text-sm font-medium transition-all hover:bg-primary hover:text-slate-900">
                                    09:00 AM
                                </button>
                                <button className="rounded-lg border border-primary/20 px-2 py-3 text-center text-sm font-medium transition-all hover:bg-primary hover:text-slate-900">
                                    10:30 AM
                                </button>
                                <button
                                    onClick={() => setCurrentStep("details")}
                                    className="rounded-lg border border-primary bg-primary/10 px-2 py-3 text-center text-sm font-bold text-primary"
                                >
                                    11:45 AM
                                </button>
                                <button className="rounded-lg border border-primary/20 px-2 py-3 text-center text-sm font-medium transition-all hover:bg-primary hover:text-slate-900">
                                    01:00 PM
                                </button>
                                <button className="rounded-lg border border-primary/20 px-2 py-3 text-center text-sm font-medium transition-all hover:bg-primary hover:text-slate-900">
                                    02:15 PM
                                </button>
                                <button className="rounded-lg border border-primary/20 px-2 py-3 text-center text-sm font-medium transition-all hover:bg-primary hover:text-slate-900">
                                    03:30 PM
                                </button>
                                <button className="cursor-not-allowed rounded-lg border border-primary/20 bg-slate-100 px-2 py-3 text-center text-sm font-medium line-through opacity-50 dark:bg-slate-800">
                                    04:45 PM
                                </button>
                                <button className="rounded-lg border border-primary/20 px-2 py-3 text-center text-sm font-medium transition-all hover:bg-primary hover:text-slate-900">
                                    06:00 PM
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === "details" && (
                <div className="flex flex-col gap-6 pt-6 ">
                    <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            3. Confirm Details
                        </h2>
                        <button
                            onClick={() => setCurrentStep("datetime")}
                            className="flex items-center gap-1 text-sm font-semibold text-primary"
                        >
                            <span className="material-symbols-outlined text-sm">
                                arrow_back
                            </span>
                            Back to Time Slot
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-8 rounded-xl border border-primary/10 bg-white p-6 shadow-sm dark:bg-slate-900 md:grid-cols-2">
                        {/* Summary Card */}
                        <div className="flex flex-col gap-4 rounded-lg bg-background-light p-4 dark:bg-slate-800/50">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                                Booking Summary
                            </h3>
                            <div className="flex items-start gap-4">
                                <div
                                    className="h-20 w-20 shrink-0 rounded-lg bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop')`
                                    }}
                                />
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-slate-100">
                                        Traditional Finnish Sauna
                                    </p>
                                    <p className="text-sm text-slate-500">Duration: 60 min</p>
                                    <p className="mt-1 text-sm font-bold text-primary">$45.00</p>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2 border-t border-primary/10 pt-4 text-sm">
                                <span className="material-symbols-outlined text-base text-primary">
                                    calendar_today
                                </span>
                                <span className="font-medium">Oct 5, 2023 at 11:45 AM</span>
                            </div>
                        </div>

                        {/* User Info Form */}
                        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="form-input h-11 w-full rounded-lg border-primary/20 bg-background-light text-sm focus:border-primary focus:ring-primary dark:bg-slate-800"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+250 (000) 000-0000"
                                    className="form-input h-11 w-full rounded-lg border-primary/20 bg-background-light text-sm focus:border-primary focus:ring-primary dark:bg-slate-800"
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-primary py-3 font-black text-slate-900 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    CONFIRM BOOKING
                                </button>
                                <p className="mt-3 px-4 text-center text-[10px] text-slate-400">
                                    By clicking confirm, you agree to our Terms of Service and
                                    Privacy Policy.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
