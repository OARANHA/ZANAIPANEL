const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugWorkflows() {
  try {
    console.log('🔍 Debugging Flowise workflows...\n');

    // Verificar se a tabela existe e contar registros
    const workflowCount = await prisma.flowiseWorkflow.count();
    console.log(`📊 Total workflows in database: ${workflowCount}`);

    if (workflowCount > 0) {
      // Buscar todos workflows
      const workflows = await prisma.flowiseWorkflow.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      console.log('\n📋 Recent workflows:');
      workflows.forEach((workflow, index) => {
        console.log(`\n${index + 1}. ${workflow.name}`);
        console.log(`   ID: ${workflow.id}`);
        console.log(`   Flowise ID: ${workflow.flowiseId}`);
        console.log(`   Type: ${workflow.type}`);
        console.log(`   Category: ${workflow.category}`);
        console.log(`   Created: ${workflow.createdAt}`);
        console.log(`   Last Sync: ${workflow.lastSyncAt || 'Never'}`);
      });
    } else {
      console.log('❌ No workflows found in database');
    }

    // Verificar também a tabela de agentes
    const agentCount = await prisma.agent.count();
    console.log(`\n📊 Total agents in database: ${agentCount}`);

    if (agentCount > 0) {
      const recentAgents = await prisma.agent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      console.log('\n📋 Recent agents:');
      recentAgents.forEach((agent, index) => {
        console.log(`\n${index + 1}. ${agent.name}`);
        console.log(`   ID: ${agent.id}`);
        console.log(`   Type: ${agent.type}`);
        console.log(`   Created: ${agent.createdAt}`);
      });
    }

    // Verificar sync logs
    const syncLogCount = await prisma.syncLog.count();
    console.log(`\n📊 Total sync logs: ${syncLogCount}`);

    if (syncLogCount > 0) {
      const recentLogs = await prisma.syncLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      console.log('\n📋 Recent sync logs:');
      recentLogs.forEach((log, index) => {
        console.log(`\n${index + 1}. ${log.action}`);
        console.log(`   Status: ${log.status}`);
        console.log(`   Flowise ID: ${log.flowiseId || 'N/A'}`);
        console.log(`   Created: ${log.createdAt}`);
        if (log.details) {
          console.log(`   Details: ${JSON.stringify(log.details)}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error debugging workflows:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugWorkflows();