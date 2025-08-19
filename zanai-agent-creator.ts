/**
 * Criador de Agentes ZanAI e Exportador para Flowise
 * Este arquivo mostra como criar agentes no ZanAI e enviá-los para o Flowise
 */

import { ZanAIAgent, convertAndExportAgent, createSampleAgent } from './zanai-to-flowise-converter';

export class ZanAIAgentCreator {
  /**
   * Cria um agente no ZanAI com configuração simples
   */
  static createSimpleAgent(config: {
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
  }): ZanAIAgent {
    return {
      name: config.name,
      description: config.description,
      systemMessage: config.systemMessage,
      model: {
        name: config.modelName || 'gpt-4-turbo-preview',
        temperature: config.temperature || 0.7,
        maxTokens: 4000
      },
      tools: config.tools || [],
      memory: {
        type: 'buffer',
        config: {
          maxTokens: 2000
        }
      }
    };
  }

  /**
   * Cria um agente de suporte técnico
   */
  static createTechSupportAgent(): ZanAIAgent {
    return this.createSimpleAgent({
      name: "Agente de Suporte Técnico",
      description: "Assistente especializado em suporte técnico e solução de problemas",
      systemMessage: `Você é um agente de suporte técnico especializado. 
      Sua função é ajudar os usuários a resolver problemas técnicos de forma clara e eficiente.
      Use ferramentas de busca para encontrar soluções atualizadas e calculadora para realizar cálculos quando necessário.
      Seja paciente, educado e forneça instruções passo a passo.`,
      tools: [
        {
          type: "calculator",
          name: "Calculadora",
          config: {}
        },
        {
          type: "serp",
          name: "Busca Técnica",
          config: {
            apiKey: process.env.SERP_API_KEY || "sua_api_key"
          }
        }
      ]
    });
  }

  /**
   * Cria um agente de vendas
   */
  static createSalesAgent(): ZanAIAgent {
    return this.createSimpleAgent({
      name: "Agente de Vendas",
      description: "Assistente especializado em vendas e atendimento ao cliente",
      systemMessage: `Você é um agente de vendas profissional e persuasivo.
      Sua função é ajudar os clientes a encontrar os melhores produtos/serviços para suas necessidades.
      Use ferramentas de busca para pesquisar produtos e preços, e calculadora para ajudar com orçamentos.
      Seja persuasivo mas honesto, focado nas necessidades do cliente.`,
      tools: [
        {
          type: "calculator",
          name: "Calculadora",
          config: {}
        },
        {
          type: "serp",
          name: "Pesquisa de Produtos",
          config: {
            apiKey: process.env.SERP_API_KEY || "sua_api_key"
          }
        }
      ]
    });
  }

