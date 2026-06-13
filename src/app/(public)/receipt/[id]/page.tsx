import Link from "next/link";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="flex flex-col items-center gap-8 py-8">
            {/* Success Notification */}
            <div className="flex w-full items-center justify-between rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg">
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--text-main)]">
                            Booking Confirmed
                        </h3>
                        <p className="text-sm font-medium text-[var(--color-primary)]">
                            Receipt sent to your registered email
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 text-[var(--color-primary)]">
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors" aria-label="Print receipt">
                        <span className="material-symbols-outlined">print</span>
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors" aria-label="Share receipt">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div>

            {/* Main Receipt Card */}
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] shadow-xl">
                {/* Receipt Header */}
                <div className="flex flex-col items-center border-b border-dashed border-[var(--border-muted)] bg-[var(--bg-surface-muted)] p-8 text-center">
                    <div className="mb-4 text-[var(--color-primary)]">
                        <span className="material-symbols-outlined text-4xl">spa</span>
                    </div>
                    <h2 className="mb-1 text-2xl font-black text-[var(--text-main)]">
                        Sauna SPA Engine
                    </h2>
                    <p className="text-sm text-[var(--text-muted)]">Kigali, Rwanda</p>
                    <p className="text-sm text-[var(--text-muted)]">+250 793 895 236</p>

                    <div className="mt-6 w-full rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] p-3">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            Receipt Number
                        </p>
                        <p className="font-mono text-lg font-bold text-[var(--text-main)]">
                            #REC-{id || "0000-XXX"}
                        </p>
                    </div>
                </div>

                {/* Receipt Content */}
                <div className="flex flex-col gap-6 p-8">
                    <div className="flex justify-between text-sm">
                        <div className="flex flex-col gap-1 text-[var(--text-muted)]">
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                Date &amp; Time
                            </span>
                            <span className="font-medium text-[var(--text-main)]">
                                {new Date().toLocaleDateString("en-RW", { dateStyle: "long" })}
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-[var(--text-muted)]">
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                Status
                            </span>
                            <span className="font-medium text-[var(--color-primary)]">Confirmed</span>
                        </div>
                    </div>

                    <div className="my-2 border-t border-dashed border-[var(--border-muted)]"></div>

                    {/* Items List */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-[var(--text-main)]">Traditional Finnish Sauna</p>
                                <p className="text-sm text-[var(--text-muted)]">60 Min Session</p>
                            </div>
                            <p className="font-bold text-[var(--text-main)]">RWF 45,000</p>
                        </div>
                    </div>

                    <div className="my-2 border-t border-dashed border-[var(--border-muted)]"></div>

                    {/* Totals */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm text-[var(--text-muted)]">
                            <span>Subtotal</span>
                            <span>RWF 45,000</span>
                        </div>
                        <div className="flex justify-between text-sm text-[var(--text-muted)]">
                            <span>Tax (18%)</span>
                            <span>RWF 8,100</span>
                        </div>
                        <div className="mt-2 flex justify-between text-lg font-black text-[var(--text-main)]">
                            <span>Total Paid</span>
                            <span className="text-[var(--color-primary)]">RWF 53,100</span>
                        </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-[var(--bg-surface-muted)] p-4 text-center">
                        <p className="text-xs text-[var(--text-muted)]">
                            Paid via <strong className="text-[var(--text-main)]">Mobile Money (MoMo)</strong>
                            <br />
                            Ref: TXN-{id?.slice(0, 9).toUpperCase() || "XXXXXXXXX"}
                        </p>
                    </div>
                </div>
            </div>

            <Link
                href="/booking"
                className="text-sm font-bold text-[var(--text-muted)] transition-colors hover:text-[var(--color-primary)]"
            >
                Return to Booking
            </Link>
        </div>
    );
}
