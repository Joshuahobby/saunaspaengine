const PAWAPAY_BASE_URL = process.env.PAWAPAY_BASE_URL ?? "https://api.sandbox.pawapay.io";
const PAWAPAY_API_KEY = process.env.PAWAPAY_API_KEY ?? "";
const PAWAPAY_CALLBACK_URL = process.env.PAWAPAY_CALLBACK_URL ?? "";

export type Correspondent = "MTN_MOMO_RWA" | "AIRTEL_RWA";

export interface PawapayDepositRequest {
    depositId: string;
    amount: string;
    currency: string;
    correspondent: Correspondent;
    payer: {
        type: "MSISDN";
        address: { value: string };
    };
    customerTimestamp: string;
    statementDescription: string;
    callbackUrl?: string;
}

export interface PawapayDepositResponse {
    depositId: string;
    status: "ACCEPTED" | "REJECTED";
    rejectionReason?: { rejectionCode: string; rejectionMessage: string };
}

export interface PawapayWebhookPayload {
    depositId: string;
    status: "COMPLETED" | "FAILED";
    amount: string;
    currency: string;
    correspondent: Correspondent;
    payer: { type: string; address: { value: string } };
    failureReason?: { failureCode: string; failureMessage: string };
    metadata?: Record<string, unknown>;
}

/** Detect the Rwanda MoMo correspondent from a phone number string. */
export function detectCorrespondent(phone: string): Correspondent | null {
    const digits = phone.replace(/[\s+\-()]/g, "");
    // Normalise to local 9-digit form: strip leading 250 if present, strip leading 0
    const local = digits.startsWith("250") ? digits.slice(3)
        : digits.startsWith("0") ? digits.slice(1)
        : digits;

    if (local.startsWith("78") || local.startsWith("79")) return "MTN_MOMO_RWA";
    if (local.startsWith("72") || local.startsWith("73")) return "AIRTEL_RWA";
    return null;
}

/** Normalise any Rwanda phone format to E.164 (25078XXXXXXX). */
export function normalizePhone(phone: string): string {
    const digits = phone.replace(/[\s+\-()]/g, "");
    if (digits.startsWith("250")) return digits;
    if (digits.startsWith("0")) return "250" + digits.slice(1);
    return "250" + digits;
}

/** Initiate a PawaPay deposit (push-payment to subscriber). */
export async function createDeposit(
    depositId: string,
    amountRwf: number,
    phone: string,
    correspondent: Correspondent,
    description: string,
): Promise<PawapayDepositResponse> {
    const body: PawapayDepositRequest = {
        depositId,
        amount: String(Math.round(amountRwf)),
        currency: process.env.PAWAPAY_CURRENCY ?? "RWF",
        correspondent,
        payer: {
            type: "MSISDN",
            address: { value: normalizePhone(phone) },
        },
        customerTimestamp: new Date().toISOString(),
        statementDescription: description.slice(0, 22), // PawaPay max 22 chars
        ...(PAWAPAY_CALLBACK_URL ? { callbackUrl: PAWAPAY_CALLBACK_URL } : {}),
    };

    const res = await fetch(`${PAWAPAY_BASE_URL}/deposits`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${PAWAPAY_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`PawaPay ${res.status}: ${text}`);
    }

    return res.json() as Promise<PawapayDepositResponse>;
}

/** Poll the status of an existing deposit. */
export async function getDeposit(depositId: string): Promise<{ depositId: string; status: string }> {
    const res = await fetch(`${PAWAPAY_BASE_URL}/deposits/${depositId}`, {
        headers: { Authorization: `Bearer ${PAWAPAY_API_KEY}` },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`PawaPay ${res.status}: ${text}`);
    }

    return res.json() as Promise<{ depositId: string; status: string }>;
}
