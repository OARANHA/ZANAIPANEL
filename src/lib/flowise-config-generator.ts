// Gerador de configurações Flowise para diferentes tipos de agentes
import { FlowiseWorkflow } from './flowise-client';

// Interface para dados do agente
export interface AgentData {
  id: string;
  name: string;
  description?: string;
  type: 'template' | 'custom' | 'composed';
  persona: {
    name: string;
    role: string;
    personality: string;
    expertise: string[];
    communicationStyle: string;
    language: 'pt' | 'en' | 'es';
  };
  context: {
    businessDomain: string;
    industry: string;
    targetAudience: string;
    companyProfile?: {
      name: string;
      size: 'small' | 'medium' | 'large';
      sector: string;
    };
    knowledgeBase?: string[];
    constraints?: string[];
  };
  rgaConfig?: {
    reasoningLevel: 'basic' | 'advanced' | 'expert';
    autonomy: 'low' | 'medium' | 'high';
    learningCapability: boolean;
    decisionMaking: 'assisted' | 'autonomous';
  };
  config?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    tools?: string[];
    memory?: {
      type: 'short' | 'long' | 'hybrid';
      capacity: number;
    };
  };
}

// Interface para template de configuração Flowise
export interface FlowiseTemplate {
  name: string;
  description: string;
  type: 'CHATFLOW' | 'AGENTFLOW' | 'MULTIAGENT' | 'ASSISTANT';
  category: string;
  nodes: FlowiseNode[];
  edges: FlowiseEdge[];
  chatbotConfig?: any;
  apiConfig?: any;
}

// Interface para nó Flowise
export interface FlowiseNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    name: string;
    category: string;
    inputs: any[];
    outputs: any[];
    [key: string]: any;
  };
}

// Interface para conexão Flowise
export interface FlowiseEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

