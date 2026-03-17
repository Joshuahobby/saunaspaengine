import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
    const session = await auth();

    if (!session || session.user.role !== "MANAGER") {
        redirect("/dashboard");
    }

    const branchId = session.user.branchId;
    if (!branchId) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-sm text-center">
                    <h2 className="text-red-500 font-bold mb-2">Access Denied</h2>
                    <p className="text-sm opacity-60">No branch node associated with this account.</p>
                </div>
            </div>
        );
    }

    const branch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: {
            services: true,
            employees: true,
        }
    }) as any;

    if (!branch) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl max-w-sm text-center">
                    <h2 className="text-amber-600 font-bold mb-2">Vessel Not Found</h2>
                    <p className="text-sm opacity-60">The branch node could not be retrieved from the central registry.</p>
                </div>
            </div>
        );
    }

    // If onboarding is already completed, redirect to the actual dashboard
    if (branch.onboardingCompleted) {
        redirect("/dashboard");
    }

    return (
        <OnboardingClient branch={branch} initialStep={branch.onboardingStep} />
    );
}
