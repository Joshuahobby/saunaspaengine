import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import ClientForm from "@/components/clients/ClientForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) redirect("/login");

    const [client, branches] = await Promise.all([
        prisma.client.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                phone: true,
                clientType: true,
                branchId: true,
            }
        }),
        prisma.branch.findMany({
            where: session.user.role === 'OWNER' ? { businessId: session.user.businessId as string } : { id: session.user.branchId as string },
            select: { id: true, name: true }
        })
    ]);

    if (!client) notFound();

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link 
                    href={`/clients/${id}`}
                    className="size-10 flex items-center justify-center rounded-xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-[var(--text-main)] italic tracking-tight">Edit Profile</h1>
                    <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest opacity-60">Updating records for {client.fullName}</p>
                </div>
            </div>

            <ClientForm 
                mode="edit"
                initialData={{
                    id: client.id,
                    fullName: client.fullName,
                    phone: client.phone || "",
                    clientType: client.clientType,
                    branchId: client.branchId
                }}
                branches={branches}
            />
        </div>
    );
}
