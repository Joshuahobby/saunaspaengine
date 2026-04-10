import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import InventoryClientPage from "../inventory/client-page";

export default async function StockTab() {
    const session = await auth();
    if (!session?.user) return null;

    const branchIds = (session.user.role === 'OWNER' || session.user.role === 'ADMIN')
        ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string }, select: { id: true } })).map(b => b.id)
        : [session.user.branchId as string];

    const [items, suppliers] = await Promise.all([
        prisma.inventory.findMany({
            where: { branchId: { in: branchIds } },
            include: {
                supplier: { select: { id: true, name: true, category: true } },
            },
            orderBy: { productName: 'asc' },
        }),
        prisma.supplier.findMany({
            where: { branchId: { in: branchIds } },
            include: {
                _count: { select: { inventory: true } },
            },
            orderBy: { name: 'asc' },
        }),
    ]);

    return (
        <InventoryClientPage
            items={JSON.parse(JSON.stringify(items))}
            suppliers={JSON.parse(JSON.stringify(suppliers))}
            branchId={session.user.branchId || branchIds[0] || ""}
        />
    );
}