// Templates pré-definidos para diferentes tipos de agentes
const AGENT_TEMPLATES: Record<string, FlowiseTemplate> = {
  // Template para Agente de Chat Simples
  simple_chat: {
    name: 'Simple Chat Agent',
    description: 'Basic chat agent with conversation memory',
    type: 'CHATFLOW',
    category: 'chat',
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
      },
      {
        id: '4',
        type: 'customNode',
        position: { x: 300, y: 250 },
        data: {
          label: 'Conversation Memory',
          name: 'conversationMemory',
          category: 'Memory',
          inputs: [{ type: 'message', name: 'message' }],
          outputs: [{ type: 'memory', name: 'context' }]
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
      },
      {
        id: 'e4-2',
        source: '4',
        target: '2',
        sourceHandle: 'context',
        targetHandle: 'systemPrompt'
      }
    ]
  },

  // Template para Agente com Raciocínio Avançado
  advanced_reasoning: {
    name: 'Advanced Reasoning Agent',
    description: 'Agent with advanced reasoning capabilities and tool usage',
    type: 'AGENTFLOW',
    category: 'agent',
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
        position: { x: 300, y: 50 },
        data: {
          label: 'Intent Analysis',
          name: 'intentAnalysis',
          category: 'Analysis',
          inputs: [{ type: 'message', name: 'message' }],
          outputs: [{ type: 'intent', name: 'intent' }]
        }
      },
      {
        id: '3',
        type: 'customNode',
        position: { x: 300, y: 150 },
        data: {
          label: 'Context Retrieval',
          name: 'contextRetrieval',
          category: 'Memory',
          inputs: [{ type: 'message', name: 'message' }],
          outputs: [{ type: 'context', name: 'context' }]
        }
      },
      {
        id: '4',
        type: 'customNode',
        position: { x: 500, y: 100 },
        data: {
          label: 'Reasoning Engine',
          name: 'reasoningEngine',
          category: 'Reasoning',
          inputs: [
            { type: 'intent', name: 'intent' },
            { type: 'context', name: 'context' }
          ],
          outputs: [{ type: 'reasoning', name: 'reasoning' }]
        }
      },
      {
        id: '5',
        type: 'customNode',
        position: { x: 700, y: 100 },
        data: {
          label: 'Tool Executor',
          name: 'toolExecutor',
          category: 'Tools',
          inputs: [{ type: 'reasoning', name: 'reasoning' }],
          outputs: [{ type: 'result', name: 'result' }]
        }
      },
      {
        id: '6',
        type: 'customNode',
        position: { x: 900, y: 100 },
        data: {
          label: 'Response Generator',
          name: 'responseGenerator',
          category: 'LLMs',
          inputs: [{ type: 'result', name: 'result' }],
          outputs: [{ type: 'response', name: 'response' }]
        }
      },
      {
        id: '7',
        type: 'customNode',
        position: { x: 1100, y: 100 },
        data: {
          label: 'Chat Output',
          name: 'chatOutput',
          category: 'Output',
          inputs: [{ type: 'response', name: 'response' }],
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
        id: 'e1-3',
        source: '1',
        target: '3',
        sourceHandle: 'message',
        targetHandle: 'message'
      },
      {
        id: 'e2-4',
        source: '2',
        target: '4',
        sourceHandle: 'intent',
        targetHandle: 'intent'
      },
      {
        id: 'e3-4',
        source: '3',
        target: '4',
        sourceHandle: 'context',
        targetHandle: 'context'
      },
      {
        id: 'e4-5',
        source: '4',
        target: '5',
        sourceHandle: 'reasoning',
        targetHandle: 'reasoning'
      },
      {
        id: 'e5-6',
        source: '5',
        target: '6',
        sourceHandle: 'result',
        targetHandle: 'result'
      },
      {
        id: 'e6-7',
        source: '6',
        target: '7',
        sourceHandle: 'response',
        targetHandle: 'response'
      }
    ]
  },

  // Template para Agente de Documentação
  documentation_agent: {
    name: 'Documentation Agent',
    description: 'Specialized agent for document processing and Q&A',
    type: 'CHATFLOW',
    category: 'documentation',
    nodes: [
      {
        id: '1',
        type: 'customNode',
        position: { x: 100, y: 100 },
        data: {
          label: 'Document Upload',
          name: 'documentUpload',
          category: 'Input',
          inputs: [],
          outputs: [{ type: 'document', name: 'document' }]
        }
      },
      {
        id: '2',
        type: 'customNode',
        position: { x: 300, y: 50 },
        data: {
          label: 'Document Processor',
          name: 'documentProcessor',
          category: 'Processing',
          inputs: [{ type: 'document', name: 'document' }],
          outputs: [{ type: 'chunks', name: 'chunks' }]
        }
      },
      {
        id: '3',
        type: 'customNode',
        position: { x: 300, y: 150 },
        data: {
          label: 'Vector Store',
          name: 'vectorStore',
          category: 'Memory',
          inputs: [{ type: 'chunks', name: 'chunks' }],
          outputs: [{ type: 'vectors', name: 'vectors' }]
        }
      },
      {
        id: '4',
        type: 'customNode',
        position: { x: 500, y: 100 },
        data: {
          label: 'Question Input',
          name: 'questionInput',
          category: 'Input',
          inputs: [],
          outputs: [{ type: 'question', name: 'question' }]
        }
      },
      {
        id: '5',
        type: 'customNode',
        position: { x: 700, y: 100 },
        data: {
          label: 'Similarity Search',
          name: 'similaritySearch',
          category: 'Search',
          inputs: [
            { type: 'question', name: 'question' },
            { type: 'vectors', name: 'vectors' }
          ],
          outputs: [{ type: 'context', name: 'context' }]
        }
      },
      {
        id: '6',
        type: 'customNode',
        position: { x: 900, y: 100 },
        data: {
          label: 'Answer Generator',
          name: 'answerGenerator',
          category: 'LLMs',
          inputs: [
            { type: 'question', name: 'question' },
            { type: 'context', name: 'context' }
          ],
          outputs: [{ type: 'answer', name: 'answer' }]
        }
      },
      {
        id: '7',
        type: 'customNode',
        position: { x: 1100, y: 100 },
        data: {
          label: 'Chat Output',
          name: 'chatOutput',
          category: 'Output',
          inputs: [{ type: 'answer', name: 'answer' }],
          outputs: []
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        sourceHandle: 'document',
        targetHandle: 'document'
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        sourceHandle: 'chunks',
        targetHandle: 'chunks'
      },
      {
        id: 'e4-5',
        source: '4',
        target: '5',
        sourceHandle: 'question',
        targetHandle: 'question'
      },
      {
        id: 'e3-5',
        source: '3',
        target: '5',
        sourceHandle: 'vectors',
        targetHandle: 'vectors'
      },
      {
        id: 'e4-6',
        source: '4',
        target: '6',
        sourceHandle: 'question',
        targetHandle: 'question'
      },
      {
        id: 'e5-6',
        source: '5',
        target: '6',
        sourceHandle: 'context',
        targetHandle: 'context'
      },
      {
        id: 'e6-7',
        source: '6',
        target: '7',
        sourceHandle: 'answer',
        targetHandle: 'answer'
      }
    ]
  },

  // Template para Agente de Análise de Dados
  data_analysis_agent: {
    name: 'Data Analysis Agent',
    description: 'Agent for data processing and analysis',
    type: 'AGENTFLOW',
    category: 'analysis',
    nodes: [
      {
        id: '1',
        type: 'customNode',
        position: { x: 100, y: 100 },
        data: {
          label: 'Data Input',
          name: 'dataInput',
          category: 'Input',
          inputs: [],
          outputs: [{ type: 'data', name: 'data' }]
        }
      },
      {
        id: '2',
        type: 'customNode',
        position: { x: 300, y: 50 },
        data: {
          label: 'Data Validator',
          name: 'dataValidator',
          category: 'Validation',
          inputs: [{ type: 'data', name: 'data' }],
          outputs: [{ type: 'validatedData', name: 'validatedData' }]
        }
      },
      {
        id: '3',
        type: 'customNode',
        position: { x: 300, y: 150 },
        data: {
          label: 'Data Preprocessor',
          name: 'dataPreprocessor',
          category: 'Processing',
          inputs: [{ type: 'data', name: 'data' }],
          outputs: [{ type: 'processedData', name: 'processedData' }]
        }
      },
      {
        id: '4',
        type: 'customNode',
        position: { x: 500, y: 100 },
        data: {
          label: 'Analysis Engine',
          name: 'analysisEngine',
          category: 'Analysis',
          inputs: [
            { type: 'validatedData', name: 'validatedData' },
            { type: 'processedData', name: 'processedData' }
          ],
          outputs: [{ type: 'insights', name: 'insights' }]
        }
      },
      {
        id: '5',
        type: 'customNode',
        position: { x: 700, y: 100 },
        data: {
          label: 'Report Generator',
          name: 'reportGenerator',
          category: 'Generation',
          inputs: [{ type: 'insights', name: 'insights' }],
          outputs: [{ type: 'report', name: 'report' }]
        }
      },
      {
        id: '6',
        type: 'customNode',
        position: { x: 900, y: 100 },
        data: {
          label: 'Visualization',
          name: 'visualization',
          category: 'Output',
          inputs: [{ type: 'report', name: 'report' }],
          outputs: [{ type: 'charts', name: 'charts' }]
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        sourceHandle: 'data',
        targetHandle: 'data'
      },
      {
        id: 'e1-3',
        source: '1',
        target: '3',
        sourceHandle: 'data',
        targetHandle: 'data'
      },
      {
        id: 'e2-4',
        source: '2',
        target: '4',
        sourceHandle: 'validatedData',
        targetHandle: 'validatedData'
      },
      {
        id: 'e3-4',
        source: '3',
        target: '4',
        sourceHandle: 'processedData',
        targetHandle: 'processedData'
      },
      {
        id: 'e4-5',
        source: '4',
        target: '5',
        sourceHandle: 'insights',
        targetHandle: 'insights'
      },
      {
        id: 'e5-6',
        source: '5',
        target: '6',
        sourceHandle: 'report',
        targetHandle: 'report'
      }
    ]
  }
};

// Função principal para gerar configuração Flowise
export function generateFlowiseConfig(agent: AgentData): FlowiseWorkflow {
  // Selecionar template baseado no tipo e configuração do agente
  const template = selectTemplate(agent);
  
  // Personalizar template com dados do agente
  const customizedTemplate = customizeTemplate(template, agent);
  
  // Gerar configuração final
  const flowiseConfig: FlowiseWorkflow = {
    id: agent.id,
    name: agent.name,
    flowData: JSON.stringify({
      nodes: customizedTemplate.nodes,
      edges: customizedTemplate.edges
    }),
    deployed: false,
    isPublic: false,
    type: customizedTemplate.type,
    category: customizedTemplate.category,
    createdDate: new Date(),
    updatedDate: new Date(),
    chatbotConfig: customizedTemplate.chatbotConfig,
    apiConfig: customizedTemplate.apiConfig
  };

  return flowiseConfig;
}

// Função para selecionar template baseado no agente
function selectTemplate(agent: AgentData): FlowiseTemplate {
  const { type, persona, context, rgaConfig } = agent;
  
  // Lógica de seleção de template
  if (context.businessDomain.includes('document') || 
      context.businessDomain.includes('knowledge') ||
      persona.expertise.some(exp => exp.includes('document'))) {
    return AGENT_TEMPLATES.documentation_agent;
  }
  
  if (context.businessDomain.includes('data') || 
      context.businessDomain.includes('analysis') ||
      persona.expertise.some(exp => exp.includes('analysis'))) {
    return AGENT_TEMPLATES.data_analysis_agent;
  }
  
  if (rgaConfig?.reasoningLevel === 'advanced' || 
      rgaConfig?.reasoningLevel === 'expert' ||
      agent.config?.tools?.length > 0) {
    return AGENT_TEMPLATES.advanced_reasoning;
  }
  
  // Template padrão
  return AGENT_TEMPLATES.simple_chat;
}

// Função para personalizar template com dados do agente
function customizeTemplate(template: FlowiseTemplate, agent: AgentData): FlowiseTemplate {
  const customized = { ...template };
  
  // Personalizar nós com configurações do agente
  customized.nodes = customized.nodes.map(node => {
    const customNode = { ...node };
    
    // Configurar system prompt em nós LLM
    if (node.data.category === 'LLMs' || node.data.name === 'llmChain') {
      customNode.data.systemPrompt = agent.config?.systemPrompt || generateSystemPrompt(agent);
      customNode.data.model = agent.config?.model || 'gpt-4';
      customNode.data.temperature = agent.config?.temperature ?? 0.7;
      customNode.data.maxTokens = agent.config?.maxTokens ?? 2000;
    }
    
    // Configurar memória
    if (node.data.category === 'Memory') {
      customNode.data.memoryType = agent.config?.memory?.type || 'hybrid';
      customNode.data.memoryCapacity = agent.config?.memory?.capacity || 1000;
    }
    
    // Configurar ferramentas
    if (node.data.category === 'Tools' && agent.config?.tools) {
      customNode.data.availableTools = agent.config.tools;
    }
    
    return customNode;
  });
  
  // Configurar chatbot config
  customized.chatbotConfig = {
    botName: agent.persona.name,
    botDescription: agent.description || `${agent.persona.name} - ${agent.persona.role}`,
    welcomeMessage: generateWelcomeMessage(agent),
    inputPlaceholder: generateInputPlaceholder(agent),
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    features: {
      fileUpload: agent.context.businessDomain.includes('document'),
      streaming: true,
      memory: true,
      analytics: agent.rgaConfig?.learningCapability || false
    }
  };
  
  // Configurar API config
  customized.apiConfig = {
    endpoint: `/api/v1/agents/${agent.id}/chat`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${API_KEY}'
    },
    rateLimit: {
      requests: 100,
      window: '1h'
    }
  };
  
  return customized;
}

// Função para gerar system prompt
function generateSystemPrompt(agent: AgentData): string {
  const { persona, context } = agent;
  
  return `Você é ${persona.name}, um ${persona.role} especializado.

**Personalidade e Estilo de Comunicação:**
- Personalidade: ${persona.personality}
- Estilo de comunicação: ${persona.communicationStyle}
- Idioma: ${persona.language === 'pt' ? 'Português' : persona.language === 'es' ? 'Espanhol' : 'Inglês'}

**Expertise:**
${persona.expertise.map(exp => `- ${exp}`).join('\n')}

**Contexto de Negócio:**
- Domínio: ${context.businessDomain}
- Indústria: ${context.industry}
- Público-alvo: ${context.targetAudience}

${context.companyProfile ? `
**Perfil da Empresa:**
- Nome: ${context.companyProfile.name}
- Porte: ${context.companyProfile.size}
- Setor: ${context.companyProfile.sector}
` : ''}

**Diretrizes:**
1. Mantenha o tom profissional e alinhado com sua personalidade definida
2. Forneça respostas detalhadas e acionáveis
3. Considere sempre o contexto de negócio e o público-alvo
4. Use exemplos relevantes quando aplicável
5. Seja proativo em sugerir melhorias e soluções

${context.constraints ? `**Restrições:**
${context.constraints.map(constraint => `- ${constraint}`).join('\n')}
` : ''}

Responda sempre em ${persona.language === 'pt' ? 'português' : persona.language === 'es' ? 'espanhol' : 'inglês'}.`;
}

// Função para gerar mensagem de boas-vindas
function generateWelcomeMessage(agent: AgentData): string {
  const { persona, context } = agent;
  const language = agent.persona.language;
  
  const messages = {
    pt: `Olá! Eu sou ${persona.name}, ${persona.role}. Estou aqui para ajudar você com ${context.businessDomain}. Como posso auxiliar hoje?`,
    en: `Hello! I'm ${persona.name}, ${persona.role}. I'm here to help you with ${context.businessDomain}. How can I assist you today?`,
    es: `¡Hola! Soy ${persona.name}, ${persona.role}. Estoy aquí para ayudarte con ${context.businessDomain}. ¿Cómo puedo asistirte hoy?`
  };
  
  return messages[language] || messages.pt;
}

// Função para gerar placeholder de input
function generateInputPlaceholder(agent: AgentData): string {
  const { persona, context } = agent;
  const language = agent.persona.language;
  
  const placeholders = {
    pt: `Digite sua pergunta sobre ${context.businessDomain}...`,
    en: `Type your question about ${context.businessDomain}...`,
    es: `Escribe tu pregunta sobre ${context.businessDomain}...`
  };
  
  return placeholders[language] || placeholders.pt;
}

// Função para obter templates disponíveis
export function getAvailableTemplates(): FlowiseTemplate[] {
  return Object.values(AGENT_TEMPLATES);
}

// Função para obter template por nome
export function getTemplateByName(name: string): FlowiseTemplate | undefined {
  return AGENT_TEMPLATES[name];
}

// Função para criar template customizado
export function createCustomTemplate(
  name: string,
  description: string,
  type: 'CHATFLOW' | 'AGENTFLOW' | 'MULTIAGENT' | 'ASSISTANT',
  category: string,
  nodes: FlowiseNode[],
  edges: FlowiseEdge[]
): FlowiseTemplate {
  return {
    name,
    description,
    type,
    category,
    nodes,
    edges
  };
}