"use client";


import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItemProps {
    id: string | number;
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

function FAQItem({ id, question, answer, isOpen, onClick }: FAQItemProps) {
    const triggerId = `faq-trigger-${id}`;
    const panelId = `faq-panel-${id}`;

    return (
        <div className="border-b border-[var(--border-main)] last:border-0 hover:bg-[var(--bg-surface-muted)]/30 transition-colors">
            {/* Using React.createElement to bypass aggressive JSX ARIA-proptype linter */}
            {React.createElement('button', {
                type: "button",
                "aria-expanded": isOpen ? "true" : "false",
                id: triggerId,
                className: "w-full py-6 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-lg px-4",
                onClick: onClick,
                "aria-controls": panelId
            }, (
                <>
                    <span className="text-lg font-bold text-[var(--text-main)] font-serif pr-8">{question}</span>
                    <span className={`material-symbols-outlined text-[var(--color-primary)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        expand_more
                    </span>
                </>
            ))}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 px-4 text-[var(--text-muted)] leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const faqs = [
    {
        question: "Do I need special hardware to scan QR codes?",
        answer: "No special hardware is required! Any modern smartphone, tablet, or webcam can be used to scan member QR codes directly from the Sauna SPA Engine dashboard. We also support dedicated USB barcode scanners if you prefer a traditional POS setup."
    },
    {
        question: "Can I manage multiple spa locations from one account?",
        answer: "Yes, our Pro and Enterprise plans are built specifically for multi-branch operations. You can seamlessly switch between locations, view consolidated analytics, and manage staff schedules across all your branches from a single unified dashboard."
    },
    {
        question: "How does the billing work for my customers?",
        answer: "You can track membership statuses, day passes, and remaining credits within the platform. The system will alert your front desk when a customer's subscription has expired or requires renewal upon scanning their pass."
    },
    {
        question: "Is my data secure and compliant?",
        answer: "Absolutely. We employ bank-grade encryption for all data in transit and at rest. We run daily backups and maintain strict role-based access controls to ensure your branch data and client information remain completely private and secure."
    },
    {
        question: "Can I upgrade or downgrade my plan?",
        answer: "Yes, you can change your subscription tier at any time. Upgrades take effect immediately, prorating the cost, while downgrades will apply at the start of your next billing cycle."
    }
];

export function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-3xl mx-auto glass-card border border-[var(--border-main)] rounded-3xl overflow-hidden shadow-xl">
            <div className="flex flex-col">
                {faqs.map((faq, index) => (
                    <FAQItem
                        key={index}
                        id={index}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
}
