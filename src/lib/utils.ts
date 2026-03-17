/**
 * Rwanda-specific formatting utilities
 */

/**
 * Format a number as Rwandan Franc (RWF)
 */
export function formatRWF(amount: number): string {
    return `RWF ${amount.toLocaleString("en-RW")}`;
}

export const formatCurrency = formatRWF;

/**
 * Format a phone number with Rwanda +250 prefix
 */
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("250")) {
        return `+${cleaned}`;
    }
    if (cleaned.startsWith("0")) {
        return `+250${cleaned.slice(1)}`;
    }
    return `+250${cleaned}`;
}

/**
 * Format a date for CAT (Central Africa Time)
 */
export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en-RW", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "Africa/Kigali",
    });
}

/**
 * Format a date and time for CAT
 */
export function formatDateTime(date: Date | string): string {
    return new Date(date).toLocaleString("en-RW", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Kigali",
    });
}

/**
 * Get a relative time string (e.g., "5m ago")
 */
export function getTimeAgo(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

/**
 * Generate a unique client QR code string
 */
export function generateQRCodeValue(clientId: string, branchId: string): string {
    return `SSE:${branchId}:${clientId}`;
}

/**
 * Parse a QR code value back to its components
 */
export function parseQRCodeValue(qr: string): { branchId: string; clientId: string } | null {
    const parts = qr.split(":");
    if (parts.length !== 3 || parts[0] !== "SSE") return null;
    return { branchId: parts[1], clientId: parts[2] };
}
