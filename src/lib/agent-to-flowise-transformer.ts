/**
 * Transformador de dados de Agent para Flowise Workflow
 * Converte a estrutura de dados do sistema Zanai para o formato esperado pelo Flowise
 */

export interface AgentData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'template' | 'custom' | 'composed';
  config: string; // YAML
  knowledge?: string; // Markdown
  roleDefinition?: string;
  customInstructions?: string;
  workspaceId: string;
  groups?: any[];
}

export interface FlowiseWorkflowData {
  id: string;
  name: string;
  description?: string;
  type: 'CHATFLOW' | 'AGENTFLOW' | 'MULTIAGENT' | 'ASSISTANT';
  flowData: string; // JSON string
  deployed?: boolean;
  isPublic?: boolean;
  category?: string;
  chatbotConfig?: string; // JSON string
  apiConfig?: string; // JSON string
  workspaceId?: string;
}

export interface FlowiseNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    name: string;
    category: string;
    inputs?: any[];
    outputs?: any[];
    [key: string]: any;
  };
}

export interface FlowiseEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

/**
 * Transforma dados de um Agent para o formato FlowiseWorkflow
 */
export function transformAgentToFlowiseWorkflow(agent: AgentData): FlowiseWorkflowData {
  console.log('🔄 Transformando agente para Flowise workflow:', agent.name);

  // Extrair configuração do agente
  const agentConfig = parseAgentConfig(agent.config);
  
  // Gerar nós e conexões baseado no tipo de agente
  const { nodes, edges } = generateFlowiseNodesAndEdges(agent, agentConfig);
  
  // Gerar flowData no formato esperado pelo Flowise
  const flowData = {
    nodes,
    edges,
    viewport: { x: 0, y: 0, zoom: 1 }
  };

  // Gerar chatbotConfig baseado nas configurações do agente
  const chatbotConfig = generateChatbotConfig(agent, agentConfig);
  
  // Gerar apiConfig baseado nas configurações do agente
  const apiConfig = generateApiConfig(agent, agentConfig);

  // Determinar o tipo do workflow no Flowise
  const workflowType = mapAgentTypeToFlowiseType(agent.type);

  const transformed: FlowiseWorkflowData = {
    id: agent.id,
    name: agent.name,
    description: agent.description || `Agente ${agent.name} transformado para workflow Flowise`,
    type: workflowType,
    flowData: JSON.stringify(flowData),
    deployed: false,
    isPublic: false,
    category: agentConfig.category || 'general',
    chatbotConfig: JSON.stringify(chatbotConfig),
    apiConfig: JSON.stringify(apiConfig),
    workspaceId: agent.workspaceId
  };

  console.log('✅ Transformação concluída:', {
    originalType: agent.type,
    transformedType: workflowType,
    nodesCount: nodes.length,
    edgesCount: edges.length,
    hasChatbotConfig: !!chatbotConfig,
    hasApiConfig: !!apiConfig
  });

  return transformed;
}

/**
 * Faz parse da configuração YAML do agente
 */
function parseAgentConfig(configYaml: string): any {
  try {
    // Tentar fazer parse como YAML primeiro
    // Se não tiver um parser YAML disponível, tentar como JSON
    try {
      return JSON.parse(configYaml);
    } catch (jsonError) {
      // Se falhar o parse JSON, retornar configuração padrão
      console.warn('Não foi possível fazer parse da config como JSON, usando padrão:', jsonError);
      return {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        category: 'general'
      };
    }
  } catch (error) {
    console.warn('Erro ao fazer parse da configuração do agente:', error);
    return {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      category: 'general'
    };
  }
}

/**
 * Gera nós e conexões para o Flowise baseado no agente
 */
function generateFlowiseNodesAndEdges(agent: AgentData, config: any): { nodes: FlowiseNode[], edges: FlowiseEdge[] } {
  const nodes: FlowiseNode[] = [];
  const edges: FlowiseEdge[] = [];

  // Nó inicial de entrada
  const chatInputNode: FlowiseNode = {
    id: 'chat-input',
    type: 'chatInput',
    position: { x: 100, y: 100 },
    data: {
      label: 'Chat Input',
      name: 'chatInput',
      category: 'Inputs',
      inputs: [],
      outputs: [{ name: 'message', type: 'string' }]
    }
  };
  nodes.push(chatInputNode);

  // Nó de processamento principal do agente
  const agentNode: FlowiseNode = {
    id: 'agent-processing',
    type: 'openAI',
    position: { x: 400, y: 100 },
    data: {
      label: agent.name,
      name: 'agentProcessor',
      category: 'AI',
      inputs: [{ name: 'message', type: 'string' }],
      outputs: [{ name: 'response', type: 'string' }],
      // Configurações do modelo
      modelName: config.model || 'gpt-4',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 2000,
      systemPrompt: generateSystemPrompt(agent, config),
      tools: config.tools || []
    }
  };
  nodes.push(agentNode);

  // Nó de saída
  const chatOutputNode: FlowiseNode = {
    id: 'chat-output',
    type: 'chatOutput',
    position: { x: 700, y: 100 },
    data: {
      label: 'Chat Output',
      name: 'chatOutput',
      category: 'Outputs',
      inputs: [{ name: 'response', type: 'string' }],
      outputs: []
    }
  };
  nodes.push(chatOutputNode);

  // Conexões
  edges.push({
    id: 'edge-1',
    source: 'chat-input',
    target: 'agent-processing',
    sourceHandle: 'message',
    targetHandle: 'message'
  });

  edges.push({
    id: 'edge-2',
    source: 'agent-processing',
    target: 'chat-output',
    sourceHandle: 'response',
    targetHandle: 'response'
  });

  // Se o agente tem conhecimento base, adicionar nó de conhecimento
  if (agent.knowledge && agent.knowledge.trim().length > 0) {
    const knowledgeNode: FlowiseNode = {
      id: 'knowledge-base',
      type: 'document',
      position: { x: 400, y: 300 },
      data: {
        label: 'Knowledge Base',
        name: 'knowledgeBase',
        category: 'Data',
        inputs: [],
        outputs: [{ name: 'context', type: 'string' }],
        content: agent.knowledge
      }
    };
    nodes.push(knowledgeNode);

    // Conectar conhecimento ao processamento do agente
    edges.push({
      id: 'edge-3',
      source: 'knowledge-base',
      target: 'agent-processing',
      sourceHandle: 'context',
      targetHandle: 'context'
    });
  }

  return { nodes, edges };
}

