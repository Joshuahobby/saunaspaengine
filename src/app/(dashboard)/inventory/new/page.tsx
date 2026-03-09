import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function createInventoryItem(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.businessId) throw new Error("Unauthorized");

    const productName = formData.get("productName") as string;
    const stockCount = parseInt(formData.get("stockCount") as string, 10);
    const minThreshold = parseInt(formData.get("minThreshold") as string, 10);
    const unit = formData.get("unit") as string;

    await prisma.inventory.create({
        data: {
            productName,
            stockCount,
            minThreshold,
            unit,
            businessId: session.user.businessId,
        }
    });

    revalidatePath("/inventory");
    redirect("/inventory");
}

export default async function NewInventoryItemPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    return (
        <div className="p-4 lg:p-8 w-full max-w-3xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm uppercase tracking-wider mb-2">
                    <span className="material-symbols-outlined text-sm">inventory_2</span>
                    Add Inventory
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Register New Item</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Add a new consumable or retail item to the inventory system.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-[var(--color-border-light)] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border-light)] bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="text-lg font-bold">Item Details</h3>
                </div>

                <form action={createInventoryItem} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="productName" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                required
                                placeholder="e.g. White Cotton Towels"
                                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-slate-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="unit" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                                Unit of Measurement <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="unit"
                                name="unit"
                                required
                                placeholder="e.g. pcs, bottles, kg"
                                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-slate-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="stockCount" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                                Initial Stock Count <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="stockCount"
                                name="stockCount"
                                required
                                min="0"
                                defaultValue="0"
                                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-slate-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="minThreshold" className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                                Minimum Alert Threshold <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="minThreshold"
                                name="minThreshold"
                                required
                                min="1"
                                defaultValue="5"
                                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--color-border-light)] flex justify-end gap-3">
                        <a
                            href="/inventory"
                            className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-[var(--color-primary)] text-[#102220] font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                            Register Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
