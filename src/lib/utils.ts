/**
 * Rwanda-specific formatting utilities
 */

/**
 * Format a number as Rwandan Franc (RWF)
 */
export function formatRWF(amount: number): string {
    return `RWF ${amount.toLocaleString("en-RW")}`;
}

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
 * Generate a unique client QR code string
 */
export function generateQRCodeValue(clientId: string, businessId: string): string {
    return `SSE:${businessId}:${clientId}`;
}

/**
 * Parse a QR code value back to its components
 */
export function parseQRCodeValue(qr: string): { businessId: string; clientId: string } | null {
    const parts = qr.split(":");
    if (parts.length !== 3 || parts[0] !== "SSE") return null;
    return { businessId: parts[1], clientId: parts[2] };
}
