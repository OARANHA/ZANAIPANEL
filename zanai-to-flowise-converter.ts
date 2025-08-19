/**
 * Conversor de Agentes ZanAI para Flowise
 * Transforma a estrutura simples do ZanAI no formato complexo do Flowise
 */

export interface ZanAIAgent {
  name: string;
  description: string;
  systemMessage: string;
  model: {
    name: string;
    temperature: number;
    maxTokens: number;
  };
  tools: Array<{
    type: string;
    name: string;
    config: Record<string, any>;
  }>;
  memory: {
    type: string;
    config: Record<string, any>;
  };
}

export interface FlowiseChatflow {
  nodes: FlowiseNode[];
  edges: FlowiseEdge[];
}

export interface FlowiseNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    inputParams: Record<string, any>;
    inputAnchors?: any[];
    outputAnchors?: any[];
  };
}

export interface FlowiseEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

export class ZanAIToFlowiseConverter {
  private nodeIdCounter = 1;
  private edgeIdCounter = 1;

  convert(agent: ZanAIAgent): FlowiseChatflow {
    const nodes: FlowiseNode[] = [];
    const edges: FlowiseEdge[] = [];

    // 1. Criar nó do modelo de chat
    const chatModelNode = this.createChatModelNode(agent);
    nodes.push(chatModelNode);

    // 2. Criar nó de memória
    const memoryNode = this.createMemoryNode(agent);
    nodes.push(memoryNode);

    // 3. Criar nós de ferramentas
    const toolNodes = this.createToolNodes(agent);
    nodes.push(...toolNodes);

    // 4. Criar nó principal do Tool Agent
    const toolAgentNode = this.createToolAgentNode(agent);
    nodes.push(toolAgentNode);

    // 5. Criar conexões (edges)
    edges.push(
      this.createEdge(chatModelNode.id, toolAgentNode.id, 'model', 'model'),
      this.createEdge(memoryNode.id, toolAgentNode.id, 'memory', 'memory')
    );

    // 6. Conectar ferramentas ao Tool Agent
    toolNodes.forEach(toolNode => {
      edges.push(
        this.createEdge(toolNode.id, toolAgentNode.id, 'tools', 'tools')
      );
    });

    return {
      nodes,
      edges
    };
  }

  private createChatModelNode(agent: ZanAIAgent): FlowiseNode {
    const id = `chatOpenAI_${this.nodeIdCounter++}`;
    
    return {
      id,
      type: 'ChatOpenAI',
      position: { x: 100, y: 100 },
      data: {
        inputParams: {
          modelName: agent.model.name,
          temperature: agent.model.temperature,
          systemMessage: agent.systemMessage,
          maxTokens: agent.model.maxTokens
        },
        inputAnchors: [
          {
            label: 'Model',
            name: 'model',
            type: 'target',
            id: `${id}-model`
          }
        ],
        outputAnchors: [
          {
            label: 'Model',
            name: 'model',
            type: 'source',
            id: `${id}-model`
          }
        ]
      }
    };
  }

  private createMemoryNode(agent: ZanAIAgent): FlowiseNode {
    const id = `bufferMemory_${this.nodeIdCounter++}`;
    
    return {
      id,
      type: 'BufferMemory',
      position: { x: 100, y: 200 },
      data: {
        inputParams: {
          memoryKey: 'chat_history',
          returnMessages: true,
          chatHistoryMaxTokens: agent.memory.config.maxTokens || 2000
        },
        inputAnchors: [
          {
            label: 'Memory',
            name: 'memory',
            type: 'target',
            id: `${id}-memory`
          }
        ],
        outputAnchors: [
          {
            label: 'Memory',
            name: 'memory',
            type: 'source',
            id: `${id}-memory`
          }
        ]
      }
    };
  }

  private createToolNodes(agent: ZanAIAgent): FlowiseNode[] {
    const nodes: FlowiseNode[] = [];
    let yOffset = 300;

    agent.tools.forEach((tool, index) => {
      const id = `${tool.type.toLowerCase()}_${this.nodeIdCounter++}`;
      
      const node: FlowiseNode = {
        id,
        type: this.mapToolType(tool.type),
        position: { x: 100, y: yOffset + (index * 100) },
        data: {
          inputParams: this.getToolConfig(tool),
          inputAnchors: [
            {
              label: 'Tools',
              name: 'tools',
              type: 'target',
              id: `${id}-tools`
            }
          ],
          outputAnchors: [
            {
              label: 'Tools',
              name: 'tools',
              type: 'source',
              id: `${id}-tools`
            }
          ]
        }
      };
      
      nodes.push(node);
    });

    return nodes;
  }

