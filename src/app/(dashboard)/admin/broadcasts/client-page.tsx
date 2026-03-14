"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Broadcast {
    id: string;
    subject: string;
    content: string;
    audience: string;
    intensity: "SERENE" | "URGENT";
    createdAt: string | Date;
    author: {
        fullName: string;
    };
    reach: number;
    status: "SENT" | "PENDING" | "DRAFT";
}

const INITIAL_BROADCASTS: Broadcast[] = [
    {
        id: "b1",
        subject: "Platform Maintenance - Oct 12",
        content: "We will be performing routine system maintenance on all nodes in the Northern region.",
        audience: "Region: North",
        intensity: "SERENE",
        createdAt: new Date().toISOString(),
        author: { fullName: "System Admin" },
        reach: 240,
        status: "SENT"
    },
    {
        id: "b2",
        subject: "New Yield Metrics Active",
        content: "The refined yield calculation engine is now live. Please review your updated analytics.",
        audience: "All Businesses",
        intensity: "SERENE",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        author: { fullName: "Yield Warden" },
        reach: 842,
        status: "SENT"
    }
];

export default function AdminBroadcastsClientPage() {
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>(INITIAL_BROADCASTS);
    const [viewMode, setViewMode] = useState<"compose" | "archives">("compose");
    
    const [audience, setAudience] = useState("All Businesses");
    const [intensity, setIntensity] = useState<"SERENE" | "URGENT">("SERENE");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [sent, setSent] = useState(false);

    function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!subject.trim() || !content.trim()) return;

        const newBroadcast: Broadcast = {
            id: `b${Date.now()}`,
            subject,
            content,
            audience,
            intensity,
            createdAt: new Date().toISOString(),
            author: { fullName: "System Admin" },
            reach: Math.floor(Math.random() * 500) + 50,
            status: "SENT"
        };

        setBroadcasts(prev => [newBroadcast, ...prev]);
        setSubject("");
        setContent("");
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    }

    return (
        <div className="flex flex-col gap-8 px-4 lg:px-6 py-6 max-w-[1600px] mx-auto w-full">
            {/* Transmission Hub Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[var(--border-muted)] pb-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
                
                <div className="space-y-1 relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-serif font-bold text-white italic tracking-tight leading-tight">
                        Transmission <span className="text-[var(--color-primary)]">Hub</span>
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] font-medium opacity-60 italic">Global resonance distribution across the vessel network.</p>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center gap-2 p-1 bg-black/30 rounded-xl border border-[var(--border-muted)]">
                        {(["compose", "archives"] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all ${viewMode === mode ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20" : "text-[var(--text-muted)] hover:text-white"}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                    
                    <button className="px-6 py-2.5 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-2 group/ledger">
                         <span className="material-symbols-outlined text-sm">auto_stories</span>
                         Recruitment Ledger
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === "compose" ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 xl:grid-cols-12 gap-8"
                    >
                        {/* Composer Section */}
                        <div className="xl:col-span-8 space-y-8">
                            <div className="rounded-[2rem] border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-10 backdrop-blur-md shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-[0.03] rounded-full blur-[80px] pointer-events-none" />
                                
                                <form onSubmit={handleSend} className="space-y-8 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40 ml-2 italic">Audience Spectrum</label>
                                            <div className="relative group/sel">
                                                <select 
                                                    title="Target Audience"
                                                    aria-label="Target Audience Selection"
                                                    value={audience} 
                                                    onChange={e => setAudience(e.target.value)} 
                                                    className="w-full h-14 bg-black/20 border border-[var(--border-muted)] rounded-2xl px-6 text-[11px] font-black text-white uppercase tracking-widest outline-none appearance-none hover:border-[var(--color-primary)]/40 transition-all cursor-pointer"
                                                >
                                                    <option>All Collective Nodes</option>
                                                    <option>Legacy Tiers Only</option>
                                                    <option>High-Yield Vessels</option>
                                                    <option>Fragment: North Celestial</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-hover/sel:text-[var(--color-primary)] pointer-events-none transition-colors italic">unfold_more</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40 ml-2 italic">Intensity Level</label>
                                            <div className="flex gap-4 h-14">
                                                <button 
                                                    type="button"
                                                    onClick={() => setIntensity("SERENE")}
                                                    className={`flex-1 flex items-center justify-center gap-3 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${intensity === "SERENE" ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/40 text-[var(--color-primary)] shadow-sm" : "bg-black/20 border-[var(--border-muted)] text-[var(--text-muted)] hover:border-[var(--color-primary)]/20 hover:text-white"}`}
                                                >
                                                    <span className="material-symbols-outlined text-lg">waves</span> Serene
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setIntensity("URGENT")}
                                                    className={`flex-1 flex items-center justify-center gap-3 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${intensity === "URGENT" ? "bg-rose-500/10 border-rose-500/40 text-rose-500 shadow-sm" : "bg-black/20 border-[var(--border-muted)] text-[var(--text-muted)] hover:border-rose-500/20 hover:text-rose-500"}`}
                                                >
                                                    <span className="material-symbols-outlined text-lg">potted_plant</span> Urgent
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40 ml-2 italic">Transmission Subject</label>
                                        <input 
                                            value={subject}
                                            onChange={e => setSubject(e.target.value)}
                                            placeholder="Archetype Synchronization..."
                                            className="w-full h-14 bg-black/20 border border-[var(--border-muted)] rounded-2xl px-6 text-sm font-serif font-bold text-white italic outline-none hover:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40 ml-2 italic">Signal Content</label>
                                        <div className="rounded-[2rem] border border-[var(--border-muted)] bg-black/10 overflow-hidden focus-within:border-[var(--color-primary)]/40 transition-all p-1">
                                            <div className="flex items-center gap-2 p-3 border-b border-[var(--border-muted)]/50">
                                                {["format_bold", "format_italic", "format_list_bulleted", "link", "attachment"].map((icon) => (
                                                    <button key={icon} type="button" className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all">
                                                        <span className="material-symbols-outlined text-lg font-bold">{icon}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea 
                                                value={content}
                                                onChange={e => setContent(e.target.value)}
                                                rows={8}
                                                placeholder="Begin transmission of platform insights..."
                                                className="w-full bg-transparent p-6 text-base font-serif font-medium text-white/80 italic outline-none resize-none leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-[var(--border-muted)]/50">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--color-primary)] cursor-pointer transition-colors group/opt">
                                                <span className="material-symbols-outlined text-lg font-bold">schedule</span>
                                                <span className="text-[8px] font-black uppercase tracking-widest italic border-b border-transparent group-hover/opt:border-current">Delayed Broadcast</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--color-primary)] cursor-pointer transition-colors group/opt">
                                                <span className="material-symbols-outlined text-lg font-bold">visibility</span>
                                                <span className="text-[8px] font-black uppercase tracking-widest italic border-b border-transparent group-hover/opt:border-current">Signal Preview</span>
                                            </div>
                                        </div>

                                        <button 
                                            disabled={!subject.trim() || !content.trim()}
                                            className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl ${sent ? "bg-emerald-500 text-white" : "bg-white text-black hover:scale-[1.05] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"}`}
                                        >
                                            {sent ? (
                                                <>Signal Dispersed <span className="material-symbols-outlined text-base">task_alt</span></>
                                            ) : (
                                                <>Initiate Broadcast <span className="material-symbols-outlined text-lg font-black group-hover:translate-x-1 transition-transform italic">sensors</span></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Quick Metrics sidebar */}
                        <div className="xl:col-span-4 space-y-8">
                             <div className="rounded-[2rem] border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-8 shadow-sm backdrop-blur-md relative overflow-hidden group">
                                <h3 className="text-xl font-serif font-bold text-white italic mb-8 border-b border-[var(--border-muted)] pb-5">Signal Resonance</h3>
                                <div className="space-y-8">
                                    <ResonanceCard label="Total Reach" value="1,248" sub="Global Nodes" icon="groups_3" />
                                    <ResonanceCard label="Engagement" value="94.2%" sub="Sync Rate" icon="query_stats" />
                                    <ResonanceCard label="Signal Health" value="Optimal" sub="Low Latency" icon="verified" />
                                </div>
                             </div>

                             <div className="rounded-[2rem] border-2 border-dashed border-[var(--border-muted)] p-10 flex flex-col items-center text-center gap-6 hover:border-[var(--color-primary)]/40 transition-all hover:bg-[var(--color-primary)]/[0.02]">
                                <div className="size-16 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-primary)] shadow-inner">
                                    <span className="material-symbols-outlined text-3xl font-bold">bolt</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-serif font-black text-white italic">Urgent Override</h4>
                                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40 mt-1 italic">Bypass standard distribution cycles for immediate node alert.</p>
                                </div>
                                <button className="w-full py-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-500/20 transition-all">
                                    Activate High-Intensity Signal
                                </button>
                             </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="rounded-[2rem] border border-[var(--border-muted)] bg-[var(--bg-card)]/40 overflow-hidden shadow-sm backdrop-blur-md"
                    >
                        <div className="p-10 border-b border-[var(--border-muted)] flex justify-between items-center bg-black/10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-serif font-bold text-white italic">Transmission Archives</h3>
                                <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40 italic">Historical mapping of platform communication resonance.</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-5 py-2.5 rounded-xl border border-[var(--border-muted)] bg-black/20 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-all">
                                    Filter by Audience
                                </button>
                                <button className="px-5 py-2.5 rounded-xl border border-[var(--border-muted)] bg-black/20 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-all">
                                    Export Logs
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[var(--border-muted)]/50 bg-black/5">
                                        {["Signal Spectrum", "Target Hub", "Impact", "Timing", "Status", "Actions"].map((h) => (
                                            <th key={h} className="px-10 py-5 text-left text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50 italic">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-muted)]/50 text-white">
                                    {broadcasts.map((b) => (
                                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="size-10 rounded-xl bg-[var(--bg-surface-muted)]/20 border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                                                        <span className="material-symbols-outlined text-xl font-black italic">{b.intensity === 'URGENT' ? 'bolt' : 'sensors'}</span>
                                                    </div>
                                                    <span className="text-sm font-serif font-bold italic group-hover:text-[var(--color-primary)] transition-colors">{b.subject}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest italic">{b.audience}</td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black italic text-[var(--color-primary)]">{b.reach}</span>
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Recipients</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-[10px] font-black text-white/50 italic">{formatDateTime(b.createdAt)}</td>
                                            <td className="px-10 py-6">
                                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[7px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <button className="p-2 h-9 w-9 rounded-xl bg-black/20 border border-white/5 text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-all">
                                                    <span className="material-symbols-outlined text-sm italic">open_in_new</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ResonanceCard({ label, value, sub, icon }: { label: string, value: string, sub: string, icon: string }) {
    return (
        <div className="flex items-center gap-5 group cursor-default">
            <div className="size-14 rounded-2xl bg-black/20 border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                <span className="material-symbols-outlined text-2xl font-black italic">{icon}</span>
            </div>
            <div className="flex flex-col gap-0.5">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-30 italic leading-none">{label}</p>
                <h4 className="text-2xl font-serif font-black text-white italic tracking-tighter leading-none">{value}</h4>
                <p className="text-[10px] font-bold text-[var(--color-primary)] opacity-60 italic leading-none mt-1">{sub}</p>
            </div>
        </div>
    );
}
