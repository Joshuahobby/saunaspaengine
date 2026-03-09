import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function submitInventoryRequest(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.businessId) throw new Error("Unauthorized");

    // In a full implementation, we would save this to an InventoryRequest or Notification model
    // For now, we simulate submission and redirect
    const notes = formData.get("notes") as string;

    // Process items data (would normally be parsed from a hidden input or complex form state)
    console.log("Submitted request with notes:", notes);

    revalidatePath("/inventory");
    redirect("/inventory");
}

export default async function InventoryRequestPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    // Fetch essential inventory to show in request form
    const items = await prisma.inventory.findMany({
        where: { businessId: session.user.businessId },
        orderBy: { stockCount: 'asc' }, // show low stock items first
        take: 5
    });

    // Provide default static items if database is empty for demo purposes
    const displayItems = items.length > 0 ? items : [
        { id: "1", productName: "White Cotton Towels", unit: "pieces" },
        { id: "2", productName: "Massage Oil (Lavender)", unit: "bottles" },
        { id: "3", productName: "Sauna Stones", unit: "packs" },
        { id: "4", productName: "Artesian Mineral Water", unit: "cases" },
    ];

    const getImageUrl = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('towel') || lower.includes('linen')) return "https://lh3.googleusercontent.com/aida-public/AB6AXuBK9Lw-ZEzblMfTBu9qXZqTFl-3w6afzVCa1wyteJYh615g_jlt3u5j3M0zmshbhOFnTfxtF4CJ4EPptMVQ3IW0hkr9-qbJM59jidy_4-sEE2dF_JJQ0jF748Joz_WlniA4yepvb5rgyN7KpSMBfNu6HCMF8_fx9j73KP-r-ICHRyknyaA82y0qk9EJ2Vju8ByomlbnZ23z4JsPG8PGOrZKo-bKN54hj2FWhd8NhYSkJrxbSC1Ata0byCw3OFQy7b9Xm6yisugB-LK8";
        if (lower.includes('oil')) return "https://lh3.googleusercontent.com/aida-public/AB6AXuAL5jXjcNlc1z_XUZNRMlec2sFleT84jORddGOBPsC58HjUM0S2reruUT0ws3-VCgEJTEXCM9oCDKjBAYdXrl58staMhOU00Ui8S8vnY5aCdKJdnNFz8gmgtaWQ8Nztwpi0zHHJZSFz9ftxN7eTpfU8SUFc1bpsMOcTMDiLZbh3Y9w2La5EcrGt8smrzTPj3iC7bhbAyDz_KqO4ryvxcz_9hdwRmtJcJx9d4aFXAiiNkj22XfH2O-OnkHw23tfz-LT4qVoER_4oOGaF";
        if (lower.includes('stone') || lower.includes('wood')) return "https://lh3.googleusercontent.com/aida-public/AB6AXuB7kCC_gH768m5ybFc9lphL-Y9XOekMpN_JKsVVJtUWgPmpc1AtGTlUIAavq228BfgSGVZLYNQ_7puoJLMayUiau1NMJxgEfLa-_YYO125xJA7IXjLjsa5iKy11IZ1pEB3f-QL03Z9sDmjHrLWERex_fuGT0RZgNWVuhfNc--nJynTVobl_V32qjF3UgYWSAxCwV5dNEQ6Deq7e-n3MvdK2mdt-Q1_YVDi7bbdvtSiCQUaf7vP9XvpKWPZZg-urRCP1YvOSZ9EQmW0s";
        if (lower.includes('water') || lower.includes('drink')) return "https://lh3.googleusercontent.com/aida-public/AB6AXuAdiz9XIB56fF0nXdYkGsEo8GS5NwFX2M4KERPeozGWDItA_ra1hxC7O23v9m7tcHxZzmfbDD1zWexQ7bWXL2l_42lPEOPORHbDp02AwcGF43qnQf4ZvADfLKfMgD1H0VG5ZI0GsM81Glh0adyK-N5ZxxHLuG4R6FmDmY3mJ4AnbSDgp8X72QTXbiqDTIKALlJ4-O19AOqQHHF-wfFqXB0S-arQCCAEuQgvB5h7VfGerB9Vaz5ieuUJmga4qP6pCMiOxujxk2sKi0TZ";
        return "https://lh3.googleusercontent.com/aida-public/AB6AXuBK9Lw-ZEzblMfTBu9qXZqTFl-3w6afzVCa1wyteJYh615g_jlt3u5j3M0zmshbhOFnTfxtF4CJ4EPptMVQ3IW0hkr9-qbJM59jidy_4-sEE2dF_JJQ0jF748Joz_WlniA4yepvb5rgyN7KpSMBfNu6HCMF8_fx9j73KP-r-ICHRyknyaA82y0qk9EJ2Vju8ByomlbnZ23z4JsPG8PGOrZKo-bKN54hj2FWhd8NhYSkJrxbSC1Ata0byCw3OFQy7b9Xm6yisugB-LK8"; // fallback
    };

    return (
        <div className="flex flex-1 justify-center py-10 px-4 md:px-10 w-full">
            <div className="layout-content-container flex flex-col max-w-4xl flex-1 gap-8">
                {/* Page Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm">inventory_2</span>
                        Staff Portal
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-4xl font-bold leading-tight tracking-tight">Inventory & Supplies Request</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">Efficiently request items for daily spa operations. Your request will be instantly routed to the manager for approval.</p>
                </div>

                <form action={submitInventoryRequest} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Items Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900/50 border border-[var(--color-border-light)] rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-[var(--color-border-light)] bg-slate-50/50 dark:bg-slate-800/30">
                                <h3 className="text-lg font-bold">Essential Supplies</h3>
                            </div>
                            <div className="divide-y divide-[var(--color-border-light)]">
                                {displayItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <div
                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0 border border-[var(--color-border-light)]"
                                            style={{ backgroundImage: `url("${getImageUrl(item.productName)}")` }}
                                        />
                                        <div className="flex flex-col flex-1">
                                            <p className="text-slate-900 dark:text-white text-base font-semibold">{item.productName}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">Unit: {item.unit}</p>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-3">
                                            <button type="button" className="size-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[var(--color-primary)] hover:text-white transition-all">
                                                <span className="material-symbols-outlined">remove</span>
                                            </button>
                                            <span className="text-lg font-bold w-6 text-center text-slate-900 dark:text-white">0</span>
                                            <button type="button" className="size-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[var(--color-primary)] hover:text-[#102220] transition-all">
                                                <span className="material-symbols-outlined">add</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes Field */}
                        <div className="flex flex-col gap-3">
                            <label htmlFor="notes" className="text-slate-900 dark:text-white text-lg font-bold">Special Requests & Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                className="w-full min-h-[120px] rounded-xl bg-white dark:bg-slate-900/50 border border-[var(--color-border-light)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-slate-900 dark:text-white p-4 placeholder:text-slate-400"
                                placeholder="e.g. Need extra large robes for the weekend retreat, or urgent replacement for steam room thermometer..."
                            />
                        </div>
                    </div>

                    {/* Right Column: Summary & Submit */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white dark:bg-slate-900/50 border border-[var(--color-border-light)] rounded-xl p-6 shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Request Summary</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Selected Items</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">0 types</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Total Quantity</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">0 units</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Requesting Staff</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{session.user.name || "Staff Member"}</span>
                                </div>

                                <div className="pt-4 border-t border-[var(--color-border-light)]">
                                    <div className="flex items-center gap-2 text-[var(--color-primary)]">
                                        <span className="material-symbols-outlined text-sm">info</span>
                                        <span className="text-xs font-medium uppercase tracking-wider">Auto-notifies Owner</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-[var(--color-primary)] hover:brightness-110 text-[#102220] font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
                                <span className="material-symbols-outlined">send</span>
                                Submit Request
                            </button>
                            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
                                Average response time: <span className="text-slate-900 dark:text-slate-100 font-medium">~2 hours</span>
                            </p>
                        </div>

                        {/* Help Card */}
                        <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3 text-[var(--color-primary)]">
                                <span className="material-symbols-outlined">help_center</span>
                                <h4 className="font-bold">Need assistance?</h4>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                If you don&apos;t see the item you need, please contact the inventory manager directly or add it to the notes.
                            </p>
                            <a href="#" className="text-[var(--color-primary)] text-sm font-semibold hover:underline">
                                View Policy Guide →
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