  private createToolAgentNode(agent: ZanAIAgent): FlowiseNode {
    const id = `toolAgent_${this.nodeIdCounter++}`;
    
    return {
      id,
      type: 'ToolAgent',
      position: { x: 300, y: 200 },
      data: {
        inputParams: {
          agentName: agent.name,
          agentDescription: agent.description,
          systemMessage: agent.systemMessage,
          maxIterations: 15,
          verbose: true
        },
        inputAnchors: [
          {
            label: 'Model',
            name: 'model',
            type: 'target',
            id: `${id}-model`
          },
          {
            label: 'Memory',
            name: 'memory',
            type: 'target',
            id: `${id}-memory`
          },
          {
            label: 'Tools',
            name: 'tools',
            type: 'target',
            id: `${id}-tools`
          }
        ],
        outputAnchors: [
          {
            label: 'Agent',
            name: 'agent',
            type: 'source',
            id: `${id}-agent`
          }
        ]
      }
    };
  }

  private createEdge(source: string, target: string, sourceHandle: string, targetHandle: string): FlowiseEdge {
    return {
      id: `edge_${this.edgeIdCounter++}`,
      source,
      target,
      sourceHandle,
      targetHandle
    };
  }

  private mapToolType(toolType: string): string {
    const toolTypeMap: Record<string, string> = {
      'calculator': 'Calculator',
      'serp': 'SerpAPI',
      'web_search': 'SerpAPI',
      'web_browser': 'WebBrowser',
      'web_scraper': 'WebScraperTool',
      'current_datetime': 'CurrentDateTime',
      'calculator': 'Calculator',
      'exa_search': 'ExaSearch',
      'wolfram_alpha': 'WolframAlpha',
      'gmail': 'Gmail',
      'google_calendar': 'GoogleCalendar',
      'google_sheets': 'GoogleSheets',
      'jira': 'Jira',
      'slack': 'Slack',
      'microsoft_teams': 'MicrosoftTeams',
      'arxiv': 'Arxiv',
      'read_file': 'ReadFile',
      'write_file': 'WriteFile',
      'requests_get': 'RequestsGet',
      'requests_post': 'RequestsPost',
      'json_path_extractor': 'JSONPathExtractor'
    };

    return toolTypeMap[toolType.toLowerCase()] || 'Calculator';
  }

  private getToolConfig(tool: any): Record<string, any> {
    const config: Record<string, any> = {};
    
    switch (tool.type.toLowerCase()) {
      case 'serp':
      case 'web_search':
        if (tool.config.apiKey) {
          config.serpApiApiKey = tool.config.apiKey;
        }
        break;
      case 'exa_search':
        if (tool.config.apiKey) {
          config.exaApiKey = tool.config.apiKey;
        }
        break;
      case 'wolfram_alpha':
        if (tool.config.apiKey) {
          config.wolframAlphaAppId = tool.config.apiKey;
        }
        break;
      case 'gmail':
      case 'google_calendar':
      case 'google_sheets':
        if (tool.config.credentials) {
          Object.assign(config, tool.config.credentials);
        }
        break;
      case 'jira':
        if (tool.config.baseUrl) {
          config.baseUrl = tool.config.baseUrl;
        }
        if (tool.config.username) {
          config.username = tool.config.username;
        }
        if (tool.config.apiToken) {
          config.apiToken = tool.config.apiToken;
        }
        break;
      case 'slack':
        if (tool.config.botToken) {
          config.slackBotToken = tool.config.botToken;
        }
        break;
      case 'microsoft_teams':
        if (tool.config.webhookUrl) {
          config.webhookUrl = tool.config.webhookUrl;
        }
        break;
    }
    
    return config;
  }
}

// Exemplo de uso
export function createSampleAgent(): ZanAIAgent {
  return {
    name: "Assistente Inteligente",
    description: "Assistente com acesso a calculadora e busca web",
    systemMessage: "Você é um assistente inteligente que pode ajudar com cálculos matemáticos e buscar informações na web. Seja útil, preciso e educado.",
    model: {
      name: "gpt-4-turbo-preview",
      temperature: 0.7,
      maxTokens: 4000
    },
    tools: [
      {
        type: "calculator",
        name: "Calculadora",
        config: {}
      },
      {
        type: "serp",
        name: "Busca Web",
        config: {
          apiKey: "sua_api_key_aqui"
        }
      }
    ],
    memory: {
      type: "buffer",
      config: {
        maxTokens: 2000
      }
    }
  };
}

// Função principal para converter e exportar
export function convertAndExportAgent(agent: ZanAIAgent): string {
  const converter = new ZanAIToFlowiseConverter();
  const flowiseChatflow = converter.convert(agent);
  
  return JSON.stringify(flowiseChatflow, null, 2);
}

// Exemplo de uso
if (require.main === module) {
  const sampleAgent = createSampleAgent();
  const flowiseJson = convertAndExportAgent(sampleAgent);
  console.log(flowiseJson);
}