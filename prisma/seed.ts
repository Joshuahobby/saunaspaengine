import { PrismaClient, PaymentMode } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import ws from 'ws';

dotenv.config({ override: true });

// Setup WebSocket for serverless driver in Node environment (Windows compatibility)
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL || "";

let prisma: PrismaClient;

try {
    if (!connectionString) throw new Error("DATABASE_URL is missing");
    
    // Configure pool and adapter for the serverless driver
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    
    prisma = new PrismaClient({ adapter });
} catch (err) {
    console.error("Initialization error with Neon adapter:", err);
    console.log("Falling back to native client...");
    prisma = new PrismaClient();
}

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Clean up existing data (following dependency order)
    console.log('Cleaning up existing data...');
    await prisma.commissionLog.deleteMany();
    await prisma.review.deleteMany();
    await prisma.serviceRecord.deleteMany();
    await prisma.shift.deleteMany();
    await prisma.employeePayout.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.loyaltyPoint.deleteMany();
    await prisma.safetyAlert.deleteMany();
    await prisma.inventoryLog.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.broadcast.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.service.deleteMany();
    await prisma.membershipCategory.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.employeeCategory.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();
    await prisma.loyaltyProgram.deleteMany();
    await prisma.branch.deleteMany();
    await prisma.business.deleteMany();
    await prisma.platformPackage.deleteMany();
    await prisma.compliance.deleteMany();
    await prisma.settlement.deleteMany();

    // 2. Setup Base Entities
    console.log('Creating Compliance and Platform Packages...');
    await prisma.compliance.create({
      data: { region: 'RWANDA', taxRate: 18.0, currency: 'RWF' }
    });

    console.log('Creating Platform Packages...');
    const packages = [
      { name: 'Essential', priceMonthly: 49, priceYearly: 490, branchLimit: 3, description: 'Core operations for small wellness centers.' },
      { name: 'Premium', priceMonthly: 99, priceYearly: 990, branchLimit: 10, description: 'Advanced features for growing spa chains.' },
      { name: 'Elite', priceMonthly: 199, priceYearly: 1990, branchLimit: 50, description: 'Unlimited potential for large luxury resorts.' },
    ];

    const platformPackages = [];
    for (const pkg of packages) {
      const p = await prisma.platformPackage.create({ data: pkg });
      platformPackages.push(p);
    }

    const rootOrg = await prisma.business.create({
      data: {
        name: 'Sauna SPA Global',
        taxId: 'TIN-000000',
        headquarters: 'Kigali, Rwanda',
        subscriptionPlanId: platformPackages[1].id, // Default to Premium
        subscriptionCycle: 'Monthly',
        subscriptionRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        approvalStatus: 'APPROVED',
        kycVerifiedAt: new Date(),
      }
    });


    // 3. Create Shared Passwords
    const defaultPassword = await bcrypt.hash('password123', 10);

    // 4. Create Users (Admin, Business)
    await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@saunaspa.com',
        fullName: 'System Administrator',
        passwordHash: defaultPassword,
        role: 'ADMIN',
      }
    });

    await prisma.user.create({
      data: {
        username: 'business',
        email: 'ceo@saunaspa.com',
        fullName: 'Global Director',
        passwordHash: defaultPassword,
        role: 'OWNER',
        usr_businessId: rootOrg.id
      }
    });

    // 5. Create Branches (Branches)
    console.log('Creating Branches & Managers...');
    const branchesData = [
      { name: 'Kigali Central Node', address: 'KG 7 Ave', phone: '+250780000001' },
      { name: 'Mille Collines Retreat', address: 'KN 3 Ave', phone: '+250780000002' },
      { name: 'Nyabugogo Gateway', address: 'KN 1 Rd', phone: '+250780000003' },
    ];

    const branches = [];
    for (let i = 0; i < branchesData.length; i++) {
        const branch = await prisma.branch.create({
            data: {
                ...branchesData[i],
                businessId: rootOrg.id,
                loyaltyPrograms: {
                    create: { pointsPerRwf: 0.05 }
                }
            }
        });
        branches.push(branch);

        // Manager for this branch
        await prisma.user.create({
            data: {
                username: `manager_branch${i+1}`,
                email: `manager${i+1}@saunaspa.com`,
                fullName: `Branch Manager ${i+1}`,
                passwordHash: defaultPassword,
                role: 'MANAGER',
                usr_branchId: branch.id
            }
        });
    }

    const branch1Id = branches[0].id; // We'll seed heavy data into Branch 1

    // 6. Branch 1 Specifics (Categories, Employees, Services)
    console.log('Seeding employees and services for Kigali Central...');
    
    // Employee Categories
    const catTherapist = await prisma.employeeCategory.create({ data: { name: 'Massage Therapist', branchId: branch1Id } });
    const catReception = await prisma.employeeCategory.create({ data: { name: 'Receptionist', branchId: branch1Id } });
    
    // Employees
    const emp1 = await prisma.employee.create({ data: { fullName: 'Sarah M.', categoryId: catTherapist.id, branchId: branch1Id } });
    const emp2 = await prisma.employee.create({ data: { fullName: 'John D.', categoryId: catTherapist.id, branchId: branch1Id } });
    await prisma.employee.create({ data: { fullName: 'Alice R.', categoryId: catReception.id, branchId: branch1Id } });

    // Ensure Employee logins exist
    await prisma.user.create({
        data: {
            username: 'sarah',
            email: 'sarah@saunaspa.com',
            fullName: 'Sarah M.',
            passwordHash: defaultPassword,
            role: 'EMPLOYEE',
            usr_branchId: branch1Id
        }
    });

    // Services
    const srv1 = await prisma.service.create({ data: { name: 'Deep Tissue Massage', price: 25000, duration: 60, branchId: branch1Id, category: 'Massage' } });
    const srv2 = await prisma.service.create({ data: { name: 'Aromatherapy Sauna', price: 15000, duration: 30, branchId: branch1Id, category: 'Sauna' } });
    const srv3 = await prisma.service.create({ data: { name: 'Full Body Scrub', price: 30000, duration: 45, branchId: branch1Id, category: 'Treatment' } });

    // Inventory
    await prisma.inventory.createMany({
        data: [
            { productName: 'Premium Towels', stockCount: 150, minThreshold: 50, unit: 'pcs', branchId: branch1Id },
            { productName: 'Eucalyptus Oil', stockCount: 20, minThreshold: 5, unit: 'bottles', branchId: branch1Id },
            { productName: 'Massage Lotion', stockCount: 45, minThreshold: 10, unit: 'liters', branchId: branch1Id },
        ]
    });

    // Memberships & Clients
    console.log('Seeding clients & memberships...');
    const memCatGold = await prisma.membershipCategory.create({ data: { name: 'Gold Tier Subscription', type: 'SUBSCRIPTION', price: 150000, durationDays: 30, branchId: branch1Id } });
    const memCatPass = await prisma.membershipCategory.create({ data: { name: '10x Entry Pass', type: 'LIST_PASS', price: 100000, usageLimit: 10, branchId: branch1Id } });

    const clients = [];
    for (let i = 1; i <= 20; i++) {
        const c = await prisma.client.create({
            data: {
                fullName: `Test Client ${i}`,
                phone: `+250780100${i.toString().padStart(3, '0')}`,
                clientType: i <= 5 ? 'MEMBER' : 'WALK_IN',
                qrCode: `CLIENT-QR-${i}`,
                branchId: branch1Id
            }
        });
        clients.push(c);

        if (i <= 5) {
            await prisma.membership.create({
                data: {
                    clientId: c.id,
                    categoryId: i <= 2 ? memCatGold.id : memCatPass.id,
                    status: 'ACTIVE',
                    balance: i > 2 ? 10 : null
                }
            });
        }
    }

    // 7. Seed Massive ServiceRecords for Analytics Testing
    console.log('Generating 90 days of synthetic service records...');
    const recordsToCreate = [];
    const now = new Date();
    
    // We'll generate ~500 records spanning the last 90 days
    const totalRecords = 500;
    for (let i = 0; i < totalRecords; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 90);
        const randomHours = Math.floor(Math.random() * 10) + 9; // Between 9am and 7pm
        const randomMins = Math.floor(Math.random() * 60);
        
        const recordDate = new Date(now);
        recordDate.setDate(now.getDate() - randomDaysAgo);
        recordDate.setHours(randomHours, randomMins, 0, 0);

        const srv = [srv1, srv2, srv3][Math.floor(Math.random() * 3)];
        const client = clients[Math.floor(Math.random() * clients.length)];
        const empId = srv.name.includes('Massage') ? (Math.random() > 0.5 ? emp1.id : emp2.id) : null;
        
        const paymentModes: PaymentMode[] = ['CASH', 'MOMO', 'POS'];
        const pMode = paymentModes[Math.floor(Math.random() * paymentModes.length)];

        recordsToCreate.push({
            clientId: client.id,
            serviceId: srv.id,
            employeeId: empId,
            branchId: branch1Id,
            boxNumber: `Room-${Math.floor(Math.random() * 5) + 1}`,
            paymentMode: pMode,
            amount: srv.price,
            status: 'COMPLETED' as const,
            completedAt: recordDate,
            createdAt: recordDate,
            updatedAt: recordDate
        });
    }

    // Insert records in batches
    console.log(`Inserting ${recordsToCreate.length} records...`);
    await prisma.serviceRecord.createMany({
        data: recordsToCreate,
    });

    console.log('✅ Seeding completed successfully!');
    console.log('---');
    console.log('Test Accounts (Password: password123):');
    console.log('Admin:     admin@saunaspa.com');
    console.log('Business: ceo@saunaspa.com');
    console.log('Manager 1:   manager1@saunaspa.com');
    console.log('Employee:  sarah@saunaspa.com');

  } catch (e) {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
