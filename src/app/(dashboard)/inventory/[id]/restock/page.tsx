import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function restockItem(id: string, formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.businessId) throw new Error("Unauthorized");

    const amount = parseInt(formData.get("amount") as string);
    if (isNaN(amount) || amount <= 0) return;

    await prisma.inventory.update({
        where: {
            id,
            businessId: session.user.businessId
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
    if (!session?.user?.businessId) redirect("/login");

    const item = await prisma.inventory.findUnique({
        where: {
            id: id,
            businessId: session.user.businessId
        }
    });

    if (!item) redirect("/inventory");

    return (
        <div className="p-4 lg:p-8 max-w-2xl mx-auto">
            <div className="mb-8">
                <Link href="/inventory" className="text-sm font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Inventory
                </Link>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Restock Item</h2>
                <p className="text-slate-500">Add quantity to your current supply levels.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="size-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                        <span className="material-symbols-outlined text-2xl">inventory_2</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.productName}</p>
                        <p className="text-xs text-slate-500 uppercase font-black tracking-wider">
                            Current: {item.stockCount} {item.unit} / Threshold: {item.minThreshold} {item.unit}
                        </p>
                    </div>
                </div>

                <form action={restockItem.bind(null, item.id)}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Restock Amount ({item.unit})</label>
                            <input
                                type="number"
                                name="amount"
                                min="1"
                                required
                                placeholder="e.g. 50"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-lg font-bold"
                            />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-4 bg-[var(--color-primary)] text-[#102220] rounded-xl font-black text-lg shadow-lg shadow-[var(--color-primary)]/20 hover:brightness-110 active:scale-[0.98] transition-all">
                                Update Stock Levels
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
