"use client";

export default function AdminHealthClientPage() {
    return (
        <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <main className="flex-1 max-w-[1440px] mx-auto w-full p-6 space-y-6">
                {/* Page Title & Global Status */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">System Health & API Performance</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time monitoring for sauna and spa operations.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        All Systems Operational
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-center text-slate-500">
                            <p className="text-sm font-medium">Server Uptime</p>
                            <span className="material-symbols-outlined text-lg">dns</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">99.98%</p>
                        <p className="text-emerald-500 text-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">trending_up</span> +0.01%
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-center text-slate-500">
                            <p className="text-sm font-medium">API Latency</p>
                            <span className="material-symbols-outlined text-lg">speed</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">124 ms</p>
                        <p className="text-amber-500 text-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">trending_down</span> -5ms
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-center text-slate-500">
                            <p className="text-sm font-medium">Request Volume</p>
                            <span className="material-symbols-outlined text-lg">bolt</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">1,240/min</p>
                        <p className="text-emerald-500 text-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">trending_up</span> +12%
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-center text-slate-500">
                            <p className="text-sm font-medium">Error Rate</p>
                            <span className="material-symbols-outlined text-lg">error</span>
                        </div>
                        <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">0.02%</p>
                        <p className="text-amber-500 text-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">trending_down</span> -0.01%
                        </p>
                    </div>
                </div>

                {/* Latency Chart & Service Status */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Latency Trends Chart */}
                    <div className="xl:col-span-2 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">API Latency Trends (Last 24 Hours)</h3>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">1H</button>
                                <button className="px-3 py-1 text-xs font-bold rounded-lg bg-[var(--color-primary)] text-slate-900 shadow-sm">24H</button>
                                <button className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">7D</button>
                            </div>
                        </div>
                        <div className="relative h-[240px] w-full mt-4">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 240" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="chartGradientHealth" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#13eca4" stopOpacity="0.3"></stop>
                                        <stop offset="100%" stopColor="#13eca4" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,180 Q100,160 200,190 T400,140 T600,170 T800,120 T1000,150 L1000,240 L0,240 Z" fill="url(#chartGradientHealth)"></path>
                                <path d="M0,180 Q100,160 200,190 T400,140 T600,170 T800,120 T1000,150" fill="none" stroke="#13eca4" strokeLinecap="round" strokeWidth="3"></path>
                            </svg>
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                <div className="border-t border-slate-200 dark:border-slate-800 w-full h-0"></div>
                                <div className="border-t border-slate-200 dark:border-slate-800 w-full h-0"></div>
                                <div className="border-t border-slate-200 dark:border-slate-800 w-full h-0"></div>
                                <div className="border-t border-slate-200 dark:border-slate-800 w-full h-0"></div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4 px-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">00:00</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">06:00</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">12:00</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">18:00</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Now</span>
                        </div>
                    </div>

                    {/* Service Status Grid */}
                    <div className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Service Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-500">database</span>
                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">PostgreSQL Cluster</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-500/20">Operational</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-500">lock</span>
                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">Auth (JWT Service)</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-500/20">Operational</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-amber-500">qr_code_2</span>
                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">QR Code Engine</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase border border-amber-500/20">Degraded</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-500">payments</span>
                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">Payment Gateway</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-500/20">Operational</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-400">cloud_off</span>
                                    <span className="font-medium text-sm text-slate-900 dark:text-slate-100">Legacy Sync Service</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 uppercase border border-slate-500/20">Offline</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Logs Stream */}
                <div className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col h-[400px] shadow-sm pb-10">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-500">terminal</span>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Live System Logs</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs font-semibold text-slate-500">Live Feed</span>
                            </div>
                            <button className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1 hover:underline">
                                <span className="material-symbols-outlined text-xs">download</span> Export
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs custom-scrollbar">
                        <div className="space-y-1">
                            <div className="flex gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg transition-colors group">
                                <span className="text-slate-400 w-16">14:24:01</span>
                                <span className="text-emerald-500 font-bold w-10">200</span>
                                <span className="text-[var(--color-primary)] font-semibold w-12">GET</span>
                                <span className="text-slate-600 dark:text-slate-300 truncate flex-1">/api/v1/sauna/status/room-402</span>
                                <span className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium">12ms</span>
                            </div>
                            <div className="flex gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg transition-colors group">
                                <span className="text-slate-400 w-16">14:23:58</span>
                                <span className="text-emerald-500 font-bold w-10">200</span>
                                <span className="text-[var(--color-primary)] font-semibold w-12">POST</span>
                                <span className="text-slate-600 dark:text-slate-300 truncate flex-1">/api/v1/bookings/confirm</span>
                                <span className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium">45ms</span>
                            </div>
                            <div className="flex gap-4 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-colors group bg-rose-50/50 dark:bg-rose-900/5">
                                <span className="text-slate-400 w-16">14:23:55</span>
                                <span className="text-rose-500 font-bold w-10">500</span>
                                <span className="text-[var(--color-primary)] font-semibold w-12">POST</span>
                                <span className="text-slate-600 dark:text-slate-300 truncate flex-1">/api/v1/qr-engine/generate</span>
                                <span className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium">1204ms</span>
                            </div>
                            <div className="flex gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg transition-colors group">
                                <span className="text-slate-400 w-16">14:23:52</span>
                                <span className="text-emerald-500 font-bold w-10">200</span>
                                <span className="text-[var(--color-primary)] font-semibold w-12">GET</span>
                                <span className="text-slate-600 dark:text-slate-300 truncate flex-1">/api/v1/inventory/towels</span>
                                <span className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium">8ms</span>
                            </div>
                            <div className="flex gap-4 p-2 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors group bg-amber-50/50 dark:bg-amber-900/5">
                                <span className="text-slate-400 w-16">14:23:50</span>
                                <span className="text-amber-500 font-bold w-10">404</span>
                                <span className="text-[var(--color-primary)] font-semibold w-12">GET</span>
                                <span className="text-slate-600 dark:text-slate-300 truncate flex-1">/api/v1/user/settings/unknown_param</span>
                                <span className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium">15ms</span>
                            </div>
                            <div className="flex gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg transition-colors group">
                                <span className="text-slate-400 w-16">14:23:45</span>
                                <span className="text-emerald-500 font-bold w-10">200</span>
                                <span className="text-[var(--color-primary)] font-semibold w-12">GET</span>
                                <span className="text-slate-600 dark:text-slate-300 truncate flex-1">/health</span>
                                <span className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium">4ms</span>
                            </div>
                            <div className="flex gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg transition-colors group">
                                <span className="text-slate-400 w-16">14:23:40</span>
                                <span className="text-emerald-500 font-bold w-10">201</span>
                                <span className="text-[var(--color-primary)] font-semibold w-12">PATCH</span>
                                <span className="text-slate-600 dark:text-slate-300 truncate flex-1">/api/v1/sauna/temperature/set</span>
                                <span className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium">62ms</span>
                            </div>
                            <div className="flex gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg transition-colors group">
                                <span className="text-slate-400 w-16">14:23:38</span>
                                <span className="text-emerald-500 font-bold w-10">200</span>
                                <span className="text-[var(--color-primary)] font-semibold w-12">GET</span>
                                <span className="text-slate-600 dark:text-slate-300 truncate flex-1">/api/v1/sessions/active</span>
                                <span className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium">18ms</span>
                            </div>
                            <div className="flex gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg transition-colors group">
                                <span className="text-slate-400 w-16">14:23:35</span>
                                <span className="text-emerald-500 font-bold w-10">200</span>
                                <span className="text-[var(--color-primary)] font-semibold w-12">GET</span>
                                <span className="text-slate-600 dark:text-slate-300 truncate flex-1">/api/v1/metrics/occupancy</span>
                                <span className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium">22ms</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
