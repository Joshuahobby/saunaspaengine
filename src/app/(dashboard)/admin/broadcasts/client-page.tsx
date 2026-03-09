"use client";

export default function AdminBroadcastsClientPage() {
    return (
        <main className="mx-auto flex w-full max-w-[1440px] flex-1 gap-6 p-6 pb-12">
            {/* Sidebar Navigation */}
            <aside className="hidden w-64 flex-col gap-2 lg:flex">
                <div className="mb-4">
                    <h1 className="text-sm font-bold uppercase tracking-widest text-slate-400">Admin Center</h1>
                    <p className="text-xs text-slate-500">System Management</p>
                </div>
                <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] dark:text-slate-400 dark:hover:text-[var(--color-primary)] transition-colors" href="#">
                    <span className="material-symbols-outlined text-[1.25rem]">dashboard</span>
                    <span className="text-sm font-medium">Overview</span>
                </a>
                <a className="flex items-center gap-3 rounded-lg bg-[var(--color-primary)]/10 px-4 py-3 text-[var(--color-primary)]" href="#">
                    <span className="material-symbols-outlined text-[1.25rem]">campaign</span>
                    <span className="text-sm font-bold">Broadcast Center</span>
                </a>
                <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] dark:text-slate-400 dark:hover:text-[var(--color-primary)] transition-colors" href="#">
                    <span className="material-symbols-outlined text-[1.25rem]">schedule</span>
                    <span className="text-sm font-medium">Scheduled Alerts</span>
                </a>
                <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] dark:text-slate-400 dark:hover:text-[var(--color-primary)] transition-colors" href="#">
                    <span className="material-symbols-outlined text-[1.25rem]">history</span>
                    <span className="text-sm font-medium">Delivery History</span>
                </a>
                <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] dark:text-slate-400 dark:hover:text-[var(--color-primary)] transition-colors" href="#">
                    <span className="material-symbols-outlined text-[1.25rem]">description</span>
                    <span className="text-sm font-medium">Templates</span>
                </a>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col gap-8">
                {/* Header Section */}
                <section>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Platform Broadcast Center</h2>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">Global communication and platform-wide emergency notifications.</p>
                </section>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                    {/* Create Broadcast Form */}
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-6 shadow-sm dark:bg-slate-900/50">
                            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">add_circle</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Compose New Broadcast</h3>
                            </div>
                            <form className="space-y-5">
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div className="space-y-2 flex flex-col">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Target Audience</label>
                                        <select className="flex h-10 w-full items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none">
                                            <option>All Business Owners</option>
                                            <option>All Platform Employees</option>
                                            <option>Specific Business IDs</option>
                                            <option>Region: North America</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Broadcast Level</label>
                                        <div className="flex gap-2 h-10">
                                            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-2 text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors" type="button">
                                                <span className="material-symbols-outlined text-[1.25rem]">info</span> Normal
                                            </button>
                                            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-500 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors" type="button">
                                                <span className="material-symbols-outlined text-[1.25rem]">warning</span> Emergency
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message Subject</label>
                                    <input className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" placeholder="e.g. Scheduled System Maintenance for Oct 12" type="text" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message Content</label>
                                    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/80">
                                            <button className="flex items-center justify-center size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors" type="button"><span className="material-symbols-outlined text-lg">format_bold</span></button>
                                            <button className="flex items-center justify-center size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors" type="button"><span className="material-symbols-outlined text-lg">format_italic</span></button>
                                            <button className="flex items-center justify-center size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors" type="button"><span className="material-symbols-outlined text-lg">format_list_bulleted</span></button>
                                            <div className="mx-2 h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                                            <button className="flex items-center justify-center size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors" type="button"><span className="material-symbols-outlined text-lg">link</span></button>
                                            <button className="flex items-center justify-center size-8 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors" type="button"><span className="material-symbols-outlined text-lg">image</span></button>
                                        </div>
                                        <textarea className="w-full resize-y min-h-[120px] border-none bg-white p-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-0 dark:bg-slate-950 outline-none" placeholder="Write your message here..." rows={6}></textarea>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-4">
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input className="size-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-slate-50 dark:bg-slate-900 dark:border-slate-700" type="checkbox" />
                                            <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Also send as Email</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input className="size-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-slate-50 dark:bg-slate-900 dark:border-slate-700" type="checkbox" />
                                            <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Push Notification</span>
                                        </label>
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <button className="flex-1 sm:flex-none justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm" type="button">Save Draft</button>
                                        <button className="flex-1 sm:flex-none justify-center rounded-lg bg-[var(--color-primary)] px-6 py-2 text-sm font-bold text-slate-900 shadow-md shadow-[var(--color-primary)]/20 hover:brightness-105 transition-all" type="button">Send Broadcast</button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Scheduled Broadcasts */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-6 shadow-sm dark:bg-slate-900/50">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Upcoming Scheduled Messages</h3>
                                <button className="text-sm font-bold text-[var(--color-primary)] hover:underline">View All</button>
                            </div>
                            <div className="space-y-4">
                                {/* Scheduled Item 1 */}
                                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30 hover:border-[var(--color-primary)]/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-12 flex-col items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-sm">
                                            <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Oct</span>
                                            <span className="text-lg font-black leading-none">15</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Quarterly Performance Reports Available</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Target: <span className="font-medium text-slate-700 dark:text-slate-400">All Business Owners</span> • 09:00 AM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="hidden sm:inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-500/20">Pending</span>
                                        <button className="flex items-center justify-center size-8 rounded-full text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Scheduled Item 2 */}
                                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-12 flex-col items-center justify-center rounded-lg bg-slate-200/50 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Oct</span>
                                            <span className="text-lg font-black leading-none">22</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Winter Season Prep Checklist</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Target: <span className="font-medium text-slate-700 dark:text-slate-400">All Employees</span> • 10:30 AM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="hidden sm:inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700">Draft</span>
                                        <button className="flex items-center justify-center size-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: History & Metrics */}
                    <div className="flex flex-col gap-6">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-6 shadow-sm dark:bg-slate-900/50">
                            <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-slate-100">Recent Notifications</h3>
                            <div className="space-y-6">
                                {/* History Item 1 */}
                                <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800 last:before:hidden">
                                    <span className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)] ring-4 ring-white dark:ring-slate-900/50"></span>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sent 2 hours ago</p>
                                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">Emergency Server Downtime Notice</p>
                                    <div className="mt-3 flex items-center justify-between rounded-lg bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 p-3">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Read Rate</p>
                                            <p className="text-lg font-black text-[var(--color-primary)]">94.2%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recipients</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">1,204</p>
                                        </div>
                                    </div>
                                </div>

                                {/* History Item 2 */}
                                <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800 last:before:hidden">
                                    <span className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900/50"></span>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sent Oct 09, 2023</p>
                                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">Update: New Spa Booking Features</p>
                                    <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Read Rate</p>
                                            <p className="text-lg font-black text-slate-700 dark:text-slate-300">76.8%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recipients</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">892</p>
                                        </div>
                                    </div>
                                </div>

                                {/* History Item 3 */}
                                <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800 last:before:hidden">
                                    <span className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900/50"></span>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sent Oct 05, 2023</p>
                                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">Platform Maintenance Completed</p>
                                    <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Read Rate</p>
                                            <p className="text-lg font-black text-slate-700 dark:text-slate-300">62.1%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recipients</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">1,150</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="mt-6 w-full rounded-lg border border-[var(--color-primary)]/20 py-2.5 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors">View Full Analytics</button>
                        </div>

                        {/* System Status Card */}
                        <div className="rounded-xl bg-slate-900 p-6 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                                    <span className="flex h-2 w-2 animate-pulse rounded-full bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30"></span>
                                    System Reach
                                </h3>
                                <div className="mt-5 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-3xl font-black text-white">4.8k</p>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Total Users</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-white">12</p>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Active Nodes</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-col gap-2">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                        <div className="h-full w-4/5 bg-[var(--color-primary)] rounded-full"></div>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-400">Network load within optimal parameters</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
