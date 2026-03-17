import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ClientRegistrationForm from "@/components/operations/client-registration-form";

export default async function NewClientPage() {
    const session = await auth();
    if (!session?.user?.branchId) redirect("/login");

    const membershipCategories = await prisma.membershipCategory.findMany({
        where: { branchId: session.user.branchId, status: "ACTIVE" },
        orderBy: { price: "desc" }
    });

    return (
        <div className="space-y-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <nav className="flex gap-2 text-sm text-slate-500 mb-4 items-center">
                        <Link href="/clients" className="hover:text-[var(--color-primary)] transition-colors">Clients</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-slate-900 font-medium">New Registration</span>
                    </nav>
                    <h2 className="text-4xl font-black tracking-tight mb-2">Register New Client</h2>
                    <p className="text-slate-500">Add a new customer to your database to start managing their bookings and memberships.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <ClientRegistrationForm
                            membershipCategories={membershipCategories.map(c => ({
                                id: c.id,
                                name: c.name,
                                price: c.price,
                                type: c.type
                            }))}
                        />
                    </div>

                    {/* Next Steps / Info Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900 text-white rounded-xl p-6">
                            <h4 className="font-bold flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">tips_and_updates</span>
                                Next Steps
                            </h4>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex gap-2">
                                    <span className="text-[var(--color-primary)] font-bold">01.</span>
                                    Provide the physical RFID wristband if applicable.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[var(--color-primary)] font-bold">02.</span>
                                    Explain locker room procedures.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[var(--color-primary)] font-bold">03.</span>
                                    Book initial consultation session.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
