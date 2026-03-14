"use client";
import React from "react";

export default function QRSecurityPage() {
    return (
        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
            <div className="mb-8"><nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2"><span>Settings</span><span>/</span><span className="text-[var(--text-main)]">QR Security &amp; Access</span></nav><h1 className="text-3xl font-black tracking-tight">QR Security &amp; Access Management</h1><p className="text-[var(--text-muted)]">Control how QR codes are generated, validated, and secured across all your branches.</p></div>
            <div className="flex flex-col gap-8">
                <section className="glass-card rounded-xl border border-[var(--border-muted)] p-6">
                    <div className="flex items-center gap-2 border-b border-[var(--border-muted)] pb-4 mb-6"><span className="material-symbols-outlined text-[var(--color-primary)]">qr_code_2</span><h2 className="text-xl font-bold">QR Code Configuration</h2></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2"><label htmlFor="expiry-policy" className="text-sm font-bold text-[var(--text-muted)]">Code Expiry Policy</label><select id="expiry-policy" title="Code Expiry Policy" aria-label="Select QR code expiry policy" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-2"><option>Never Expire</option><option>24 Hours</option><option>7 Days</option><option>30 Days</option><option>Per Session</option></select><p className="text-xs text-[var(--text-muted)]">When QR codes will automatically invalidate.</p></div>
                        <div className="flex flex-col gap-2"><label htmlFor="scan-limit" className="text-sm font-bold text-[var(--text-muted)]">Scan Limit per Code</label><select id="scan-limit" title="Scan Limit per Code" aria-label="Select scan limit per QR code" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-2"><option>Unlimited</option><option>1 Scan Only</option><option>5 Scans</option><option>10 Scans</option></select><p className="text-xs text-[var(--text-muted)]">Maximum number of successful scans permitted per code.</p></div>
                        <div className="flex flex-col gap-2"><label htmlFor="code-format" className="text-sm font-bold text-[var(--text-muted)]">Code Format</label><select id="code-format" title="Code Format" aria-label="Select QR code encoding format" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-2"><option>Standard QR</option><option>Micro QR</option><option>Encrypted QR (AES-256)</option></select><p className="text-xs text-[var(--text-muted)]">Encoding standard for generated QR codes.</p></div>
                        <div className="flex flex-col gap-2"><label htmlFor="error-correction" className="text-sm font-bold text-[var(--text-muted)]">Error Correction Level</label><select id="error-correction" title="Error Correction Level" aria-label="Select QR code error correction level" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-2"><option>Low (7%)</option><option>Medium (15%)</option><option>Quartile (25%)</option><option>High (30%)</option></select><p className="text-xs text-[var(--text-muted)]">Higher levels allow more damage tolerance.</p></div>
                    </div>
                </section>
                <section className="glass-card rounded-xl border border-[var(--border-muted)] p-6">
                    <div className="flex items-center gap-2 border-b border-[var(--border-muted)] pb-4 mb-6"><span className="material-symbols-outlined text-[var(--color-primary)]">security</span><h2 className="text-xl font-bold">Access Security</h2></div>
                    <div className="space-y-4">
                        {[
                            { title: "Anti-Screenshot Protection", desc: "Overlay a dynamic watermark on digital QR cards to prevent sharing.", active: true },
                            { title: "Geo-Fencing Validation", desc: "Only accept QR scans within 100m of a registered branch location.", active: false },
                            { title: "Device Binding", desc: "Lock QR codes to a single registered mobile device per member.", active: true },
                            { title: "Offline Mode Fallback", desc: "Allow check-ins when connectivity is lost (syncs when online).", active: true },
                        ].map(t => (
                            <div key={t.title} className="flex items-center justify-between p-4 bg-[var(--bg-surface-muted)]/10 rounded-lg">
                                <div><span className="text-sm font-bold">{t.title}</span><p className="text-xs text-[var(--text-muted)]">{t.desc}</p></div>
                                <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${t.active ? "bg-[var(--color-primary)]" : "bg-[var(--bg-surface-muted)]/50"}`}><div className={`absolute top-0.5 size-4 bg-white rounded-full transition-transform shadow-sm ${t.active ? "translate-x-4" : "translate-x-0.5"}`}></div></div>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="glass-card rounded-xl border border-[var(--border-muted)] p-6">
                    <div className="flex items-center gap-2 border-b border-[var(--border-muted)] pb-4 mb-6"><span className="material-symbols-outlined text-[var(--color-primary)]">history</span><h2 className="text-xl font-bold">Recent Scan Activity</h2></div>
                    <div className="space-y-3">
                        {[
                            { user: "Alex K.", action: "Check-in via QR #SSA-88219-PL", time: "2 min ago", status: "success" },
                            { user: "Maria S.", action: "Rejected — Expired QR Code", time: "15 min ago", status: "error" },
                            { user: "Tom W.", action: "Check-in via QR #SSA-55291-SL", time: "22 min ago", status: "success" },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-[var(--border-muted)] last:border-0">
                                <div className="flex items-center gap-3"><div className={`size-2 rounded-full ${s.status === "success" ? "bg-green-500" : "bg-red-500"}`}></div><div><p className="text-sm font-medium">{s.user}</p><p className="text-xs text-[var(--text-muted)]">{s.action}</p></div></div>
                                <span className="text-xs text-[var(--text-muted)]">{s.time}</span>
                            </div>
                        ))}
                    </div>
                </section>
                <div className="flex items-center justify-end gap-4 pb-10"><button className="px-6 py-2.5 rounded-lg border border-[var(--border-muted)] font-bold hover:bg-[var(--bg-surface-muted)]/50 transition-colors">Reset to Defaults</button><button className="px-8 py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--bg-app)] font-bold hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/20 transition-all">Save Security Settings</button></div>
            </div>
        </main>
    );
}
