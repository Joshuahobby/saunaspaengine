import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage(props: {
    searchParams: Promise<{ tab?: string }>;
}) {
    const searchParams = await props.searchParams;
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const activeTab = searchParams?.tab === "Roles" ? "Roles" : "Logs";

    return (
        <div className="flex-1 p-6 lg:p-10 overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                            {activeTab === "Logs" ? "Platform Audit Logs" : "Role & Permission Matrix"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                            {activeTab === "Logs"
                                ? "Monitor and trace all system-level activities and configuration changes. Ensuring transparency and platform integrity across all sauna and spa operations."
                                : "Configure granular access levels for each staff role across the sauna and spa platform. Changes are logged for audit purposes."}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export CSV
                        </button>
                        {activeTab === "Roles" && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-slate-900 rounded-lg text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20">
                                <span className="material-symbols-outlined text-lg">save</span>
                                Save Permissions
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto print:hidden">
                    <Link
                        href="?tab=Logs"
                        className={`pb-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === "Logs"
                            ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                    >
                        Audit Logs
                    </Link>
                    <Link
                        href="?tab=Roles"
                        className={`pb-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === "Roles"
                            ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                    >
                        Access Control Matrix
                    </Link>
                </div>

                {/* Content */}
                {activeTab === "Logs" ? (
                    <AuditLogsView businessId={session.user.businessId ?? null} role={session.user.role} />
                ) : (
                    <RoleMatrixView />
                )}
            </div>
        </div>
    );
}

async function AuditLogsView({ businessId, role }: { businessId: string | null; role: string }) {
    // Admins see all logs, Owners see their business's logs, Employees see none (or their business if permitted, but we restrict it to OWNER/ADMIN in a real app)
    const whereClause = role === "ADMIN" ? {} : businessId ? { businessId } : { id: "none" };

    const logs = await db.auditLog.findMany({
        where: whereClause,
        include: {
            user: true,
            business: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 50,
    });

    const getActionIcon = (action: string) => {
        switch (action) {
            case "CREATE": return "add_circle";
            case "UPDATE": return "edit";
            case "DELETE": return "delete";
            case "OVERRIDE": return "warning";
            case "LOGIN": return "login";
            case "SYSTEM": return "settings_applications";
            default: return "info";
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case "CREATE": return "text-blue-500 dark:text-blue-400";
            case "UPDATE": return "text-green-500 dark:text-green-400";
            case "DELETE": return "text-red-500 dark:text-red-400";
            case "OVERRIDE": return "text-orange-600 dark:text-orange-500";
            case "SYSTEM": return "text-slate-500 dark:text-slate-400";
            default: return "text-[var(--color-primary)]";
        }
    };

    const getStatusStyle = (action: string) => {
        if (action === "OVERRIDE") {
            return "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-500 border border-orange-200 dark:border-orange-500/20";
        }
        if (action === "DELETE") {
            return "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-500 border border-red-200 dark:border-red-500/20";
        }
        return "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500 border border-green-200 dark:border-green-500/20";
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-sm">
                    <span className="text-slate-500">Role:</span>
                    <select
                        title="Filter by Role"
                        className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold cursor-pointer outline-none"
                    >
                        <option>All Roles</option>
                        <option>System Admin</option>
                        <option>Business Owner</option>
                        <option>Manager</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-sm">
                    <span className="text-slate-500">Activity:</span>
                    <select
                        title="Filter by Activity"
                        className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold cursor-pointer outline-none"
                    >
                        <option>All Activities</option>
                        <option>CREATE</option>
                        <option>UPDATE</option>
                        <option>DELETE</option>
                        <option>OVERRIDE</option>
                    </select>
                </div>
                <div className="flex-1"></div>
                <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-medium transition-colors">
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Clear Filters
                </button>
            </div>

            {/* Audit Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Actor</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Activity</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">IP Address</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No audit logs found for your organization.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${log.action === "OVERRIDE" ? "bg-orange-50/50 dark:bg-orange-500/5" : ""}`}>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            {format(new Date(log.createdAt), "MMM dd, yyyy • HH:mm:ss")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-8 rounded flex items-center justify-center text-xs font-bold ${log.user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' :
                                                    log.user.role === 'OWNER' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' :
                                                        'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                                                    }`}>
                                                    {log.user.fullName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{log.user.fullName}</p>
                                                    <p className={`text-[10px] uppercase font-bold tracking-tighter ${log.user.role === 'ADMIN' ? 'text-purple-600 dark:text-purple-400' :
                                                        log.user.role === 'OWNER' ? 'text-orange-600 dark:text-orange-400' :
                                                            'text-[var(--color-primary)]'
                                                        }`}>{log.user.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`material-symbols-outlined text-[18px] ${getActionColor(log.action)}`}>
                                                    {getActionIcon(log.action)}
                                                </span>
                                                <span className={`text-sm font-medium ${log.action === "OVERRIDE" ? "text-orange-600 dark:text-orange-400 font-bold" : ""}`}>
                                                    {log.action} {log.entity}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-300 font-semibold italic truncate block max-w-[200px]" title={log.details || ""}>
                                                "{log.details || log.entityId}"
                                            </span>
                                            {log.reason && (
                                                <p className="text-xs text-slate-500 mt-1">Reason: {log.reason}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-slate-500 tracking-wider">
                                            Unknown {/* In a real app we'd capture IP from request headers */}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(log.action)}`}>
                                                {log.action === "OVERRIDE" ? "Warning" : "Success"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {logs.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-slate-500">Showing <span className="text-slate-900 dark:text-slate-200 font-bold">1-{logs.length}</span> events</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-sm font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-not-allowed transition-colors">Previous</button>
                        <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-slate-900 text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/40">Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function RoleMatrixView() {
    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 shadow-sm">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)] transition-all outline-none"
                        placeholder="Search specific actions (e.g., 'Financial Reports', 'Pricing')..."
                        type="text"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">All Modules</button>
                    <button className="px-4 py-2 bg-white dark:bg-slate-900 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Modified Only</button>
                </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Action / Permission</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Admin</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Owner</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Manager</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Employee</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {/* Section: Finance */}
                            <tr className="bg-slate-50/30 dark:bg-slate-800/20">
                                <td className="px-6 py-2 text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-slate-50 dark:bg-slate-800/40" colSpan={5}>Financial Management</td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">View Financial Reports</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Access to daily revenue and monthly P&amp;L.</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center"><input title="Admin setting" aria-label="Admin permission" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Owner setting" aria-label="Owner permission" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Manager setting" aria-label="Manager permission" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Employee setting" aria-label="Employee permission" className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Refund Processing</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Ability to issue partial or full refunds.</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center"><input title="Admin setting" aria-label="Admin permission" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Owner setting" aria-label="Owner permission" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Manager setting" aria-label="Manager permission" className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Employee setting" aria-label="Employee permission" className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                            </tr>

                            {/* Section: Operations */}
                            <tr>
                                <td className="px-6 py-2 text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-slate-50 dark:bg-slate-800/40" colSpan={5}>Operations &amp; Logistics</td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Edit Service Records</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Modify existing spa session logs.</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center"><input title="Admin setting" aria-label="Admin permission" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Owner setting" aria-label="Owner permission" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Manager setting" aria-label="Manager permission" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Employee setting" aria-label="Employee permission" className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Override Locked Records</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Force edit records finalized by system.</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center"><input title="Admin setting" aria-label="Admin permission" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Owner setting" aria-label="Owner permission" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Manager setting" aria-label="Manager permission" className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                                <td className="px-4 py-4 text-center"><input title="Employee setting" aria-label="Employee permission" className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Summary */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between py-6 px-4 md:px-6 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-lg mt-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--color-primary)]/20 rounded-full shrink-0">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">info</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Audit Ready</p>
                        <p className="text-xs text-slate-400">Every permission change is tracked with a timestamp and IP.</p>
                    </div>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-sm font-bold transition-all border border-slate-700 dark:border-slate-600">Discard</button>
                    <button className="flex-1 sm:flex-none px-8 py-2.5 bg-[var(--color-primary)] text-slate-900 rounded-lg text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/40">Apply Matrix</button>
                </div>
            </div>
        </div>
    );
}
