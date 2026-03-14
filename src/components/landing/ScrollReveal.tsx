"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface ScrollRevealProps {
    children: React.ReactNode;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
    className?: string;
}

export function ScrollReveal({
    children,
    direction = "up",
    delay = 0,
    duration = 0.5,
    className = "",
}: ScrollRevealProps) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
        rootMargin: "-50px 0px",
    });

    const getInitialStyles = () => {
        switch (direction) {
            case "up":
                return { opacity: 0, y: 50 };
            case "down":
                return { opacity: 0, y: -50 };
            case "left":
                return { opacity: 0, x: 50 };
            case "right":
                return { opacity: 0, x: -50 };
            default:
                return { opacity: 0, y: 50 };
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={getInitialStyles()}
            animate={
                inView
                    ? { opacity: 1, x: 0, y: 0 }
                    : getInitialStyles()
            }
            transition={{
                duration: duration,
                delay: delay,
                ease: "easeOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
