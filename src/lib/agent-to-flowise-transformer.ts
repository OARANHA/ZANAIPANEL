/**
 * Transformador de dados de Agent para Flowise Workflow
 * Converte a estrutura de dados do sistema Zanai para o formato esperado pelo Flowise
 * Baseado na análise do template Tool Agent do Flowise
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
  positionAbsolute?: { x: number; y: number };
  width?: number;
  height?: number;
  selected?: boolean;
  dragging?: boolean;
  data: {
    id: string;
    label: string;
    version?: number;
    name: string;
    type: string;
    baseClasses?: string[];
    category: string;
    description?: string;
    inputParams?: FlowiseInputParam[];
    inputAnchors?: FlowiseAnchor[];
    inputs?: Record<string, any>;
    outputAnchors?: FlowiseAnchor[];
    outputs?: Record<string, any>;
    selected?: boolean;
    [key: string]: any;
  };
}

export interface FlowiseInputParam {
  label: string;
  name: string;
  type: string;
  description?: string;
  default?: any;
  optional?: boolean;
  additionalParams?: boolean;
  id?: string;
  rows?: number;
  placeholder?: string;
  step?: number;
  loadMethod?: string;
  credentialNames?: string[];
  options?: Array<{ label: string; name: string }>;
  display?: boolean;
  show?: Record<string, any>;
}

export interface FlowiseAnchor {
  id: string;
  name: string;
  label: string;
  type?: string;
  description?: string;
  optional?: boolean;
  list?: boolean;
  display?: boolean;
}

export interface FlowiseEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type?: string;
  data?: { label?: string };
}

/**
 * Transforma dados de um Agent para o formato FlowiseWorkflow usando estrutura Tool Agent
 */
