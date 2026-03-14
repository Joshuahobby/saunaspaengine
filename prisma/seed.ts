import { PrismaClient, PaymentMode } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Clean up existing data (optional, but good for idempotency)
    console.log('Cleaning up existing data...');
    await prisma.serviceRecord.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.loyaltyPoint.deleteMany();
    await prisma.safetyAlert.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.broadcast.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.service.deleteMany();
    await prisma.membershipCategory.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.employeeCategory.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();
    await prisma.loyaltyProgram.deleteMany();
    await prisma.business.deleteMany();
    await prisma.corporate.deleteMany();
    await prisma.platformPackage.deleteMany();
    await prisma.compliance.deleteMany();

    // 2. Setup Base Entities
    console.log('Creating Compliance and Platform Packages...');
    const compliance = await prisma.compliance.create({
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

    const rootOrg = await prisma.corporate.create({
      data: {
        name: 'Sauna SPA Global',
        taxId: 'TIN-000000',
        headquarters: 'Kigali, Rwanda',
        subscriptionPlanId: platformPackages[1].id, // Default to Premium
        subscriptionCycle: 'Monthly',
        subscriptionStatus: 'ACTIVE',
        subscriptionRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    // 3. Create Shared Passwords
    const defaultPassword = await bcrypt.hash('password123', 10);

    // 4. Create Users (Admin, Corporate)
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@saunaspa.com',
        fullName: 'System Administrator',
        passwordHash: defaultPassword,
        role: 'ADMIN',
      }
    });

    const corpUser = await prisma.user.create({
      data: {
        username: 'corporate',
        email: 'ceo@saunaspa.com',
        fullName: 'Global Director',
        passwordHash: defaultPassword,
        role: 'CORPORATE',
        corporateId: rootOrg.id
      }
    });

    // 5. Create Businesses (Branches)
    console.log('Creating Businesses & Owners...');
    const branchesData = [
      { name: 'Kigali Central Node', address: 'KG 7 Ave', phone: '+250780000001' },
      { name: 'Mille Collines Retreat', address: 'KN 3 Ave', phone: '+250780000002' },
      { name: 'Nyabugogo Gateway', address: 'KN 1 Rd', phone: '+250780000003' },
    ];

    const branches = [];
    for (let i = 0; i < branchesData.length; i++) {
        const branch = await prisma.business.create({
            data: {
                ...branchesData[i],
                corporateId: rootOrg.id,
                loyaltyPrograms: {
                    create: { pointsPerRwf: 0.05 }
                }
            }
        });
        branches.push(branch);

        // Owner for this branch
        await prisma.user.create({
            data: {
                username: `owner_branch${i+1}`,
                email: `owner${i+1}@saunaspa.com`,
                fullName: `Branch Owner ${i+1}`,
                passwordHash: defaultPassword,
                role: 'OWNER',
                businessId: branch.id
            }
        });
    }

    const branch1Id = branches[0].id; // We'll seed heavy data into Branch 1

    // 6. Branch 1 Specifics (Categories, Employees, Services)
    console.log('Seeding employees and services for Kigali Central...');
    
    // Employee Categories
    const catTherapist = await prisma.employeeCategory.create({ data: { name: 'Massage Therapist', businessId: branch1Id } });
    const catReception = await prisma.employeeCategory.create({ data: { name: 'Receptionist', businessId: branch1Id } });
    
    // Employees
    const emp1 = await prisma.employee.create({ data: { fullName: 'Sarah M.', categoryId: catTherapist.id, businessId: branch1Id } });
    const emp2 = await prisma.employee.create({ data: { fullName: 'John D.', categoryId: catTherapist.id, businessId: branch1Id } });
    const emp3 = await prisma.employee.create({ data: { fullName: 'Alice R.', categoryId: catReception.id, businessId: branch1Id } });

    // Ensure Employee logins exist
    await prisma.user.create({
        data: {
            username: 'sarah',
            email: 'sarah@saunaspa.com',
            fullName: 'Sarah M.',
            passwordHash: defaultPassword,
            role: 'EMPLOYEE',
            businessId: branch1Id
        }
    });

    // Services
    const srv1 = await prisma.service.create({ data: { name: 'Deep Tissue Massage', price: 25000, duration: 60, businessId: branch1Id, category: 'Massage' } });
    const srv2 = await prisma.service.create({ data: { name: 'Aromatherapy Sauna', price: 15000, duration: 30, businessId: branch1Id, category: 'Sauna' } });
    const srv3 = await prisma.service.create({ data: { name: 'Full Body Scrub', price: 30000, duration: 45, businessId: branch1Id, category: 'Treatment' } });

    // Inventory
    await prisma.inventory.createMany({
        data: [
            { productName: 'Premium Towels', stockCount: 150, minThreshold: 50, unit: 'pcs', businessId: branch1Id },
            { productName: 'Eucalyptus Oil', stockCount: 20, minThreshold: 5, unit: 'bottles', businessId: branch1Id },
            { productName: 'Massage Lotion', stockCount: 45, minThreshold: 10, unit: 'liters', businessId: branch1Id },
        ]
    });

    // Memberships & Clients
    console.log('Seeding clients & memberships...');
    const memCatGold = await prisma.membershipCategory.create({ data: { name: 'Gold Tier Subscription', type: 'SUBSCRIPTION', price: 150000, durationDays: 30, businessId: branch1Id } });
    const memCatPass = await prisma.membershipCategory.create({ data: { name: '10x Entry Pass', type: 'LIST_PASS', price: 100000, usageLimit: 10, businessId: branch1Id } });

    const clients = [];
    for (let i = 1; i <= 20; i++) {
        const c = await prisma.client.create({
            data: {
                fullName: `Test Client ${i}`,
                phone: `+250780100${i.toString().padStart(3, '0')}`,
                clientType: i <= 5 ? 'MEMBER' : 'WALK_IN',
                qrCode: `CLIENT-QR-${i}`,
                businessId: branch1Id
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
            businessId: branch1Id,
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
    console.log('Corporate: ceo@saunaspa.com');
    console.log('Owner 1:   owner1@saunaspa.com');
    console.log('Employee:  sarah@saunaspa.com');

  } catch (e) {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
