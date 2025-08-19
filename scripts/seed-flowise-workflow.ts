import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Flowise workflow...');

  // Workflow de exemplo - Assistente Profissional
  const exampleWorkflow = {
    flowiseId: '112845a4-ee6d-4980-93ce-bf321f3f6346',
    name: 'Assistente Profissional',
    description: 'Assistente de IA profissional com capacidades avançadas de processamento de linguagem natural e tomada de decisão',
    type: 'ASSISTANT',
    flowData: JSON.stringify({
      nodes: [
        {
          id: '1',
          type: 'CustomNode',
          position: { x: 100, y: 100 },
          data: {
            label: 'Input',
            name: 'Input',
            category: 'Input',
            inputs: [],
            outputs: [{ name: 'text', type: 'string' }]
          }
        },
        {
          id: '2',
          type: 'CustomNode',
          position: { x: 300, y: 100 },
          data: {
            label: 'LLM',
            name: 'LLM',
            category: 'LLMs',
            inputs: [{ name: 'prompt', type: 'string' }],
            outputs: [{ name: 'response', type: 'string' }]
          }
        },
        {
          id: '3',
          type: 'CustomNode',
          position: { x: 500, y: 100 },
          data: {
            label: 'Output',
            name: 'Output',
            category: 'Output',
            inputs: [{ name: 'text', type: 'string' }],
            outputs: []
          }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          sourceHandle: 'text',
          targetHandle: 'prompt'
        },
        {
          id: 'e2-3',
          source: '2',
          target: '3',
          sourceHandle: 'response',
          targetHandle: 'text'
        }
      ],
      viewport: { x: 0, y: 0, zoom: 1 }
    }),
    deployed: true,
    isPublic: true,
    category: 'professional',
    complexityScore: 75,
    nodeCount: 3,
    edgeCount: 2,
    maxDepth: 2,
    criticalPath: JSON.stringify(['1', '2', '3']),
    bottlenecks: JSON.stringify([]),
    optimizationSuggestions: JSON.stringify([
      'Adicionar memória de contexto',
      'Implementar streaming de resposta',
      'Adicionar tratamento de erros'
    ]),
    nodes: JSON.stringify([
      {
        id: '1',
        type: 'CustomNode',
        category: 'Input',
        name: 'Input',
        position: { x: 100, y: 100 },
        inputs: [],
        outputs: [{ name: 'text', type: 'string' }]
      },
      {
        id: '2',
        type: 'CustomNode',
        category: 'LLMs',
        name: 'LLM',
        position: { x: 300, y: 100 },
        inputs: [{ name: 'prompt', type: 'string' }],
        outputs: [{ name: 'response', type: 'string' }]
      },
      {
        id: '3',
        type: 'CustomNode',
        category: 'Output',
        name: 'Output',
        position: { x: 500, y: 100 },
        inputs: [{ name: 'text', type: 'string' }],
        outputs: []
      }
    ]),
    connections: JSON.stringify([
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        sourceHandle: 'text',
        targetHandle: 'prompt'
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        sourceHandle: 'response',
        targetHandle: 'text'
      }
    ]),
    capabilities: JSON.stringify({
      canHandleFileUpload: false,
      hasStreaming: true,
      supportsMultiLanguage: true,
      hasMemory: false,
      usesExternalAPIs: false,
      hasAnalytics: false,
      supportsParallelProcessing: false,
      hasErrorHandling: false
    }),
    lastSyncAt: new Date(),
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date()
  };

  try {
    // Verificar se o workflow já existe
    const existing = await prisma.flowiseWorkflow.findUnique({
      where: { flowiseId: exampleWorkflow.flowiseId }
    });

    if (existing) {
      console.log('Workflow já existe, atualizando...');
      await prisma.flowiseWorkflow.update({
        where: { flowiseId: exampleWorkflow.flowiseId },
        data: exampleWorkflow
      });
    } else {
      console.log('Criando novo workflow...');
      await prisma.flowiseWorkflow.create({
        data: exampleWorkflow
      });
    }

    console.log('Workflow seeded successfully!');
  } catch (error) {
    console.error('Error seeding workflow:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);