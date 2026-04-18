import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Check all tables for schema drift
    const tables = ['service_records', 'loyalty_points', 'commission_logs', 'memberships']
    
    for (const table of tables) {
      try {
        const result = await prisma.$queryRawUnsafe(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = '${table}'
          ORDER BY ordinal_position;
        `) as any[]
        console.log(`\n=== ${table} ===`)
        console.log(result.map((r: any) => `  ${r.column_name}: ${r.data_type}`).join('\n'))
      } catch (e: any) {
        console.log(`\n=== ${table} === ERROR: ${e.message}`)
      }
    }

    // Verify the branchId alias works in a real query
    console.log('\n=== Testing ServiceRecord query ===')
    const count = await prisma.serviceRecord.count()
    console.log(`Total service records: ${count}`)

    // Check if loyalty points table has branchId column
    console.log('\n=== Testing LoyaltyPoint query ===')
    try {
      const lpCount = await prisma.loyaltyPoint.count()
      console.log(`Total loyalty points: ${lpCount}`)
    } catch (e: any) {
      console.log(`LoyaltyPoint error: ${e.message}`)
    }

  } catch (error: any) {
    console.error('Fatal error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
