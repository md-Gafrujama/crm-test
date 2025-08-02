import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function migrateLeads() {
  try {
    console.log('Starting lead migration...')

    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        rootVersionId: true,
        versionNumber: true,
        isCurrentVersion: true
      }
    })

    console.log(`Found ${leads.length} leads to process`)

    const BATCH_SIZE = 100
    for (let i = 0; i < leads.length; i += BATCH_SIZE) {
      const batch = leads.slice(i, i + BATCH_SIZE)
      
      await prisma.$transaction(
        batch.map(lead => 
          prisma.lead.update({
            where: { id: lead.id },
            data: {
              rootVersionId: lead.rootVersionId || lead.id,
              versionNumber: lead.versionNumber ?? 1,
              isCurrentVersion: lead.isCurrentVersion ?? true
            }
          })
        )
      )
      
      console.log(`Processed batch ${i/BATCH_SIZE + 1} of ${Math.ceil(leads.length/BATCH_SIZE)}`)
    }

    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateLeads()