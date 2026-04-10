import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function AnalyticsTab() {
    const session = await auth();
    if (!session?.user?.branchId) return null;

    const [staffCount, roleCount] = await Promise.all([
        prisma.employee.count({ where: { branchId: session.user.branchId, status: "ACTIVE" } }),
        prisma.employeeCategory.count({ where: { branchId: session.user.branchId } }),
    ]);

    // Role distribution (mock for now or aggregated)
    const distribution = [
        { role: "Therapists", count: Math.ceil(staffCount * 0.6), color: "bg-[var(--color-primary)]" },
        { role: "Front Desk", count: Math.ceil(staffCount * 0.2), color: "bg-blue-500" },
        { role: "Housekeeping", count: Math.ceil(staffCount * 0.2), color: "bg-emerald-500" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
            {/* High Level Stats */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-10 rounded-[3rem] border border-[var(--border-muted)] space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Professional Retention</p>
                    <p className="text-5xl font-black">94<span className="text-2xl opacity-40">%</span></p>
                    <div className="h-1.5 w-full bg-[var(--bg-surface-muted)] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[94%]" />
                    </div>
                </div>
                <div className="glass-card p-10 rounded-[3rem] border border-[var(--border-muted)] space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Avg. Session Rating</p>
                    <p className="text-5xl font-black">4.9</p>
                    <div className="flex gap-1 text-yellow-500">
                        {Array(5).fill(0).map((_, i) => <span key={i} className="material-symbols-outlined font-black text-sm">Star</span>)}
                    </div>
                </div>
                <div className="glass-card p-10 rounded-[3rem] border border-[var(--border-muted)] space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Internal Promotion Rate</p>
                    <p className="text-5xl font-black">12<span className="text-2xl opacity-40">%</span></p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">YTD GROWTH</p>
                </div>
            </div>

            {/* Role Distribution Chart (Visual Representation) */}
            <div className="lg:col-span-7 glass-card p-12 rounded-[3.5rem] border border-[var(--border-muted)] space-y-12">
                <div className="space-y-2">
                    <h3 className="text-3xl font-serif font-black">Role <span className="text-[var(--color-primary)]">Density.</span></h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Personnel weight across service categories</p>
                </div>

                <div className="space-y-10">
                    {distribution.map((item) => (
                        <div key={item.role} className="space-y-4">
                            <div className="flex justify-between items-end px-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-main)]">{item.role}</span>
                                <span className="text-xs font-black opacity-40">{item.count} Staff</span>
                            </div>
                            <div className="h-3 w-full bg-[var(--bg-surface-muted)]/50 rounded-full overflow-hidden border border-[var(--border-muted)] group">
                                <div className={`h-full ${item.color} rounded-full transition-all duration-1000 group-hover:brightness-125`} style={{ width: `${(item.count / staffCount) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strategic Insights Card */}
            <div className="lg:col-span-5 glass-card p-12 rounded-[3.5rem] border border-[var(--border-muted)] bg-[var(--text-main)] text-[var(--bg-app)] flex flex-col justify-between">
                <div className="space-y-6">
                    <div className="size-16 rounded-[1.5rem] bg-[var(--color-primary)] flex items-center justify-center text-[var(--bg-app)]">
                         <span className="material-symbols-outlined text-4xl font-black">electric_bolt</span>
                    </div>
                    <h3 className="text-3xl font-serif font-black tracking-tighter">Strategic <br /> Workforce Plan.</h3>
                    <p className="text-sm font-bold opacity-60 leading-relaxed">
                        "Your current staffing levels for 'Sauna Specialists' are at 85% capacity. To maintain elite service standards during peak evening hours, consider onboarding 2 additional contractors."
                    </p>
                </div>

                <button className="h-16 w-full rounded-2xl bg-[var(--color-primary)] text-[var(--bg-app)] font-black uppercase tracking-widest text-[10px] mt-12 hover:scale-[1.02] transition-all">
                    Generate HR Report
                </button>
            </div>
        </div>
    );
}
