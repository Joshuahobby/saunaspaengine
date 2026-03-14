import Link from "next/link";
import { SpaIndicator } from "@/components/ui/spa-indicator";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // In a real app, you would fetch receipt data based on id
    return (
        <div className="flex flex-col items-center gap-8 py-8">
            {/* Success Notification */}
            <div className="flex w-full items-center justify-between rounded-xl border border-primary/20 bg-primary/10 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-slate-900 shadow-[0_0_15px_rgba(43,238,43,0.3)]">
                        <span className="material-symbols-outlined text-xl">
                            check_circle
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">
                            Booking Confirmed
                        </h3>
                        <p className="text-sm font-medium text-primary">
                            Receipt sent to johndoe@example.com
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 text-primary">
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-primary/20">
                        <span className="material-symbols-outlined">print</span>
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-primary/20">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div>

            {/* Main Receipt Card */}
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-xl dark:bg-slate-900">
                {/* Receipt Header */}
                <div className="flex flex-col items-center border-b border-dashed border-primary/20 bg-background-light p-8 text-center dark:bg-slate-800/50">
                    <div className="mb-4 text-primary">
                        <SpaIndicator />
                    </div>
                    <h2 className="mb-1 text-2xl font-black text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">
                        Sauna SPA Engine
                    </h2>
                    <p className="text-sm text-slate-500">123 Wellness Blvd, Cloud City</p>
                    <p className="text-sm text-slate-500">+1 (555) 123-4567</p>

                    <div className="mt-6 w-full rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Receipt Number
                        </p>
                        <p className="font-mono text-lg font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">
                            #REC-{id || "8492-B7X"}
                        </p>
                    </div>
                </div>

                {/* Receipt Content */}
                <div className="flex flex-col gap-6 p-8">
                    <div className="flex justify-between text-sm">
                        <div className="flex flex-col gap-1 text-slate-500">
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                Date & Time
                            </span>
                            <span className="font-medium text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">
                                Oct 24, 2023 • 14:30 PM
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-slate-500">
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                Client
                            </span>
                            <span className="font-medium text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">
                                John Doe
                            </span>
                        </div>
                    </div>

                    <div className="my-2 border-t border-dashed border-slate-200 dark:border-slate-800"></div>

                    {/* Items List */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Traditional Finnish Sauna</p>
                                <p className="text-sm text-slate-500">60 Min Session</p>
                            </div>
                            <p className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">RWF 45,000</p>
                        </div>
                    </div>

                    <div className="my-2 border-t border-dashed border-slate-200 dark:border-slate-800"></div>

                    {/* Totals */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Subtotal</span>
                            <span>RWF 45,000</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Tax (18%)</span>
                            <span>RWF 8,100</span>
                        </div>
                        <div className="mt-2 flex justify-between text-lg font-black text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">
                            <span>Total Paid</span>
                            <span className="text-primary">RWF 53,100</span>
                        </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                        <p className="text-xs text-slate-500">
                            Paid via <strong>Mobile Money (MoMo)</strong>
                            <br />
                            Ref: TXN-998273645
                        </p>
                    </div>
                </div>
            </div>

            <Link
                href="/booking"
                className="text-sm font-bold text-slate-500 transition-colors hover:text-primary"
            >
                Return to Home
            </Link>
        </div>
    );
}
