/**
 * Script to sync existing agents with Flowise workflows
 */

const { PrismaClient } = require('@prisma/client');
const yaml = require('js-yaml');

const prisma = new PrismaClient();

async function syncExistingAgents() {
  try {
    console.log('🔄 Syncing existing agents with Flowise workflows...\n');

    // Get all existing agents
    const agents = await prisma.agent.findMany({
      include: {
        workspace: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Found ${agents.length} agents to sync\n`);

    for (const agent of agents) {
      console.log(`🔄 Processing agent: ${agent.name} (${agent.id})`);
      
      try {
        // Parse agent config to get persona and context
        const config = yaml.load(agent.config) || {};
        const knowledge = agent.knowledge || '';
        
        // Extract persona and context from config or create defaults
        let persona = {
          name: agent.name,
          role: config.role || 'Assistant',
          personality: config.personality || 'Helpful',
          expertise: config.expertise || ['General Assistance'],
          communicationStyle: 'Professional',
          language: 'pt'
        };

        let context = {
          businessDomain: config.businessDomain || 'General Support',
          industry: config.industry || 'Technology',
          targetAudience: config.targetAudience || 'General Users'
        };

        // Try to extract from knowledge base if available
        if (knowledge) {
          // Simple extraction - in real implementation this would be more sophisticated
          const nameMatch = knowledge.match(/## Perfil do Agente\*\*.*?\*\*Nome:\*\* (.+)/);
          const roleMatch = knowledge.match(/\*\*Função:\*\* (.+)/);
          const expertiseMatch = knowledge.match(/## Áreas de Expertise\s*([\s\S]*?)##/);
          
          if (nameMatch) persona.name = nameMatch[1];
          if (roleMatch) persona.role = roleMatch[1];
          if (expertiseMatch) {
            const expertiseLines = expertiseMatch[1].split('\n').filter(line => line.trim().startsWith('- '));
            persona.expertise = expertiseLines.map(line => line.replace('- ', '').trim());
          }
        }

        // Create Flowise workflow data (simplified version)
        const flowiseWorkflowData = {
          id: `flowise_${agent.id}`,
          name: agent.name,
          description: agent.description || `Workflow for ${agent.name}`,
          type: 'CHATFLOW',
          flowData: JSON.stringify({
            nodes: [
              {
                id: '1',
                type: 'customNode',
                position: { x: 100, y: 100 },
                data: {
                  label: 'Chat Input',
                  name: 'chatInput',
                  category: 'Input',
                  inputs: [],
                  outputs: [{ type: 'message', name: 'message' }]
                }
              },
              {
                id: '2',
                type: 'customNode',
                position: { x: 300, y: 100 },
                data: {
                  label: 'LLM Chain',
                  name: 'llmChain',
                  category: 'LLMs',
                  inputs: [
                    { type: 'message', name: 'message' },
                    { type: 'systemPrompt', name: 'systemPrompt' }
                  ],
                  outputs: [{ type: 'message', name: 'response' }]
                }
              },
              {
                id: '3',
                type: 'customNode',
                position: { x: 500, y: 100 },
                data: {
                  label: 'Chat Output',
                  name: 'chatOutput',
                  category: 'Output',
                  inputs: [{ type: 'message', name: 'message' }],
                  outputs: []
                }
              }
            ],
            edges: [
              {
                id: 'e1-2',
                source: '1',
                target: '2',
                sourceHandle: 'message',
                targetHandle: 'message'
              },
              {
                id: 'e2-3',
                source: '2',
                target: '3',
                sourceHandle: 'response',
                targetHandle: 'message'
              }
            ]
          }),
          deployed: false,
          isPublic: false,
          category: 'general',
          createdDate: agent.createdAt,
          updatedDate: agent.updatedAt
        };

        // Check if workflow already exists
        const existingWorkflow = await prisma.flowiseWorkflow.findUnique({
          where: { flowiseId: flowiseWorkflowData.id }
        });

        if (existingWorkflow) {
          console.log(`  ⏭️  Workflow already exists, skipping...`);
          continue;
        }

        // Create workflow in database
        const workflow = await prisma.flowiseWorkflow.create({
          data: {
            flowiseId: flowiseWorkflowData.id,
            name: flowiseWorkflowData.name,
            description: flowiseWorkflowData.description,
            type: flowiseWorkflowData.type,
            flowData: flowiseWorkflowData.flowData,
            deployed: flowiseWorkflowData.deployed,
            isPublic: flowiseWorkflowData.isPublic,
            category: flowiseWorkflowData.category,
            workspaceId: agent.workspaceId,
            complexityScore: 25, // Simple workflow
            nodeCount: 3,
            edgeCount: 2,
            maxDepth: 2,
            capabilities: JSON.stringify({
              canHandleFileUpload: false,
              hasStreaming: false,
              supportsMultiLanguage: false,
              hasMemory: false,
              usesExternalAPIs: false,
              hasAnalytics: false,
              supportsParallelProcessing: false,
              hasErrorHandling: false
            }),
            nodes: JSON.stringify([
              { id: '1', type: 'customNode', category: 'Input', name: 'chatInput' },
              { id: '2', type: 'customNode', category: 'LLMs', name: 'llmChain' },
              { id: '3', type: 'customNode', category: 'Output', name: 'chatOutput' }
            ]),
            connections: JSON.stringify([
              { id: 'e1-2', source: '1', target: '2' },
              { id: 'e2-3', source: '2', target: '3' }
            ]),
            lastSyncAt: new Date(),
            createdAt: flowiseWorkflowData.createdDate,
            updatedAt: flowiseWorkflowData.updatedDate
          }
        });

        console.log(`  ✅ Created workflow: ${workflow.id}`);

        // Create sync log
        await prisma.syncLog.create({
          data: {
            action: 'WORKFLOW_REGISTERED',
            flowiseId: flowiseWorkflowData.id,
            details: JSON.stringify({
              name: flowiseWorkflowData.name,
              type: flowiseWorkflowData.type,
              agentId: agent.id,
              complexity: 25
            }),
            status: 'SUCCESS'
          }
        });

      } catch (error) {
        console.error(`  ❌ Error processing agent ${agent.id}:`, error.message);
      }
    }

    // Count final results
    const finalWorkflowCount = await prisma.flowiseWorkflow.count();
    const finalSyncLogCount = await prisma.syncLog.count();

    console.log(`\n🎉 Sync completed!`);
    console.log(`📊 Final workflow count: ${finalWorkflowCount}`);
    console.log(`📊 Final sync log count: ${finalSyncLogCount}`);

  } catch (error) {
    console.error('❌ Sync failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncExistingAgents();