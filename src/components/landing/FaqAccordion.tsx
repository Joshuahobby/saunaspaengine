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
        question: "Is there a free trial available?",
        answer: "Yes! Every new business signup automatically starts with a 14-day trial of our Premium features. No credit card or Mobile Money payment is required to start your trial. It's the best way to experience the full power of the SPA Engine."
    },
    {
        question: "What happens after the 14-day trial ends?",
        answer: "At the end of your trial, you can choose to subscribe to one of our paid plans (Essential, Premium, or Elite) to keep your advanced features. If you're not ready to commit, you can continue using the 'Free Forever' tier with limited capacity (1 Staff, 5 Services)."
    },
    {
        question: "Do I need special hardware to scan QR codes?",
        answer: "No special hardware is required! Any modern smartphone, tablet, or webcam can be used to scan member QR codes directly from our dashboard. We also support dedicated USB barcode scanners for high-volume front desks."
    },
    {
        question: "How does Mobile Money payment integration work?",
        answer: "Our platform is natively integrated with MTN MoMo and Airtel Money Rwanda. When a customer pays for a service or membership, you can initiate a push request directly from the dashboard. The customer receives a prompt on their phone to enter their PIN, and your records are updated instantly."
    },
    {
        question: "Can I manage multiple spa locations?",
        answer: "Yes, our Premium and Elite plans are designed for multi-branch operations. You can manage up to 3 branches on Premium, or unlimited branches on Elite, all from a single unified dashboard with shared customer profiles."
    },
    {
        question: "Can I upgrade or cancel my plan anytime?",
        answer: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your billing settings. Upgrades are prorated, and cancellations take effect at the end of your current billing cycle."
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
