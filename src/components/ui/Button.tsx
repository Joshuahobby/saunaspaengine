"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "default" | "lg";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "href"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: ReactNode;
    href?: string;
}

const baseStyles =
    "inline-flex items-center justify-center font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100";

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-[var(--color-primary)] text-white hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/10",
    secondary:
        "bg-[var(--bg-surface-muted)] text-[var(--text-muted)] border border-[var(--border-muted)] hover:text-[var(--text-main)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--bg-surface)]",
    ghost:
        "bg-transparent text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]",
    danger:
        "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-[9px] gap-1.5",
    default: "h-9 px-4 text-[10px] gap-2",
    lg: "h-11 px-6 text-[11px] gap-2.5",
};

function Inner({
    loading,
    icon,
    children,
    variant,
    size,
    className,
}: {
    loading?: boolean;
    icon?: ReactNode;
    children?: ReactNode;
    variant: ButtonVariant;
    size: ButtonSize;
    className?: string;
}) {
    return (
        <>
            {loading ? (
                <Loader2 className="animate-spin size-3.5 shrink-0" />
            ) : (
                icon
            )}
            {children}
        </>
    );
}

const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
    ({ variant = "primary", size = "default", loading, icon, href, children, className, disabled, ...props }, ref) => {
        const cls = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className ?? ""}`;

        if (href) {
            return (
                <Link
                    ref={ref}
                    href={href}
                    className={cls}
                    {...(props as Record<string, unknown>)}
                >
                    <Inner loading={loading} icon={icon} variant={variant} size={size} className={className}>
                        {children}
                    </Inner>
                </Link>
            );
        }

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cls}
                {...props}
            >
                <Inner loading={loading} icon={icon} variant={variant} size={size} className={className}>
                    {children}
                </Inner>
            </button>
        );
    }
);

Button.displayName = "Button";
export { Button };
