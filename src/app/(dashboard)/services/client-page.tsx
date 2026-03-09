"use client";

interface Service {
    id: string;
    name: string;
    category: string | null;
    price: number;
    duration: number;
    status: string;
}

interface ServicesClientPageProps {
    services: Service[];
    stats: {
        total: number;
        active: number;
        avgDuration: number;
        mostPopular: string;
    };
}

export default function ServicesClientPage({ services, stats }: ServicesClientPageProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getCategoryBadgeColor = (category: string | null) => {
        switch (category?.toLowerCase()) {
            case 'masseuse': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
            case 'sauna': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
            case 'steam': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
        }
    };

    const getServiceIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('massage')) return 'self_care';
        if (lowerName.includes('sauna')) return 'hot_tub';
        if (lowerName.includes('steam')) return 'waves';
        if (lowerName.includes('facial')) return 'face';
        return 'spa';
    };

    return (
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">Service Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-medium mt-1">Configure and manage your spa&apos;s treatment menu and pricing.</p>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-[var(--color-primary)] text-slate-900 font-bold shadow-lg shadow-[var(--color-primary)]/30 hover:shadow-[var(--color-primary)]/40 transition-all">
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>Add New Service</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Services</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{stats.total}</p>
                    <div className="flex items-center gap-1 text-[var(--color-primary)] text-xs font-bold mt-2">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>Update real-time</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Active Treatments</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{stats.active}</p>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mt-2">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>{Math.round((stats.active / stats.total) * 100) || 0}% Availability</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Avg. Session Duration</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{stats.avgDuration}m</p>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mt-2">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>Standard optimized</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Most Popular</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 truncate">{stats.mostPopular}</p>
                    <div className="flex items-center gap-1 text-[var(--color-primary)] text-xs font-bold mt-2">
                        <span className="material-symbols-outlined text-sm">star</span>
                        <span>Based on bookings</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-1 flex border border-slate-200 dark:border-slate-800">
                    <button className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-slate-900 text-sm font-bold">All Services</button>
                    <button className="px-4 py-2 rounded-md text-slate-500 dark:text-slate-400 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800">Active</button>
                    <button className="px-4 py-2 rounded-md text-slate-500 dark:text-slate-400 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800">Inactive</button>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:border-slate-800 mx-2"></div>
                <button className="flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-lg">filter_list</span>
                    <span>Category</span>
                    <span className="material-symbols-outlined text-lg">expand_more</span>
                </button>
            </div>

            {/* Services Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Service ID</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Service Name</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Category</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-right">Price</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Duration</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {services.map((service) => (
                                <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="font-mono text-xs font-bold text-slate-400 uppercase truncate max-w-[80px] block">
                                            #{service.id.slice(-6)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                                <span className="material-symbols-outlined">{getServiceIcon(service.name)}</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-slate-100">{service.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getCategoryBadgeColor(service.category)}`}>
                                            {service.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-slate-100">{formatPrice(service.price)}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined text-lg">timer</span>
                                            <span className="text-sm">{service.duration} min</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={`size-2 rounded-full ${service.status === 'ACTIVE' ? 'bg-[var(--color-primary)] animate-pulse' : 'bg-slate-400'}`}></span>
                                            <span className={`text-sm font-bold ${service.status === 'ACTIVE' ? 'text-[var(--color-primary)]' : 'text-slate-400'}`}>
                                                {service.status.charAt(0) + service.status.slice(1).toLowerCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-3">
                                            <button className="text-slate-400 hover:text-[var(--color-primary)] transition-colors">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button className="text-slate-400 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                        No services found. Add your first treatment to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Showing {services.length} services</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="size-8 rounded-lg bg-[var(--color-primary)] text-slate-900 font-bold text-sm">1</button>
                        <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
