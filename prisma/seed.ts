import { PrismaClient, PaymentMode } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ override: true });

const connectionString = (process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? "").trim();

if (!connectionString) {
    console.error("❌ DATABASE_URL / DIRECT_URL is not set. Check your .env file.");
    process.exit(1);
}

// Use native PrismaClient (TCP) – same strategy as lib/prisma.ts in dev mode.
// The Neon serverless Pool adapter is designed for edge runtimes, not Node scripts.
const prisma = new PrismaClient({
    datasources: { db: { url: connectionString } },
});

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Note: The destructive "clean up existing data" block has been permanently removed 
    // to prevent accidental data loss. Seed operations should be additive or upsert-based.

    // 2. Setup Base Entities
    console.log('Creating Compliance and Platform Packages...');
    await prisma.compliance.create({
      data: { region: 'RWANDA', taxRate: 18.0, currency: 'RWF' }
    });

    console.log('Creating Platform Packages...');
    // Prices in RWF to match landing page
    const packages = [
      { name: 'Essential', priceMonthly: 50000, priceYearly: 500000, branchLimit: 1, features: ['Up to 500 Check-ins/mo', 'QR Code Scanner', 'Mobile Money Payments', 'Standard Support'], description: 'Core operations for single-location boutique spas.' },
      { name: 'Premium', priceMonthly: 150000, priceYearly: 1500000, branchLimit: 3, features: ['Unlimited Check-ins', 'Advanced Analytics', 'Up to 3 Branches', 'Staff Scheduling', 'Priority WhatsApp Support'], description: 'Advanced features for growing wellness centers.' },
      { name: 'Elite', priceMonthly: 350000, priceYearly: 3500000, branchLimit: 50, features: ['White-labeled Platform', 'Custom API Integration', 'Dedicated Manager', 'On-site Staff Training', 'Unlimited Branches'], description: 'Unlimited potential for large luxury resorts & chains.', isCustom: true },
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

        // Seed lockers for this branch
        const lockerDefs = [
            { name: 'Locker 1',  lockerNumber: 'L-101', type: 'Swedish Massage',   order: 1 },
            { name: 'Locker 2',  lockerNumber: 'L-102', type: 'Infrared Sauna',    order: 2 },
            { name: 'Locker 3',  lockerNumber: 'L-103', type: 'Aromatherapy',      order: 3 },
            { name: 'Locker 4',  lockerNumber: 'L-104', type: 'Deep Tissue',       order: 4 },
            { name: 'Locker 5',  lockerNumber: 'L-105', type: 'Steam Room',        order: 5 },
            { name: 'Locker 6',  lockerNumber: 'L-106', type: 'Hot Stone',         order: 6 },
            { name: 'Locker 7',  lockerNumber: 'L-107', type: 'Sauna Therapy',     order: 7 },
            { name: 'Locker 8',  lockerNumber: 'L-108', type: 'Relaxation Suite',  order: 8 },
            { name: 'Locker 9',  lockerNumber: 'L-109', type: "Couple's Suite",    order: 9 },
            { name: 'Locker 10', lockerNumber: 'L-110', type: 'VIP Steam Room',    order: 10 },
        ];
        await prisma.locker.createMany({
            data: lockerDefs.map(l => ({ ...l, branchId: branch.id }))
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
            lockerNumber: `L-10${Math.floor(Math.random() * 10) + 1}`,
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
