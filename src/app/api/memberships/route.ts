import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculatePointsEarned, determineTier } from "@/lib/loyalty";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || !session.user.branchId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { clientId, categoryId } = body;

        if (!clientId || !categoryId) {
            return NextResponse.json({ error: "clientId and categoryId are required" }, { status: 400 });
        }

        // Fetch category to determine duration/limits
        const category = await prisma.membershipCategory.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        const startDate = new Date();
        let endDate: Date | null = null;
        if (category.durationDays) {
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + category.durationDays);
        }

        const membership = await prisma.$transaction(async (tx) => {
            // 1. Create the membership record
            const m = await tx.membership.create({
                data: {
                    clientId,
                    categoryId: category.id,
                    startDate,
                    endDate,
                    balance: category.usageLimit || null,
                    status: "ACTIVE"
                }
            });

            // 2. Ensure a "Membership" service category exists to track revenue
            let membershipService = await tx.service.findFirst({
                where: { 
                    branchId: session.user.branchId!,
                    name: `Membership: ${category.name}`,
                }
            });

            if (!membershipService) {
                membershipService = await tx.service.create({
                    data: {
                        name: `Membership: ${category.name}`,
                        category: "Membership",
                        price: category.price,
                        duration: 0,
                        branchId: session.user.branchId!,
                        status: "ACTIVE"
                    }
                });
            }

            // 3. Create a ServiceRecord to represent the income
            await tx.serviceRecord.create({
                data: {
                    clientId,
                    serviceId: membershipService.id,
                    branchId: session.user.branchId!,
                    amount: category.price,
                    netAmount: category.price,
                    status: "COMPLETED",
                    completedAt: new Date(),
                    paymentMode: "CASH",
                    comment: `Enrollment: ${category.name}`
                }
            });

            // 4. Award initial Loyalty Points for joining
            const loyaltyProgram = await tx.loyaltyProgram.findUnique({
                where: { branchId: session.user.branchId! },
            });

            if (loyaltyProgram && loyaltyProgram.status === "ACTIVE") {
                const existingLoyalty = await tx.loyaltyPoint.findFirst({
                    where: { clientId, branchId: session.user.branchId! }
                });

                // Bonus: 100 points for enrolling + points based on amount
                const baseBonus = 100;
                const earnedPoints = calculatePointsEarned(
                    category.price,
                    existingLoyalty?.tier || "BRONZE",
                    loyaltyProgram.pointsPerRwf
                );
                
                const totalNewPoints = baseBonus + earnedPoints;
                const currentTotal = (existingLoyalty?.points || 0) + totalNewPoints;
                const nextTier = determineTier(currentTotal);

                if (existingLoyalty) {
                    await tx.loyaltyPoint.update({
                        where: { id: existingLoyalty.id },
                        data: {
                            points: { increment: totalNewPoints },
                            tier: nextTier
                        }
                    });
                } else {
                    await tx.loyaltyPoint.create({
                        data: {
                            clientId,
                            branchId: session.user.branchId!,
                            points: totalNewPoints,
                            tier: nextTier
                        }
                    });
                }
            }

            return m;
        });

        return NextResponse.json(membership, { status: 201 });
    } catch (error) {
        console.error("Failed to create membership:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
