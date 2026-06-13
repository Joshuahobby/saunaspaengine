import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function restockItem(id: string, formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.branchId) throw new Error("Unauthorized");

    const amount = parseInt(formData.get("amount") as string);
    if (isNaN(amount) || amount <= 0) return;

    await prisma.inventory.update({
        where: {
            id,
            branchId: session.user.branchId
        },
        data: {
            stockCount: {
                increment: amount
            }
        }
    });

    revalidatePath("/inventory");
    redirect("/inventory");
}

type Params = Promise<{ id: string }>;

export default async function RestockPage(props: { params: Params }) {
    const { id } = await props.params;
    const session = await auth();
    if (!session?.user?.branchId) redirect("/login");

    const item = await prisma.inventory.findUnique({
        where: {
            id: id,
            branchId: session.user.branchId
        }
    });

    if (!item) redirect("/inventory");

    const isLow = item.stockCount <= item.minThreshold;

    return (
        <div className="p-4 lg:p-8 max-w-2xl mx-auto">
            <div className="mb-8">
                <Link href="/inventory" className="text-sm font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Inventory
                </Link>
                <h2 className="text-3xl font-display font-bold text-[var(--text-main)]">Restock <span className="text-[var(--color-primary)]">Supply</span></h2>
                <p className="text-[var(--text-muted)] mt-2 font-bold">Add quantity to your current supply levels.</p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] p-8 shadow-sm">
                {/* Item Info */}
                <div className={`flex items-center gap-4 mb-8 p-6 rounded-2xl border ${isLow ? "bg-red-500/5 border-red-500/20" : "bg-[var(--bg-surface-muted)] border-[var(--border-muted)]"}`}>
                    <div className={`size-12 rounded-2xl flex items-center justify-center ${isLow ? "bg-red-500/10 text-red-500" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"}`}>
                        <span className="material-symbols-outlined text-2xl">inventory_2</span>
                    </div>
                    <div>
                        <p className="font-display font-bold text-[var(--text-main)]">{item.productName}</p>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60 mt-0.5">
                            Current: <span className={isLow ? "text-red-500" : ""}>{item.stockCount} {item.unit}</span> / Threshold: {item.minThreshold} {item.unit}
                        </p>
                    </div>
                    {isLow && (
                        <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-widest">
                            Low Stock
                        </span>
                    )}
                </div>

                <form action={restockItem.bind(null, item.id)}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60 mb-3">Restock Amount ({item.unit})</label>
                            <input
                                type="number"
                                name="amount"
                                min="1"
                                required
                                placeholder="e.g. 50"
                                className="w-full px-6 py-4 rounded-xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none text-lg font-bold text-[var(--text-main)] transition-all"
                            />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 active:scale-[0.98] transition-all">
                                Update Stock Levels
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
