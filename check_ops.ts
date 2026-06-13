import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    // Simulate resolveEffectiveBranchId — get first active branch
    const branches = await prisma.branch.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true },
      take: 3
    })
    console.log('Active branches:', JSON.stringify(branches, null, 2))

    if (!branches.length) {
      console.log('❌ NO ACTIVE BRANCHES — page would return null without error')
      return
    }

    const branchId = branches[0].id
    console.log(`\nUsing branchId: ${branchId}`)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    console.log(`Today start: ${today.toISOString()}`)

    // Simulate TodaysActivityTab query
    console.log('\n--- Testing TodaysActivityTab queries ---')
    const [records, totalCount] = await Promise.all([
      prisma.serviceRecord.findMany({
        where: { branchId, createdAt: { gte: today } },
        include: {
          client: { select: { fullName: true, phone: true } },
          service: { select: { name: true } },
          employee: { select: { fullName: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.serviceRecord.count({
        where: { branchId, createdAt: { gte: today } }
      })
    ])
    console.log(`✅ Records today: ${totalCount}`)
    if (records.length > 0) {
      console.log('First record status:', records[0].status)
      console.log('First record fields:', Object.keys(records[0]))
    }

    // Simulate checkout completeServiceRecord
    console.log('\n--- Testing completeServiceRecord dependencies ---')
    
    const compliance = await prisma.compliance.findFirst({ where: { region: 'RWANDA' } })
    console.log(`✅ Compliance: ${compliance ? 'found' : '⚠️ NOT FOUND (will use defaults)'}`)

    const branchWithBusiness = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { business: { select: { platformCommissionRate: true } } }
    })
    console.log(`✅ Branch+Business: ${branchWithBusiness ? 'found' : '⚠️ NOT FOUND'}`)

    // Loyalty program
    const loyaltyProgram = await prisma.loyaltyProgram.findFirst({
      where: { branchId, status: 'ACTIVE' }
    })
    console.log(`✅ Loyalty program: ${loyaltyProgram ? 'found' : 'not found (skipped)'}`)

    // Test the room-map-tab too — check if Locker model exists
    console.log('\n--- Testing Locker model ---')
    try {
      const lockerCount = await (prisma as any).locker.count()
      console.log(`✅ Lockers: ${lockerCount}`)
    } catch (e: any) {
      console.log(`❌ Locker query failed: ${e.message}`)
    }

    // Check for any migration drift
    console.log('\n--- Checking latest migration status ---')
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at 
      FROM "_prisma_migrations" 
      ORDER BY started_at DESC 
      LIMIT 5
    ` as any[]
    console.log('Recent migrations:')
    migrations.forEach((m: any) => console.log(`  ${m.migration_name}: ${m.finished_at ? '✅' : '❌ PENDING'}`))

    console.log('\n✅ ALL CHECKS PASSED')
  } catch (e: any) {
    console.error('\n❌ ERROR:', e.message)
    console.error('Code:', e.code)
    console.error('Meta:', e.meta)
  } finally {
    await prisma.$disconnect()
  }
}
main()