  /**
   * Cria um agente de pesquisa
   */
  static createResearchAgent(): ZanAIAgent {
    return this.createSimpleAgent({
      name: "Agente de Pesquisa",
      description: "Assistente especializado em pesquisa acadêmica e análise de dados",
      systemMessage: `Você é um agente de pesquisa acadêmico especializado.
      Sua função é ajudar usuários a encontrar informações precisas e atualizadas.
      Use ferramentas de busca para encontrar artigos, estudos e dados relevantes.
      Seja meticuloso, cite fontes quando possível e forneça informações precisas.`,
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
          name: "Análise de Dados",
          config: {}
        }
      ]
    });
  }

  /**
   * Cria um agente de produtividade
   */
  static createProductivityAgent(): ZanAIAgent {
    return this.createSimpleAgent({
      name: "Agente de Produtividade",
      description: "Assistente para gerenciamento de tarefas e produtividade",
      systemMessage: `Você é um agente de produtividade pessoal.
      Sua função é ajudar os usuários a organizar suas tarefas, gerenciar tempo e aumentar a produtividade.
      Use ferramentas de calendário, email e planilhas para ajudar na organização.
      Seja proativo e sugira melhorias de produtividade.`,
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
      ]
    });
  }

  /**
   * Envia o agente para o Flowise via API
   */
  static async sendToFlowise(agent: ZanAIAgent, flowiseUrl: string, apiKey?: string): Promise<any> {
    try {
      // Converte o agente ZanAI para o formato Flowise
      const flowiseJson = convertAndExportAgent(agent);
      const flowiseData = JSON.parse(flowiseJson);

      // Prepara os headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      // Envia para o Flowise
      const response = await fetch(`${flowiseUrl}/api/v1/chatflows`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: agent.name,
          description: agent.description,
          type: 'tool-agent',
          flowData: flowiseData,
          deployed: true
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar para Flowise: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Agente enviado com sucesso para o Flowise!');
      console.log('📋 Detalhes:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Erro ao enviar agente para o Flowise:', error);
      throw error;
    }
  }

  /**
   * Salva o agente em um arquivo JSON
   */
  static saveToFile(agent: ZanAIAgent, filename: string): void {
    try {
      const flowiseJson = convertAndExportAgent(agent);
      
      // Para Node.js
      if (typeof require !== 'undefined' && require('fs')) {
        const fs = require('fs');
        fs.writeFileSync(filename, flowiseJson, 'utf8');
        console.log(`✅ Agente salvo em ${filename}`);
      } else {
        // Para navegador
        const blob = new Blob([flowiseJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        console.log(`✅ Agente baixado como ${filename}`);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar agente:', error);
      throw error;
    }
  }
}

// Exemplos de uso
export function demonstrateAgentCreation() {
  console.log('=== Demonstração de Criação de Agentes ZanAI ===\n');

  // 1. Criar um agente de suporte técnico
  console.log('1. Criando Agente de Suporte Técnico...');
  const techSupportAgent = ZanAIAgentCreator.createTechSupportAgent();
  console.log('✅ Agente de Suporte Técnico criado!\n');

  // 2. Criar um agente de vendas
  console.log('2. Criando Agente de Vendas...');
  const salesAgent = ZanAIAgentCreator.createSalesAgent();
  console.log('✅ Agente de Vendas criado!\n');

  // 3. Criar um agente de pesquisa
  console.log('3. Criando Agente de Pesquisa...');
  const researchAgent = ZanAIAgentCreator.createResearchAgent();
  console.log('✅ Agente de Pesquisa criado!\n');

  // 4. Salvar os agentes em arquivos
  console.log('4. Salvando agentes em arquivos...');
  ZanAIAgentCreator.saveToFile(techSupportAgent, 'tech-support-agent.json');
  ZanAIAgentCreator.saveToFile(salesAgent, 'sales-agent.json');
  ZanAIAgentCreator.saveToFile(researchAgent, 'research-agent.json');
  console.log('✅ Todos os agentes salvos!\n');

  // 5. Exibir estrutura do agente
  console.log('5. Estrutura do Agente de Suporte Técnico:');
  console.log(JSON.stringify(techSupportAgent, null, 2));

  return {
    techSupportAgent,
    salesAgent,
    researchAgent
  };
}

// Exemplo de como usar em uma aplicação real
export async function exampleUsage() {
  // Configurações
  const flowiseUrl = process.env.FLOWISE_URL || 'http://localhost:3000';
  const flowiseApiKey = process.env.FLOWISE_API_KEY;

  try {
    // Criar um agente
    const agent = ZanAIAgentCreator.createTechSupportAgent();
    
    // Enviar para o Flowise
    const result = await ZanAIAgentCreator.sendToFlowise(agent, flowiseUrl, flowiseApiKey);
    
    console.log('🎉 Agente criado e enviado com sucesso!');
    console.log('📊 ID do Chatflow:', result.id);
    console.log('🔗 URL do Chatflow:', `${flowiseUrl}/chat/${result.id}`);
    
    return result;
  } catch (error) {
    console.error('❌ Falha ao criar e enviar agente:', error);
    throw error;
  }
}

// Exportar para uso em outros módulos
export default ZanAIAgentCreator;

// Se este arquivo for executado diretamente
if (require.main === module) {
  demonstrateAgentCreation();
  
  // Exemplo de envio para Flowise (comente se não tiver um servidor Flowise rodando)
  // exampleUsage().catch(console.error);
}