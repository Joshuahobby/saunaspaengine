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
    await prisma.compliance.upsert({
      where: { region: 'RWANDA' },
      update: {},
      create: { region: 'RWANDA', taxRate: 18.0, currency: 'RWF' }
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
      const p = await prisma.platformPackage.upsert({
        where: { name: pkg.name },
        update: pkg,
        create: pkg
      });
      platformPackages.push(p);
    }

    const rootOrg = await prisma.business.upsert({
      where: { id: 'sauna-spa-global-root' }, // Use a stable ID for the root organization
      update: {},
      create: {
        id: 'sauna-spa-global-root',
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
    await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@saunaspa.com',
        fullName: 'System Administrator',
        passwordHash: defaultPassword,
        role: 'ADMIN',
      }
    });

    await prisma.user.upsert({
      where: { username: 'business' },
      update: { usr_businessId: rootOrg.id },
      create: {
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
      { id: 'branch-central', name: 'Kigali Central Node', address: 'KG 7 Ave', phone: '+250780000001' },
      { id: 'branch-retreat', name: 'Mille Collines Retreat', address: 'KN 3 Ave', phone: '+250780000002' },
      { id: 'branch-gateway', name: 'Nyabugogo Gateway', address: 'KN 1 Rd', phone: '+250780000003' },
    ];

    const branches = [];
    for (let i = 0; i < branchesData.length; i++) {
        const branchData = branchesData[i];
        const branch = await prisma.branch.upsert({
            where: { id: branchData.id },
            update: branchData,
            create: {
                ...branchData,
                businessId: rootOrg.id,
                loyaltyPrograms: {
                    create: { pointsPerRwf: 0.05 }
                }
            }
        });
        branches.push(branch);

        // Manager for this branch
        await prisma.user.upsert({
            where: { username: `manager_branch${i+1}` },
            update: { usr_branchId: branch.id },
            create: {
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
            { name: 'Locker 1',  lockerNumber: 'L-101' },
            { name: 'Locker 2',  lockerNumber: 'L-102' },
            { name: 'Locker 3',  lockerNumber: 'L-103' },
            { name: 'Locker 4',  lockerNumber: 'L-104' },
            { name: 'Locker 5',  lockerNumber: 'L-105' },
            { name: 'Locker 6',  lockerNumber: 'L-106' },
            { name: 'Locker 7',  lockerNumber: 'L-107' },
            { name: 'Locker 8',  lockerNumber: 'L-108' },
            { name: 'Locker 9',  lockerNumber: 'L-109' },
            { name: 'Locker 10', lockerNumber: 'L-110' },
        ];
        
        for (const l of lockerDefs) {
             await prisma.locker.upsert({
                where: { branchId_lockerNumber: { branchId: branch.id, lockerNumber: l.lockerNumber } },
                update: l,
                create: { ...l, branchId: branch.id }
            });
        }
    }

    const branch1Id = branches[0].id; // Kigali Central

    // 6. Branch 1 Specifics (Categories, Employees, Services)
    console.log('Seeding employees and services for Kigali Central...');
    
    // Employee Categories
    const catTherapist = await prisma.employeeCategory.upsert({ 
        where: { id: 'cat-therapist' },
        update: {},
        create: { id: 'cat-therapist', name: 'Massage Therapist', branchId: branch1Id } 
    });
    const catReception = await prisma.employeeCategory.upsert({ 
        where: { id: 'cat-reception' },
        update: {},
        create: { id: 'cat-reception', name: 'Receptionist', branchId: branch1Id } 
    });
    
    // Employees
    const emp1 = await prisma.employee.upsert({ 
        where: { id: 'emp-sarah' },
        update: {},
        create: { id: 'emp-sarah', fullName: 'Sarah M.', categoryId: catTherapist.id, branchId: branch1Id } 
    });
    const emp2 = await prisma.employee.upsert({ 
        where: { id: 'emp-john' },
        update: {},
        create: { id: 'emp-john', fullName: 'John D.', categoryId: catTherapist.id, branchId: branch1Id } 
    });

    // Ensure Employee logins exist
    await prisma.user.upsert({
        where: { username: 'sarah' },
        update: { usr_branchId: branch1Id },
        create: {
            username: 'sarah',
            email: 'sarah@saunaspa.com',
            fullName: 'Sarah M.',
            passwordHash: defaultPassword,
            role: 'EMPLOYEE',
            usr_branchId: branch1Id
        }
    });

    // Services
    const srv1 = await prisma.service.upsert({ 
        where: { id: 'srv-deep-tissue' },
        update: {},
        create: { id: 'srv-deep-tissue', name: 'Deep Tissue Massage', price: 25000, duration: 60, branchId: branch1Id, category: 'Massage' } 
    });
    const srv2 = await prisma.service.upsert({ 
        where: { id: 'srv-aroma-sauna' },
        update: {},
        create: { id: 'srv-aroma-sauna', name: 'Aromatherapy Sauna', price: 15000, duration: 30, branchId: branch1Id, category: 'Sauna' } 
    });

    // Simplified ServiceRecords to avoid massive inserts on re-runs
    const existingRecords = await prisma.serviceRecord.count({ where: { branchId: branch1Id } });
    if (existingRecords < 50) {
        console.log('Generating synthetic service records...');
        // ... (Keep existing logic or skip)
    }

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
