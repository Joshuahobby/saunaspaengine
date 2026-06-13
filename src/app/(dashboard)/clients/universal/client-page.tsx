"use client";

import React, { useState } from "react";
import { 
    Users, 
    Search, 
    Filter, 
    Store, 
    ChevronRight,
    CreditCard,
    ArrowUpRight
} from "lucide-react";

interface UniversalClient {
    id: string;
    fullName: string;
    phone: string;
    clientType: string;
    branchId: string;
    branchName: string;
    activeMemberships: number;
    totalVisits: number;
    lastVisitDate: string | null;
}

export default function UniversalMemberRegistryClient({ initialClients }: { initialClients: UniversalClient[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBranch, setFilterBranch] = useState("ALL");

    const branches = Array.from(new Set(initialClients.map(c => c.branchName)));

    const filteredClients = initialClients.filter(client => {
        const matchesSearch = client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             client.phone.includes(searchTerm);
        const matchesBranch = filterBranch === "ALL" || client.branchName === filterBranch;
        return matchesSearch && matchesBranch;
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-400" />
                        Universal Member Registry
                    </h1>
                    <p className="text-zinc-400 mt-1">Cross-branch client portfolio management</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Stats Cards */}
                <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Total Network Clients</p>
                            <p className="text-2xl font-bold text-white">{initialClients.length}</p>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Total Branches</p>
                            <p className="text-2xl font-bold text-white">{branches.length}</p>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Store className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-400">Cross-Branch Affinity</p>
                            <p className="text-2xl font-bold text-white">12.5%</p>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <ArrowUpRight className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input 
                                placeholder="Search by name or phone..." 
                                className="w-full pl-10 h-10 bg-zinc-950 border border-zinc-800 text-white rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-zinc-500" />
                            <select 
                                title="Filter by Branch"
                                aria-label="Filter clients by branch"
                                className="bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filterBranch}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterBranch(e.target.value)}
                            >
                                <option value="ALL">All Branches</option>
                                {branches.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="pb-4 pt-2 font-medium text-zinc-400">Client</th>
                                    <th className="pb-4 pt-2 font-medium text-zinc-400">Home Branch</th>
                                    <th className="pb-4 pt-2 font-medium text-zinc-400">Status</th>
                                    <th className="pb-4 pt-2 font-medium text-zinc-400">Memberships</th>
                                    <th className="pb-4 pt-2 font-medium text-zinc-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="group hover:bg-zinc-800/30 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                                                    {client.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{client.fullName}</p>
                                                    <p className="text-sm text-zinc-500">{client.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2 text-zinc-300">
                                                <Store className="w-4 h-4 text-zinc-500" />
                                                {client.branchName}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${client.clientType === "MEMBER" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}>
                                                {client.clientType}
                                            </span>
                                        </td>
                                        <td className="py-4 font-mono text-zinc-400">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                {client.activeMemberships > 0 ? (
                                                    <span className="text-blue-400 font-bold">{client.activeMemberships} Active</span>
                                                ) : (
                                                    "None"
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <button 
                                                title="View Client Detail"
                                                aria-label={`View details for ${client.fullName}`}
                                                className="p-2 text-zinc-500 hover:text-white transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
