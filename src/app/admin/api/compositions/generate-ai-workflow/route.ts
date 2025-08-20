import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  status: 'active' | 'inactive' | 'training';
}

interface GenerateWorkflowRequest {
  description: string;
  workflowType: 'sequential' | 'parallel' | 'conditional';
  complexity: 'simple' | 'medium' | 'complex';
  workspaceId: string;
  availableAgents: Agent[];
}

interface GeneratedWorkflow {
  name: string;
  description: string;
  nodes: Array<{
    id: string;
    type: string;
    name: string;
    description: string;
    config: Record<string, any>;
  }>;
  edges: Array<{
    source: string;
    target: string;
    type: string;
  }>;
  agents: string[];
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateWorkflowRequest;
    const { description, workflowType, complexity, workspaceId, availableAgents } = body;

    if (!description || !workspaceId) {
      return NextResponse.json(
        { error: 'Descrição e workspaceId são obrigatórios' },
        { status: 400 }
      );
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create();

    // Create prompt for AI workflow generation
    const systemPrompt = `Você é um especialista em criação de workflows de IA usando o Flowise AgentFlow V2. 
Sua tarefa é analisar a descrição do usuário e gerar uma estrutura de workflow completa.

Regras:
1. Gere workflows que utilizem os agentes disponíveis fornecidos
2. Crie nós e conexões lógicas baseadas no tipo de workflow (sequencial, paralelo, condicional)
3. Adapte a complexidade conforme solicitado (simples, médio, complexo)
4. Seja específico e prático nas configurações
5. Retorne um JSON válido com a estrutura completa

Formato de resposta esperado:
{
  "name": "Nome do workflow gerado",
  "description": "Descrição detalhada do workflow",
  "nodes": [
    {
      "id": "node_1",
      "type": "tipo do nó (ex: CustomNode, LLMNode, ToolNode)",
      "name": "Nome do nó",
      "description": "Descrição da função deste nó",
      "config": {
        "chave": "valor"
      }
    }
  ],
  "edges": [
    {
      "source": "node_1",
      "target": "node_2",
      "type": "tipo de conexão"
    }
  ],
  "agents": ["agent_id_1", "agent_id_2"],
  "complexity": "simple|medium|complex",
  "estimatedTime": "tempo estimado"
}`;

    const userPrompt = `Descrição do workflow: ${description}

Tipo de workflow: ${workflowType}
Complexidade: ${complexity}

Agentes disponíveis:
${availableAgents.map(agent => `- ID: ${agent.id}, Nome: ${agent.name}, Descrição: ${agent.description}, Tipo: ${agent.type}`).join('\n')}

Gere um workflow completo que atenda aos requisitos acima, utilizando os agentes disponíveis de forma eficiente.`;

    try {
      // Generate workflow using AI
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const aiResponse = completion.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('Resposta da IA não recebida');
      }

      // Parse the AI response
      let generatedWorkflow: GeneratedWorkflow;
      try {
        // Extract JSON from the response (in case AI adds additional text)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('JSON não encontrado na resposta');
        }
        
        generatedWorkflow = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Erro ao parsear resposta da IA:', parseError);
        console.error('Resposta bruta:', aiResponse);
        
        // Fallback: create a basic workflow structure
        generatedWorkflow = createFallbackWorkflow(description, workflowType, complexity, availableAgents);
      }

      // Validate and enhance the generated workflow
      const validatedWorkflow = validateAndEnhanceWorkflow(generatedWorkflow, availableAgents, complexity);

      return NextResponse.json(validatedWorkflow);

    } catch (aiError) {
      console.error('Erro ao gerar workflow com IA:', aiError);
      
      // Fallback to basic workflow generation
      const fallbackWorkflow = createFallbackWorkflow(description, workflowType, complexity, availableAgents);
      return NextResponse.json(fallbackWorkflow);
    }

  } catch (error) {
    console.error('Erro geral na geração do workflow:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar workflow. Tente novamente.' },
      { status: 500 }
    );
  }
}

function createFallbackWorkflow(
  description: string,
  workflowType: string,
  complexity: string,
  availableAgents: Agent[]
): GeneratedWorkflow {
  // Select agents based on complexity
  const agentCount = complexity === 'simple' ? 2 : complexity === 'medium' ? 3 : Math.min(4, availableAgents.length);
  const selectedAgents = availableAgents.slice(0, agentCount);

  // Create basic nodes
  const nodes = selectedAgents.map((agent, index) => ({
    id: `node_${index + 1}`,
    type: 'CustomNode',
    name: agent.name,
    description: agent.description,
    config: {
      agentId: agent.id,
      input: '${input}',
      timeout: 30000
    }
  }));

  // Add start and end nodes
  nodes.unshift({
    id: 'node_start',
    type: 'StartNode',
    name: 'Início',
    description: 'Início do workflow',
    config: {}
  });

  nodes.push({
    id: 'node_end',
    type: 'EndNode',
    name: 'Fim',
    description: 'Fim do workflow',
    config: {}
  });

  // Create edges based on workflow type
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      source: nodes[i].id,
      target: nodes[i + 1].id,
      type: 'default'
    });
  }

  return {
    name: `Workflow ${complexity} - ${description.substring(0, 30)}...`,
    description: `Workflow gerado automaticamente com base na descrição: ${description}`,
    nodes,
    edges,
    agents: selectedAgents.map(agent => agent.id),
    complexity: complexity as 'simple' | 'medium' | 'complex',
    estimatedTime: complexity === 'simple' ? '1-2 minutos' : complexity === 'medium' ? '3-5 minutos' : '5-10 minutos'
  };
}

function validateAndEnhanceWorkflow(
  workflow: GeneratedWorkflow,
  availableAgents: Agent[],
  complexity: string
): GeneratedWorkflow {
  // Validate that agents exist
  const validAgents = workflow.agents.filter(agentId => 
    availableAgents.some(agent => agent.id === agentId)
  );

  // If no valid agents, use fallback
  if (validAgents.length === 0) {
    return createFallbackWorkflow(
      workflow.description,
      'sequential',
      complexity,
      availableAgents
    );
  }

  // Ensure minimum structure
  if (!workflow.nodes || workflow.nodes.length === 0) {
    return createFallbackWorkflow(
      workflow.description,
      'sequential',
      complexity,
      availableAgents
    );
  }

  // Enhance workflow with additional metadata
  return {
    ...workflow,
    agents: validAgents,
    complexity: complexity as 'simple' | 'medium' | 'complex',
    estimatedTime: workflow.estimatedTime || 
      (complexity === 'simple' ? '1-2 minutos' : complexity === 'medium' ? '3-5 minutos' : '5-10 minutos')
  };
}