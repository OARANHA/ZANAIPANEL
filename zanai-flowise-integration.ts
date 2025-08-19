/**
 * Integração ZanAI + Flowise
 * Este arquivo mostra como integrar a criação de agentes no ZanAI com o Flowise
 */

import { ZanAIAgentCreator } from './zanai-agent-creator';

export class ZanAIFlowiseIntegration {
  private flowiseUrl: string;
  private apiKey?: string;

  constructor(flowiseUrl: string, apiKey?: string) {
    this.flowiseUrl = flowiseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Cria e envia um agente completo para o Flowise
   */
  async createAndSendAgent(config: {
    name: string;
    description: string;
    systemMessage: string;
    modelName?: string;
    temperature?: number;
    tools?: Array<{
      type: string;
      name: string;
      config?: Record<string, any>;
    }>;
    saveToFile?: boolean;
    filename?: string;
  }): Promise<{
    agent: any;
    flowiseResponse?: any;
    filePath?: string;
  }> {
    try {
      console.log('🚀 Iniciando criação do agente...');
      
      // 1. Criar o agente no formato ZanAI
      const agent = ZanAIAgentCreator.createSimpleAgent(config);
      console.log('✅ Agente criado no formato ZanAI');

      // 2. Salvar em arquivo se solicitado
      let filePath: string | undefined;
      if (config.saveToFile) {
        const filename = config.filename || `${config.name.toLowerCase().replace(/\s+/g, '-')}-agent.json`;
        ZanAIAgentCreator.saveToFile(agent, filename);
        filePath = filename;
        console.log('💾 Agente salvo em arquivo:', filename);
      }

      // 3. Enviar para o Flowise
      let flowiseResponse: any;
      try {
        flowiseResponse = await ZanAIAgentCreator.sendToFlowise(agent, this.flowiseUrl, this.apiKey);
        console.log('🎯 Agente enviado para o Flowise com sucesso!');
      } catch (error) {
        console.warn('⚠️ Não foi possível enviar para o Flowise:', error);
        console.log('📝 O agente foi criado e salvo localmente');
      }

      return {
        agent,
        flowiseResponse,
        filePath
      };
    } catch (error) {
      console.error('❌ Erro ao criar e enviar agente:', error);
      throw error;
    }
  }

  /**
   * Cria um agente de suporte técnico completo
   */
  async createTechSupportAgent(): Promise<any> {
    return this.createAndSendAgent({
      name: "Agente de Suporte Técnico",
      description: "Assistente especializado em suporte técnico e solução de problemas",
      systemMessage: `Você é um agente de suporte técnico especializado. 
      Sua função é ajudar os usuários a resolver problemas técnicos de forma clara e eficiente.
      
      **Suas principais responsabilidades:**
      - Diagnosticar problemas técnicos
      - Fornecer soluções passo a passo
      - Buscar informações atualizadas quando necessário
      - Realizar cálculos técnicos quando preciso
      - Ser paciente e educado com todos os usuários
      
      **Como proceder:**
      1. Ouça atentamente o problema do usuário
      2. Faça perguntas claras para entender melhor a situação
      3. Use ferramentas de busca para encontrar soluções atualizadas
      4. Forneça instruções detalhadas e fáceis de seguir
      5. Ofereça acompanhamento se necessário`,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.7,
      tools: [
        {
          type: "calculator",
          name: "Calculadora Técnica",
          config: {}
        },
        {
          type: "serp",
          name: "Busca de Soluções",
          config: {
            apiKey: process.env.SERP_API_KEY || "sua_api_key"
          }
        }
      ],
      saveToFile: true,
      filename: "tech-support-agent.json"
    });
  }

  /**
   * Cria um agente de vendas completo
   */
  async createSalesAgent(): Promise<any> {
    return this.createAndSendAgent({
      name: "Agente de Vendas",
      description: "Assistente especializado em vendas e atendimento ao cliente",
      systemMessage: `Você é um agente de vendas profissional e persuasivo.
      
      **Sua missão:**
      - Ajudar clientes a encontrar os melhores produtos/serviços
      - Fornecer informações precisas sobre produtos
      - Realizar cálculos de preços e orçamentos
      - Ser persuasivo mas honesto
      - Focar nas necessidades reais do cliente
      
      **Abordagem recomendada:**
      1. Entenda as necessidades do cliente
      2. Pesquise produtos relevantes
      3. Apresente opções com vantagens e desvantagens
      4. Faça cálculos de custo-benefício
      5. Ofereça a melhor solução para o cliente`,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.8,
      tools: [
        {
          type: "calculator",
          name: "Calculadora de Preços",
          config: {}
        },
        {
          type: "serp",
          name: "Pesquisa de Produtos",
          config: {
            apiKey: process.env.SERP_API_KEY || "sua_api_key"
          }
        }
      ],
      saveToFile: true,
      filename: "sales-agent.json"
    });
  }

  /**
   * Cria um agente de pesquisa acadêmica completo
   */
  async createResearchAgent(): Promise<any> {
    return this.createAndSendAgent({
      name: "Agente de Pesquisa Acadêmica",
      description: "Assistente especializado em pesquisa acadêmica e análise de dados",
      systemMessage: `Você é um agente de pesquisa acadêmica especializado.
      
      **Sua especialização:**
      - Buscar artigos acadêmicos e estudos científicos
      - Analisar dados e estatísticas
      - Fornecer informações precisas e atualizadas
      - Citar fontes confiáveis
      - Ser meticuloso e preciso nas informações
      
      **Metodologia de trabalho:**
      1. Entenda o tema de pesquisa
      2. Busque artigos relevantes em bases acadêmicas
      3. Analise dados estatísticos quando necessário
      4. Sintetize informações de forma clara
      5. Forneça referências completas`,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.5,
      tools: [
        {
          type: "serp",
          name: "Busca Acadêmica",
          config: {
            apiKey: process.env.SERP_API_KEY || "sua_api_key"
          }
        },
        {
          type: "arxiv",
          name: "Busca em Artigos",
          config: {}
        },
        {
          type: "calculator",
          name: "Análise Estatística",
          config: {}
        }
      ],
      saveToFile: true,
      filename: "research-agent.json"
    });
  }

  /**
   * Cria um agente de produtividade pessoal completo
   */
  async createProductivityAgent(): Promise<any> {
    return this.createAndSendAgent({
      name: "Agente de Produtividade",
      description: "Assistente para gerenciamento de tarefas e produtividade pessoal",
      systemMessage: `Você é um agente de produtividade pessoal.
      
      **Seu objetivo:**
      - Ajudar usuários a organizar suas tarefas
      - Gerenciar calendário e compromissos
      - Organizar emails e comunicações
      - Aumentar a eficiência e produtividade
      - Sugerir melhorias de organização
      
      **Como ajudar:**
      1. Entenda a rotina e necessidades do usuário
      2. Ajude a organizar o calendário
      3. Classifique e priorize emails
      4. Crie planilhas de acompanhamento
      5. Sugira técnicas de produtividade`,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.6,
      tools: [
        {
          type: "google_calendar",
          name: "Gerenciador de Calendário",
          config: {
            credentials: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              refreshToken: process.env.GOOGLE_REFRESH_TOKEN
            }
          }
        },
        {
          type: "gmail",
          name: "Gerenciador de Email",
          config: {
            credentials: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              refreshToken: process.env.GOOGLE_REFRESH_TOKEN
            }
          }
        },
        {
          type: "google_sheets",
          name: "Gerenciador de Planilhas",
          config: {
            credentials: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              refreshToken: process.env.GOOGLE_REFRESH_TOKEN
            }
          }
        }
      ],
      saveToFile: true,
      filename: "productivity-agent.json"
    });
  }

  /**
   * Lista todos os agentes criados no Flowise
   */
  async listAgents(): Promise<any[]> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.flowiseUrl}/api/v1/chatflows`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar agentes: ${response.status} ${response.statusText}`);
      }

      const agents = await response.json();
      console.log(`📋 Encontrados ${agents.length} agentes no Flowise`);
      
      return agents;
    } catch (error) {
      console.error('❌ Erro ao listar agentes:', error);
      throw error;
    }
  }

  /**
   * Testa um agente específico
   */
  async testAgent(agentId: string, message: string): Promise<any> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.flowiseUrl}/api/v1/chatflows/${agentId}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          overrideConfig: {
            sessionId: `test-${Date.now()}`
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ao testar agente: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('💬 Resposta do agente:', result.text);
      
      return result;
    } catch (error) {
      console.error('❌ Erro ao testar agente:', error);
      throw error;
    }
  }

  /**
   * Demonstração completa da integração
   */
  async demonstrateFullIntegration(): Promise<void> {
    console.log('🎭 Demonstração Completa da Integração ZanAI + Flowise\n');

    try {
      // 1. Criar diferentes tipos de agentes
      console.log('1️⃣ Criando agentes...');
      const techAgent = await this.createTechSupportAgent();
      const salesAgent = await this.createSalesAgent();
      const researchAgent = await this.createResearchAgent();
      
      console.log('✅ Agentes criados com sucesso!\n');

      // 2. Listar agentes no Flowise
      console.log('2️⃣ Listando agentes no Flowise...');
      const agents = await this.listAgents();
      console.log(`📊 Total de agentes: ${agents.length}\n`);

      // 3. Testar um dos agentes
      if (agents.length > 0) {
        console.log('3️⃣ Testando agente...');
        const testAgent = agents[0];
        console.log(`🧪 Testando agente: ${testAgent.name}`);
        
        try {
          const response = await this.testAgent(testAgent.id, "Olá! Como você pode me ajudar?");
          console.log('✅ Teste realizado com sucesso!\n');
        } catch (testError) {
          console.log('⚠️ Não foi possível testar o agente (pode precisar de configuração adicional)\n');
        }
      }

      console.log('🎉 Demonstração concluída com sucesso!');
      console.log('📁 Arquivos JSON dos agentes foram salvos localmente');
      console.log('🌐 Agentes estão disponíveis no Flowise para uso');

    } catch (error) {
      console.error('❌ Erro na demonstração:', error);
      throw error;
    }
  }
}