export function transformAgentToFlowiseWorkflow(agent: AgentData): FlowiseWorkflowData {
  console.log('🔄 Transformando agente para Flowise workflow (Tool Agent):', agent.name);

  // Extrair configuração do agente
  const agentConfig = parseAgentConfig(agent.config);
  
  // Gerar nós e conexões baseado no tipo de agente usando estrutura Tool Agent
  const { nodes, edges } = generateToolAgentNodesAndEdges(agent, agentConfig);
  
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

  // Determinar o tipo do workflow no Flowise - sempre AGENTFLOW para Tool Agent
  const workflowType = 'AGENTFLOW';

  const transformed: FlowiseWorkflowData = {
    id: agent.id,
    name: agent.name,
    description: agent.description || `Agente ${agent.name} transformado para workflow Flowise`,
    type: workflowType,
    flowData: JSON.stringify(flowData),
    deployed: false,
    isPublic: false,
    category: 'Tools', // Categoria padrão para Tool Agent
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
 * Gera nós e conexões para o Flowise baseado no agente usando estrutura Tool Agent
 */
function generateToolAgentNodesAndEdges(agent: AgentData, config: any): { nodes: FlowiseNode[], edges: FlowiseEdge[] } {
  const nodes: FlowiseNode[] = [];
  const edges: FlowiseEdge[] = [];

  // 1. ChatOpenAI Node - Modelo de linguagem
  const chatOpenAINode: FlowiseNode = {
    id: 'chatOpenAI_0',
    type: 'customNode',
    position: { x: 97.01321406237057, y: 63.67664262280914 },
    positionAbsolute: { x: 97.01321406237057, y: 63.67664262280914 },
    width: 300,
    height: 771,
    selected: false,
    dragging: false,
    data: {
      id: 'chatOpenAI_0',
      label: 'ChatOpenAI',
      version: 8.2,
      name: 'chatOpenAI',
      type: 'ChatOpenAI',
      baseClasses: ['ChatOpenAI', 'BaseChatModel', 'BaseLanguageModel', 'Runnable'],
      category: 'Chat Models',
      description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
      inputParams: [
        {
          label: 'Connect Credential',
          name: 'credential',
          type: 'credential',
          credentialNames: ['openAIApi'],
          id: 'chatOpenAI_0-input-credential-credential',
          display: true
        },
        {
          label: 'Model Name',
          name: 'modelName',
          type: 'asyncOptions',
          loadMethod: 'listModels',
          default: 'gpt-4o-mini',
          id: 'chatOpenAI_0-input-modelName-asyncOptions',
          display: true
        },
        {
          label: 'Temperature',
          name: 'temperature',
          type: 'number',
          step: 0.1,
          default: 0.7,
          optional: true,
          id: 'chatOpenAI_0-input-temperature-number',
          display: true
        },
        {
          label: 'Streaming',
          name: 'streaming',
          type: 'boolean',
          default: true,
          optional: true,
          additionalParams: true,
          id: 'chatOpenAI_0-input-streaming-boolean',
          display: true
        },
        {
          label: 'Max Tokens',
          name: 'maxTokens',
          type: 'number',
          step: 1,
          optional: true,
          additionalParams: true,
          id: 'chatOpenAI_0-input-maxTokens-number',
          display: true
        },
        {
          label: 'Allow Image Uploads',
          name: 'allowImageUploads',
          type: 'boolean',
          description: 'Allow image input. Refer to the docs for more details.',
          default: false,
          optional: true,
          id: 'chatOpenAI_0-input-allowImageUploads-boolean',
          display: true
        },
        {
          label: 'Image Resolution',
          description: 'This parameter controls the resolution in which the model views the image.',
          name: 'imageResolution',
          type: 'options',
          options: [
            { label: 'Low', name: 'low' },
            { label: 'High', name: 'high' },
            { label: 'Auto', name: 'auto' }
          ],
          default: 'low',
          optional: false,
          show: { 'allowImageUploads': true },
          id: 'chatOpenAI_0-input-imageResolution-options',
          display: true
        }
      ],
      inputAnchors: [
        {
          label: 'Cache',
          name: 'cache',
          type: 'BaseCache',
          optional: true,
          id: 'chatOpenAI_0-input-cache-BaseCache',
          display: true
        }
      ],
      inputs: {
        cache: '',
        modelName: config.model || 'gpt-4o-mini',
        temperature: config.temperature || 0.7,
        streaming: true,
        maxTokens: config.maxTokens || '',
        allowImageUploads: false,
        imageResolution: 'low'
      },
      outputAnchors: [
        {
          id: 'chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable',
          name: 'chatOpenAI',
          label: 'ChatOpenAI',
          description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
          type: 'ChatOpenAI | BaseChatModel | BaseLanguageModel | Runnable'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(chatOpenAINode);

  // 2. Buffer Memory Node - Memória do chat
  const bufferMemoryNode: FlowiseNode = {
    id: 'bufferMemory_1',
    type: 'customNode',
    position: { x: 607.6260576768354, y: 584.7920541862369 },
    positionAbsolute: { x: 607.6260576768354, y: 584.7920541862369 },
    width: 300,
    height: 258,
    selected: false,
    dragging: false,
    data: {
      id: 'bufferMemory_1',
      label: 'Buffer Memory',
      version: 2,
      name: 'bufferMemory',
      type: 'BufferMemory',
      baseClasses: ['BufferMemory', 'BaseChatMemory', 'BaseMemory'],
      category: 'Memory',
      description: 'Retrieve chat messages stored in database',
      inputParams: [
        {
          label: 'Session Id',
          name: 'sessionId',
          type: 'string',
          description: 'If not specified, a random id will be used.',
          default: '',
          additionalParams: true,
          optional: true,
          id: 'bufferMemory_1-input-sessionId-string'
        },
        {
          label: 'Memory Key',
          name: 'memoryKey',
          type: 'string',
          default: 'chat_history',
          additionalParams: true,
          id: 'bufferMemory_1-input-memoryKey-string'
        }
      ],
      inputAnchors: [],
      inputs: {
        sessionId: '',
        memoryKey: 'chat_history'
      },
      outputAnchors: [
        {
          id: 'bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory',
          name: 'bufferMemory',
          label: 'BufferMemory',
          type: 'BufferMemory | BaseChatMemory | BaseMemory'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(bufferMemoryNode);

  // 3. Calculator Tool Node - Ferramenta de cálculo
  const calculatorNode: FlowiseNode = {
    id: 'calculator_1',
    type: 'customNode',
    position: { x: 800.5125025564965, y: 72.40592063242738 },
    positionAbsolute: { x: 800.5125025564965, y: 72.40592063242738 },
    width: 300,
    height: 149,
    selected: false,
    dragging: false,
    data: {
      id: 'calculator_1',
      label: 'Calculator',
      version: 1,
      name: 'calculator',
      type: 'Calculator',
      baseClasses: ['Calculator', 'Tool', 'StructuredTool', 'BaseLangChain'],
      category: 'Tools',
      description: 'Perform calculations on response',
      inputParams: [],
      inputAnchors: [],
      inputs: {},
      outputAnchors: [
        {
          id: 'calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain',
          name: 'calculator',
          label: 'Calculator',
          type: 'Calculator | Tool | StructuredTool | BaseLangChain'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(calculatorNode);

  // 4. Tool Agent Node - Agente principal
  const toolAgentNode: FlowiseNode = {
    id: 'toolAgent_0',
    type: 'customNode',
    position: { x: 1200.6756893536506, y: 208.18578883272318 },
    positionAbsolute: { x: 1200.6756893536506, y: 208.18578883272318 },
    width: 300,
    height: 491,
    selected: false,
    dragging: false,
    data: {
      id: 'toolAgent_0',
      label: 'Tool Agent',
      version: 2,
      name: 'toolAgent',
      type: 'AgentExecutor',
      baseClasses: ['AgentExecutor', 'BaseChain', 'Runnable'],
      category: 'Agents',
      description: 'Agent that uses Function Calling to pick the tools and args to call',
      inputParams: [
        {
          label: 'System Message',
          name: 'systemMessage',
          type: 'string',
          default: 'You are a helpful AI assistant.',
          description: 'If Chat Prompt Template is provided, this will be ignored',
          rows: 4,
          optional: true,
          additionalParams: true,
          id: 'toolAgent_0-input-systemMessage-string',
          display: true
        },
        {
          label: 'Max Iterations',
          name: 'maxIterations',
          type: 'number',
          optional: true,
          additionalParams: true,
          id: 'toolAgent_0-input-maxIterations-number',
          display: true
        },
        {
          label: 'Enable Detailed Streaming',
          name: 'enableDetailedStreaming',
          type: 'boolean',
          default: false,
          description: 'Stream detailed intermediate steps during agent execution',
          optional: true,
          additionalParams: true,
          id: 'toolAgent_0-input-enableDetailedStreaming-boolean',
          display: true
        }
      ],
      inputAnchors: [
        {
          label: 'Tools',
          name: 'tools',
          type: 'Tool',
          list: true,
          id: 'toolAgent_0-input-tools-Tool',
          display: true
        },
        {
          label: 'Memory',
          name: 'memory',
          type: 'BaseChatMemory',
          id: 'toolAgent_0-input-memory-BaseChatMemory',
          display: true
        },
        {
          label: 'Tool Calling Chat Model',
          name: 'model',
          type: 'BaseChatModel',
          description: 'Only compatible with models that are capable of function calling',
          id: 'toolAgent_0-input-model-BaseChatModel',
          display: true
        }
      ],
      inputs: {
        tools: ['{{calculator_1.data.instance}}'],
        memory: '{{bufferMemory_1.data.instance}}',
        model: '{{chatOpenAI_0.data.instance}}',
        systemMessage: generateSystemPrompt(agent, config),
        maxIterations: '',
        enableDetailedStreaming: ''
      },
      outputAnchors: [
        {
          id: 'toolAgent_0-output-toolAgent-AgentExecutor|BaseChain|Runnable',
          name: 'toolAgent',
          label: 'AgentExecutor',
          description: 'Agent that uses Function Calling to pick the tools and args to call',
          type: 'AgentExecutor | BaseChain | Runnable'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(toolAgentNode);

  // 5. Sticky Note Node - Nota informativa
  const stickyNoteNode: FlowiseNode = {
    id: 'stickyNote_0',
    type: 'stickyNote',
    position: { x: 1197.3578961103253, y: 117.43214592301385 },
    positionAbsolute: { x: 1197.3578961103253, y: 117.43214592301385 },
    width: 300,
    height: 62,
    selected: false,
    dragging: false,
    data: {
      id: 'stickyNote_0',
      label: 'Sticky Note',
      version: 2,
      name: 'stickyNote',
      type: 'StickyNote',
      baseClasses: ['StickyNote'],
      category: 'Utilities',
      description: 'Add a sticky note',
      inputParams: [
        {
          label: '',
          name: 'note',
          type: 'string',
          rows: 1,
          placeholder: 'Type something here',
          optional: true,
          id: 'stickyNote_0-input-note-string'
        }
      ],
      inputAnchors: [],
      inputs: {
        note: `LLM has to be function calling compatible - Agent: ${agent.name}`
      },
      outputAnchors: [
        {
          id: 'stickyNote_0-output-stickyNote-StickyNote',
          name: 'stickyNote',
          label: 'StickyNote',
          description: 'Add a sticky note',
          type: 'StickyNote'
        }
      ],
      outputs: {},
      selected: false,
      tags: ['Utilities']
    }
  };
  nodes.push(stickyNoteNode);

  // Conexões entre os nós
  edges.push({
    id: 'chatOpenAI_0-chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable-toolAgent_0-toolAgent_0-input-model-BaseChatModel',
    source: 'chatOpenAI_0',
    target: 'toolAgent_0',
    sourceHandle: 'chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable',
    targetHandle: 'toolAgent_0-input-model-BaseChatModel',
    type: 'buttonedge',
    data: {}
  });

  edges.push({
    id: 'bufferMemory_1-bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory-toolAgent_0-toolAgent_0-input-memory-BaseChatMemory',
    source: 'bufferMemory_1',
    target: 'toolAgent_0',
    sourceHandle: 'bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory',
    targetHandle: 'toolAgent_0-input-memory-BaseChatMemory',
    type: 'buttonedge',
    data: {}
  });

  edges.push({
    id: 'calculator_1-calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain-toolAgent_0-toolAgent_0-input-tools-Tool',
    source: 'calculator_1',
    target: 'toolAgent_0',
    sourceHandle: 'calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain',
    targetHandle: 'toolAgent_0-input-tools-Tool',
    type: 'buttonedge',
    data: {}
  });

  return { nodes, edges };
}

/**
 * Gera o system prompt para o agente no Flowise
 */
function generateSystemPrompt(agent: AgentData, config: any): string {
  let prompt = agent.roleDefinition || `You are ${agent.name}, a helpful AI assistant.`;
  
  if (agent.customInstructions) {
    prompt += `\n\n**Custom Instructions:**\n${agent.customInstructions}`;
  }

  if (config.systemPrompt) {
    prompt += `\n\n**Additional Configuration:**\n${config.systemPrompt}`;
  }

  // Add information about agent type
  switch (agent.type) {
    case 'template':
      prompt += '\n\nYou are a template-based agent, designed for specific tasks.';
      break;
    case 'custom':
      prompt += '\n\nYou are a custom agent, adapted for specific user needs.';
      break;
    case 'composed':
      prompt += '\n\nYou are a composed agent, combining multiple capabilities and specializations.';
      break;
  }

  // Add tool usage instructions for Tool Agent
  prompt += '\n\nYou have access to tools and can use function calling to accomplish tasks. ' +
           'When you need to perform calculations, use the Calculator tool. ' +
           'Always think step by step and use the appropriate tools when needed.';

  return prompt;
}

/**
 * Gera configuração de chatbot para o Flowise
 */
function generateChatbotConfig(agent: AgentData, config: any): any {
  return {
    modelName: config.model || 'gpt-4o-mini',
    temperature: config.temperature || 0.7,
    maxTokens: config.maxTokens || 2000,
    systemPrompt: generateSystemPrompt(agent, config),
    // Interface configurations
    welcomeMessage: `Hello! I'm ${agent.name}. ${agent.description || 'How can I help you today?'}`,
    placeholder: 'Type your message here...',
    // Advanced configurations
    streaming: true,
    memory: true,
    contextWindow: config.contextWindow || 4096,
    // Available tools
    tools: ['calculator'], // Default tool for Tool Agent
    // Metadata
    agentType: agent.type,
    agentId: agent.id,
    agentSlug: agent.slug,
    createdAt: new Date().toISOString(),
    // Tool Agent specific
    toolAgentEnabled: true,
    functionCalling: true
  };
}

/**
 * Gera configuração de API para o Flowise
 */
function generateApiConfig(agent: AgentData, config: any): any {
  return {
    // API configurations
    apiEndpoint: `/api/v1/agentflows/${agent.id}`,
    apiKey: `flowise_${agent.id}`,
    // Authentication configurations
    authentication: {
      type: 'bearer',
      token: `flowise_${agent.id}`
    },
    // Rate limiting configurations
    rateLimit: {
      requests: 100,
      window: '15min'
    },
    // Response configurations
    responseFormat: 'json',
    streaming: config.streaming !== false,
    // Metadata
    agentType: agent.type,
    agentId: agent.id,
    version: '1.0.0',
    workflowType: 'AGENTFLOW',
    // Security configurations
    cors: {
      enabled: true,
      origins: ['*']
    },
    // Logging configurations
    logging: {
      enabled: true,
      level: 'info'
    },
    // Tool Agent specific
    supportsFunctionCalling: true,
    compatibleModels: ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']
  };
}

/**
 * Valida se os dados transformados estão no formato correto para exportação
 */
export function validateTransformedData(data: FlowiseWorkflowData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar campos obrigatórios
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Workflow name is required');
  }

  if (!data.type || !['CHATFLOW', 'AGENTFLOW', 'MULTIAGENT', 'ASSISTANT'].includes(data.type)) {
    errors.push('Invalid workflow type');
  }

  // Validar flowData
  try {
    const flowData = JSON.parse(data.flowData);
    if (!flowData.nodes || !Array.isArray(flowData.nodes)) {
      errors.push('flowData must contain a nodes array');
    }
    if (!flowData.edges || !Array.isArray(flowData.edges)) {
      errors.push('flowData must contain an edges array');
    }

    // Validar estrutura Tool Agent específica
    if (data.type === 'AGENTFLOW') {
      const hasToolAgent = flowData.nodes.some((node: any) => 
        node.data.type === 'AgentExecutor' || node.data.name === 'toolAgent'
      );
      if (!hasToolAgent) {
        errors.push('AGENTFLOW must contain a Tool Agent node');
      }

      const hasChatOpenAI = flowData.nodes.some((node: any) => 
        node.data.type === 'ChatOpenAI' || node.data.name === 'chatOpenAI'
      );
      if (!hasChatOpenAI) {
        errors.push('Tool Agent must have a ChatOpenAI node connected');
      }

      const hasBufferMemory = flowData.nodes.some((node: any) => 
        node.data.type === 'BufferMemory' || node.data.name === 'bufferMemory'
      );
      if (!hasBufferMemory) {
        errors.push('Tool Agent should have a Buffer Memory node');
      }

      const hasTools = flowData.nodes.some((node: any) => 
        node.data.category === 'Tools' || node.data.baseClasses?.includes('Tool')
      );
      if (!hasTools) {
        errors.push('Tool Agent should have at least one tool node');
      }
    }
  } catch (e) {
    errors.push('flowData must be valid JSON');
  }

  // Validar chatbotConfig se presente
  if (data.chatbotConfig) {
    try {
      JSON.parse(data.chatbotConfig);
    } catch (e) {
      errors.push('chatbotConfig must be valid JSON');
    }
  }

  // Validar apiConfig se presente
  if (data.apiConfig) {
    try {
      JSON.parse(data.apiConfig);
    } catch (e) {
      errors.push('apiConfig must be valid JSON');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}