/**
 * Gera o system prompt para o agente no Flowise
 */
function generateSystemPrompt(agent: AgentData, config: any): string {
  let prompt = agent.roleDefinition || `Você é ${agent.name}, um agente de IA especializado.`;
  
  if (agent.customInstructions) {
    prompt += `\n\n**Instruções Personalizadas:**\n${agent.customInstructions}`;
  }

  if (config.systemPrompt) {
    prompt += `\n\n**Configuração Adicional:**\n${config.systemPrompt}`;
  }

  // Adicionar informações sobre o tipo de agente
  switch (agent.type) {
    case 'template':
      prompt += '\n\nVocê é um agente baseado em template, projetado para tarefas específicas.';
      break;
    case 'custom':
      prompt += '\n\nVocê é um agente personalizado, adaptado para necessidades específicas do usuário.';
      break;
    case 'composed':
      prompt += '\n\nVocê é um agente composto, combinando múltiplas capacidades e especializações.';
      break;
  }

  return prompt;
}

/**
 * Gera configuração de chatbot para o Flowise
 */
function generateChatbotConfig(agent: AgentData, config: any): any {
  return {
    modelName: config.model || 'gpt-4',
    temperature: config.temperature || 0.7,
    maxTokens: config.maxTokens || 2000,
    systemPrompt: generateSystemPrompt(agent, config),
    // Configurações de interface
    welcomeMessage: `Olá! Eu sou ${agent.name}. ${agent.description || 'Como posso ajudar você hoje?'}`,
    placeholder: 'Digite sua mensagem aqui...',
    // Configurações avançadas
    streaming: true,
    memory: true,
    contextWindow: config.contextWindow || 4096,
    // Ferramentas disponíveis
    tools: config.tools || [],
    // Metadados
    agentType: agent.type,
    agentId: agent.id,
    agentSlug: agent.slug,
    createdAt: new Date().toISOString()
  };
}

/**
 * Gera configuração de API para o Flowise
 */
function generateApiConfig(agent: AgentData, config: any): any {
  return {
    // Configurações da API
    apiEndpoint: `/api/v1/chatflows/${agent.id}`,
    apiKey: `flowise_${agent.id}`,
    // Configurações de autenticação
    authentication: {
      type: 'bearer',
      token: `flowise_${agent.id}`
    },
    // Configurações de rate limiting
    rateLimit: {
      requests: 100,
      window: '15min'
    },
    // Configurações de resposta
    responseFormat: 'json',
    streaming: config.streaming !== false,
    // Metadados
    agentType: agent.type,
    agentId: agent.id,
    version: '1.0.0',
    // Configurações de segurança
    cors: {
      enabled: true,
      origins: ['*']
    },
    // Configurações de logging
    logging: {
      enabled: true,
      level: 'info'
    }
  };
}

/**
 * Mapeia o tipo de agente para o tipo de workflow do Flowise
 */
function mapAgentTypeToFlowiseType(agentType: string): 'CHATFLOW' | 'AGENTFLOW' | 'MULTIAGENT' | 'ASSISTANT' {
  switch (agentType) {
    case 'template':
      return 'CHATFLOW';
    case 'custom':
      return 'AGENTFLOW';
    case 'composed':
      return 'MULTIAGENT';
    default:
      return 'ASSISTANT';
  }
}

/**
 * Valida se os dados transformados estão no formato correto para exportação
 */
export function validateTransformedData(data: FlowiseWorkflowData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar campos obrigatórios
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Nome do workflow é obrigatório');
  }

  if (!data.type || !['CHATFLOW', 'AGENTFLOW', 'MULTIAGENT', 'ASSISTANT'].includes(data.type)) {
    errors.push('Tipo do workflow inválido');
  }

  // Validar flowData
  try {
    const flowData = JSON.parse(data.flowData);
    if (!flowData.nodes || !Array.isArray(flowData.nodes)) {
      errors.push('flowData deve conter um array de nodes');
    }
    if (!flowData.edges || !Array.isArray(flowData.edges)) {
      errors.push('flowData deve conter um array de edges');
    }
  } catch (e) {
    errors.push('flowData deve ser um JSON válido');
  }

  // Validar chatbotConfig se presente
  if (data.chatbotConfig) {
    try {
      JSON.parse(data.chatbotConfig);
    } catch (e) {
      errors.push('chatbotConfig deve ser um JSON válido');
    }
  }

  // Validar apiConfig se presente
  if (data.apiConfig) {
    try {
      JSON.parse(data.apiConfig);
    } catch (e) {
      errors.push('apiConfig deve ser um JSON válido');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}