// Função principal para demonstração
export async function runDemonstration() {
  // Configurações - ajuste conforme seu ambiente
  const flowiseUrl = process.env.FLOWISE_URL || 'http://localhost:3000';
  const flowiseApiKey = process.env.FLOWISE_API_KEY;

  console.log('🔧 Configurações:');
  console.log(`Flowise URL: ${flowiseUrl}`);
  console.log(`API Key: ${flowiseApiKey ? '***' : 'Não configurada'}\n`);

  const integration = new ZanAIFlowiseIntegration(flowiseUrl, flowiseApiKey);
  
  try {
    await integration.demonstrateFullIntegration();
  } catch (error) {
    console.error('❌ Falha na demonstração:', error);
    
    // Mesmo com falha, tenta criar os agentes localmente
    console.log('\n🔄 Tentando criar agentes localmente...');
    const localIntegration = new ZanAIFlowiseIntegration('');
    
    try {
      await localIntegration.createTechSupportAgent();
      await localIntegration.createSalesAgent();
      await localIntegration.createResearchAgent();
      console.log('✅ Agentes criados localmente com sucesso!');
    } catch (localError) {
      console.error('❌ Falha ao criar agentes localmente:', localError);
    }
  }
}

// Exportar para uso em outros módulos
export default ZanAIFlowiseIntegration;

// Se este arquivo for executado diretamente
if (require.main === module) {
  runDemonstration().catch(console.error);
}