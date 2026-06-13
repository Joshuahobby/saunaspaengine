import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function createInventoryItem(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.branchId) throw new Error("Unauthorized");

    const productName = formData.get("productName") as string;
    const stockCount = parseInt(formData.get("stockCount") as string, 10);
    const minThreshold = parseInt(formData.get("minThreshold") as string, 10);
    const unit = formData.get("unit") as string;

    if (!productName?.trim()) throw new Error("Product name is required");

    await prisma.inventory.create({
        data: {
            productName: productName.trim(),
            stockCount: isNaN(stockCount) ? 0 : stockCount,
            minThreshold: isNaN(minThreshold) ? 5 : minThreshold,
            unit: unit?.trim() || "pcs",
            branchId: session.user.branchId,
        }
    });

    revalidatePath("/inventory");
    redirect("/inventory");
}

export default async function NewInventoryItemPage() {
    const session = await auth();
    if (!session?.user?.branchId) redirect("/login");

    return (
        <div className="p-4 lg:p-8 w-full max-w-3xl mx-auto">
            <div className="mb-8">
                <Link href="/inventory" className="text-sm font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Inventory
                </Link>
                <h1 className="text-3xl font-display font-bold text-[var(--text-main)]">Register <span className="text-[var(--color-primary)]">New Item</span></h1>
                <p className="text-[var(--text-muted)] mt-2 font-bold">Add a new consumable or retail item to the inventory system.</p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] overflow-hidden shadow-sm">
                <div className="px-8 py-5 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/30">
                    <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Item Details</h3>
                </div>

                <form action={createInventoryItem} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="productName" className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                required
                                placeholder="e.g. White Cotton Towels"
                                className="w-full h-12 px-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] placeholder:text-[var(--text-muted)] text-[var(--text-main)] font-bold outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="unit" className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                                Unit <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="unit"
                                name="unit"
                                required
                                placeholder="e.g. pcs, bottles, kg"
                                className="w-full h-12 px-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] placeholder:text-[var(--text-muted)] text-[var(--text-main)] font-bold outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="stockCount" className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                                Initial Stock <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="stockCount"
                                name="stockCount"
                                required
                                min="0"
                                defaultValue="0"
                                className="w-full h-12 px-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-[var(--text-main)] font-bold outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="minThreshold" className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                                Alert Threshold <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="minThreshold"
                                name="minThreshold"
                                required
                                min="1"
                                defaultValue="5"
                                className="w-full h-12 px-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-[var(--text-main)] font-bold outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--border-muted)] flex justify-end gap-4">
                        <Link
                            href="/inventory"
                            className="px-8 py-4 rounded-2xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] transition-colors text-[10px] uppercase tracking-widest"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-8 py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/10 text-[10px] uppercase tracking-widest"
                        >
                            <span className="material-symbols-outlined text-[18px]">add_circle</span>
                            Register Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
