"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { 
    User, Phone, Calendar, Edit, Send, Download, 
    CreditCard, Award, Info, ChevronRight,
    Printer, History as LucideHistory, MapPin, Mail, Droplets
} from "lucide-react";
import MembershipCardModal from "@/components/clients/MembershipCardModal";

export default function ClientProfile({ client, activeMembership, loyaltyInfo, tierConfig, visitsThisMonth }: any) {
    const [isCardModalOpen, setCardModalOpen] = useState(false);

    // Provide a unique QR payload for this client (typically URL or ID string)
    const qrCodePayload = `spa-client:${client.id}`;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner ${tierConfig.bg} ${tierConfig.color}`}>
                        {client.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[var(--text-main)] flex items-center gap-2">
                            {client.fullName}
                            {activeMembership && (
                                <span className={`text-xs px-2 py-1 rounded-full border ${tierConfig.bg} ${tierConfig.color} ${tierConfig.border} uppercase font-bold flex items-center gap-1`}>
                                    {tierConfig.icon} {loyaltyInfo?.tier || "BRONZE"}
                                </span>
                            )}
                        </h1>
                        <p className="text-[var(--text-muted)] text-sm mt-1">Client ID: <span className="font-mono text-[var(--text-secondary)]">{client.id}</span></p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setCardModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all font-medium"
                    >
                        <Printer className="w-4 h-4" />
                        Print Card
                    </button>
                    <Link 
                        href={`/clients/${client.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-surface-muted)] text-[var(--text-main)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface-hover)] transition-all font-medium"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Client Details */}
                <div className="space-y-6">
                    <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] p-6">
                        <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-[var(--color-primary)]" />
                            Personal Info
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-[var(--text-muted)] mt-1" />
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] uppercase font-semibold">Phone</p>
                                    <p className="text-[var(--text-main)]">{client.phone}</p>
                                </div>
                            </div>
                            {client.email && (
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-[var(--text-muted)] mt-1" />
                                    <div>
                                        <p className="text-xs text-[var(--text-muted)] uppercase font-semibold">Email</p>
                                        <p className="text-[var(--text-main)]">{client.email}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-[var(--text-muted)] mt-1" />
                                <div>
                                    <p className="text-xs text-[var(--text-muted)] uppercase font-semibold">Joined</p>
                                    <p className="text-[var(--text-main)]">{format(new Date(client.createdAt), 'MMMM d, yyyy')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-color)]">
                            <p className="text-xs text-[var(--text-muted)] uppercase font-bold mb-1">Monthly Visits</p>
                            <p className="text-3xl font-black text-[var(--color-primary)]">{visitsThisMonth}</p>
                        </div>
                        <div className="bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-color)]">
                            <p className="text-xs text-[var(--text-muted)] uppercase font-bold mb-1">Points</p>
                            <p className="text-3xl font-black text-[var(--text-main)]">{loyaltyInfo?.points || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: History & Memberships */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Membership Block */}
                    {activeMembership ? (
                        <div className={`p-6 rounded-2xl border ${tierConfig.border} ${tierConfig.bg} relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Award className="w-32 h-32" />
                            </div>
                            <h2 className={`text-lg font-bold ${tierConfig.color} mb-2 flex items-center gap-2 relative z-10`}>
                                <CreditCard className="w-5 h-5" />
                                Active Membership
                            </h2>
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                <div>
                                    <p className="text-xs uppercase font-bold opacity-70 mb-1">Plan</p>
                                    <p className="font-bold text-lg">{activeMembership.category?.name || "Standard Plan"}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold opacity-70 mb-1">Status</p>
                                    <p className="font-bold text-lg flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Active
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold opacity-70 mb-1">Valid Until</p>
                                    <p className="font-bold text-lg">
                                        {activeMembership.endDate ? format(new Date(activeMembership.endDate), 'MMM d, yyyy') : 'Perpetual'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] border-dashed text-center">
                            <p className="text-[var(--text-muted)]">No active memberships</p>
                        </div>
                    )}

                    {/* Recent Service History */}
                    <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] flex flex-col h-[400px]">
                        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                                <LucideHistory className="w-5 h-5 text-[var(--text-muted)]" />
                                Recent Service History
                            </h2>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-2">
                            {client.serviceRecords && client.serviceRecords.length > 0 ? (
                                <div className="space-y-1">
                                    {client.serviceRecords.map((record: any) => (
                                        <div key={record.id} className="flex justify-between items-center p-4 hover:bg-[var(--bg-surface-hover)] rounded-xl transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)]">
                                                    <Droplets className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[var(--text-main)]">{record.service?.name || "Standard Service"}</p>
                                                    <p className="text-xs text-[var(--text-muted)]">{record.employee?.name ? `Specialist: ${record.employee.name}` : ''}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-[var(--text-secondary)]">{format(new Date(record.createdAt), 'MMM d, yyyy')}</p>
                                                <p className="text-xs text-[var(--text-muted)]">{format(new Date(record.createdAt), 'h:mm a')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-[var(--text-muted)] italic">
                                    No recent service records available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Membership Card Printer Modal */}
            <MembershipCardModal
                isOpen={isCardModalOpen}
                onClose={() => setCardModalOpen(false)}
                clientName={client.fullName}
                clientId={client.id}
                qrCodeString={qrCodePayload}
                tier={loyaltyInfo?.tier || "BRONZE"}
            />
        </div>
    );
}
