"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Step0Welcome } from "./steps/Step0Welcome";
import { Step1Profile } from "./steps/Step1Profile";
import { Step2Services } from "./steps/Step2Services";
import { Step3Team } from "./steps/Step3Team";
import { Step4Launch } from "./steps/Step4Launch";
import { motion, AnimatePresence } from "framer-motion";
import { updateOnboardingStepAction } from "./actions";
import { PaymentForm } from "@/app/signup/payment/PaymentForm";

interface OnboardingClientProps {
    branch: {
        id: string;
        name: string | null;
        email: string | null;
        logo: string | null;
        address: string | null;
        phone: string | null;
        businessHours: any;
        services?: any[];
        employees?: any[];
        business: {
            subscriptionStatus: string | null;
            subscriptionPlan: { name: string; priceMonthly: number; priceYearly: number; } | null;
            subscriptionCycle: string | null;
        } | null;
    };
    initialStep: number;
    paymentPending?: boolean;
    userEmail: string;
}

export function OnboardingClient({ branch, initialStep, paymentPending = false, userEmail }: OnboardingClientProps) {
    const [step, setStep] = useState(initialStep);
    const [saving, setSaving] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const router = useRouter();

    const steps = [
        { id: 0, title: "Welcome", icon: "celebration" },
        { id: 1, title: "Profile", icon: "storefront" },
        { id: 2, title: "Services", icon: "spa" },
        { id: 3, title: "Team", icon: "badge" },
        { id: 4, title: "Launch", icon: "rocket_launch" },
    ];

    const handleStepChange = async (newStep: number) => {
        setSaving(true);
        try {
            await updateOnboardingStepAction(branch.id, newStep);
            setStep(newStep);
        } catch (error) {
            console.error("Failed to sync progress:", error);
            // Fallback to local state if sync fails
            setStep(newStep);
        } finally {
            setSaving(false);
        }
    };

    const nextStep = () => {
        if (step < steps.length - 1) {
            handleStepChange(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 0) {
            handleStepChange(step - 1);
        }
    };

    const amount = branch.business?.subscriptionCycle === "Yearly" 
        ? branch.business?.subscriptionPlan?.priceYearly ?? 0
        : branch.business?.subscriptionPlan?.priceMonthly ?? 0;

    return (
        <div className="flex-1 h-full flex flex-col items-center py-12 px-6 overflow-y-auto relative">
            {saving && (
                <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--color-primary)]/20 z-[200]">
                    <div className="h-full bg-[var(--color-primary)] animate-[shimmer_2s_infinite] w-[30%]"></div>
                </div>
            )}
            
            <div className="w-full max-w-[960px] flex flex-col gap-12">
                {/* Unified Payment/Verification Banner */}
                {paymentPending && (step === 0 || step === 4 || showPayment) && (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-6 py-4 shadow-sm">
                            <span className="material-symbols-outlined text-amber-500 text-2xl mt-0.5 shrink-0">pending_actions</span>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-amber-600 dark:text-amber-400 text-sm">Action Required: Activate Your Account</p>
                                <p className="text-amber-700 dark:text-amber-300 text-xs font-medium mt-1 opacity-80 leading-relaxed">
                                    Your branch setup is in progress. To go live and accept real bookings, please complete your subscription payment. You can continue configuring your branch below.
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowPayment(!showPayment)}
                                className="shrink-0 h-10 px-4 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">{showPayment ? "close" : "payments"}</span>
                                {showPayment ? "Hide Fix" : "Pay Now"}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showPayment && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="max-w-[540px] mx-auto">
                                        <PaymentForm 
                                            email={userEmail || branch.email || ""}
                                            amount={amount}
                                            plan={branch.business?.subscriptionPlan?.name || "Plan"}
                                            cycle={branch.business?.subscriptionCycle || "Monthly"}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Stepper Header */}
                <div className="flex items-center justify-between relative px-2">
                    {/* Background Progress Bar */}
                    <div className="absolute top-[21px] left-0 right-0 h-0.5 bg-[var(--border-muted)]/50 -z-10 mx-10">
                        <motion.div 
                            initial={{ width: `${(initialStep / (steps.length - 1)) * 100}%` }}
                            animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                            className="h-full bg-[var(--color-primary)] shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.3)]"
                        />
                    </div>

                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => { if (s.id < step) handleStepChange(s.id); }}>
                            <div className={`size-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 
                                ${step === s.id ? 'border-[var(--color-primary)] bg-[var(--bg-app)] shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]' : 
                                  step > s.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--bg-app)]' : 
                                  'border-[var(--border-muted)] bg-[var(--bg-card)] text-[var(--text-muted)]'}`}>
                                <span className={`material-symbols-outlined !text-xl ${step === s.id ? 'text-[var(--color-primary)]' : ''}`}>
                                    {step > s.id ? 'check' : s.icon}
                                </span>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500
                                ${step === s.id ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)] opacity-50 font-medium'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step Content with Animation */}
                <div className="flex-1 min-h-[500px] flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex-1"
                        >
                            {step === 0 && <Step0Welcome branch={branch as any} onNext={nextStep} />}
                            {step === 1 && <Step1Profile branch={branch} onNext={nextStep} onPrev={prevStep} />}
                            {step === 2 && <Step2Services branch={branch} onNext={nextStep} onPrev={prevStep} />}
                            {step === 3 && <Step3Team branch={branch} onNext={nextStep} onPrev={prevStep} />}
                            {step === 4 && <Step4Launch branch={branch} onPrev={prevStep} onNext={() => router.push('/dashboard')} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
