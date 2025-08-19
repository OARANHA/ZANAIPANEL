/**
 * Teste de Exportação Real - Simulando a criação de agente
 * Vamos testar o processo completo de criação de agente com integração Flowise
 */

const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config();

// Configurações
const FLOWISE_URL = process.env.NEXT_PUBLIC_FLOWISE_URL || 'https://aaranha-zania.hf.space';
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY;
const ZANAI_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

console.log(colors.cyan + colors.bright + '🧪 TESTE DE EXPORTAÇÃO REAL - CRIAÇÃO DE AGENTE' + colors.reset);
console.log(colors.blue + '=============================================' + colors.reset + '\n');

// Função para fazer requisições à API
async function apiRequest(url, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    console.log(colors.blue + `📡 Request: ${options.method || 'GET'} ${url}` + colors.reset);
    console.log(colors.blue + `📊 Status: ${response.status} ${response.statusText}` + colors.reset);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(colors.red + `❌ Error response: ${errorText}` + colors.reset);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(colors.green + `✅ Response received successfully` + colors.reset);
    return data;
  } catch (error) {
    console.error(colors.red + `❌ Request failed: ${error.message}` + colors.reset);
    throw error;
  }
}

// Função para criar um agente de teste
async function createTestAgent() {
  console.log(colors.yellow + '📋 Criando agente de teste...' + colors.reset);
  
  const agentData = {
    name: 'Agente de Teste Exportação',
    description: 'Agente criado para testar exportação Flowise',
    type: 'custom',
    persona: {
      name: 'Assistant',
      role: 'Assistente Virtual',
      personality: 'Amigável e prestativo',
      expertise: ['atendimento ao cliente', 'vendas', 'suporte técnico'],
      communicationStyle: 'informal mas profissional',
      language: 'pt'
    },
    context: {
      businessDomain: 'Atendimento ao Cliente',
      industry: 'Tecnologia',
      targetAudience: 'Clientes e usuários',
      companyProfile: {
        name: 'ZanAI Test',
        size: 'medium',
        sector: 'Tecnologia'
      },
      knowledgeBase: ['produtos', 'serviços', 'políticas'],
      constraints: ['não pode dar informações financeiras', 'deve ser educado']
    },
    rgaConfig: {
      reasoningLevel: 'advanced',
      autonomy: 'medium',
      learningCapability: true,
      decisionMaking: 'assisted'
    },
    config: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
      tools: ['chat', 'memory'],
      memory: {
        type: 'hybrid',
        capacity: 1000
      }
    }
  };

  try {
    const response = await apiRequest(`${ZANAI_URL}/api/v1/agents`, {
      method: 'POST',
      body: JSON.stringify(agentData),
      headers: {
        'Content-Type': 'application/json',
        // Adicionar cookie de autenticação se necessário
        'Cookie': 'next-auth.session-token=test-session' // Isso pode precisar ser ajustado
      }
    });

    console.log(colors.green + `✅ Agente criado com sucesso!` + colors.reset);
    console.log(colors.blue + `   ID: ${response.id}` + colors.reset);
    console.log(colors.blue + `   Nome: ${response.name}` + colors.reset);
    console.log(colors.blue + `   Slug: ${response.slug}` + colors.reset);
    
    if (response.flowise) {
      console.log(colors.green + `✅ Integração Flowise:` + colors.reset);
      console.log(colors.blue + `   Status: ${response.flowise.status}` + colors.reset);
      console.log(colors.blue + `   Workflow ID: ${response.flowise.workflowId || 'N/A'}` + colors.reset);
      console.log(colors.blue + `   Embed URL: ${response.flowise.embedUrl || 'N/A'}` + colors.reset);
      
      if (response.flowise.error) {
        console.log(colors.red + `   Erro: ${response.flowise.error}` + colors.reset);
      }
    }
    
    return response;
  } catch (error) {
    console.error(colors.red + `❌ Falha ao criar agente: ${error.message}` + colors.reset);
    throw error;
  }
}

// Função para verificar se o workflow foi criado no Flowise
async function verifyWorkflowInFlowise(workflowId) {
  console.log(colors.yellow + '\n📋 Verificando workflow no Flowise...' + colors.reset);
  
  try {
    const response = await apiRequest(`${FLOWISE_URL}/api/v1/chatflows/${workflowId}`, {
      headers: {
        'Authorization': `Bearer ${FLOWISE_API_KEY}`
      }
    });

    console.log(colors.green + `✅ Workflow encontrado no Flowise!` + colors.reset);
    console.log(colors.blue + `   ID: ${response.id}` + colors.reset);
    console.log(colors.blue + `   Nome: ${response.name}` + colors.reset);
    console.log(colors.blue + `   Tipo: ${response.type}` + colors.reset);
    console.log(colors.blue + `   Categoria: ${response.category}` + colors.reset);
    
    return true;
  } catch (error) {
    console.error(colors.red + `❌ Workflow não encontrado no Flowise: ${error.message}` + colors.reset);
    return false;
  }
}

// Função para testar a conexão com as APIs
async function testConnections() {
  console.log(colors.yellow + '📋 Testando conexões...' + colors.reset);
  
  // Testar conexão com Flowise
  try {
    const flowiseResponse = await apiRequest(`${FLOWISE_URL}/api/v1/chatflows`, {
      headers: {
        'Authorization': `Bearer ${FLOWISE_API_KEY}`
      }
    });
    
    console.log(colors.green + `✅ Conexão com Flowise OK!` + colors.reset);
    console.log(colors.blue + `   Workflows encontrados: ${flowiseResponse.data?.length || 0}` + colors.reset);
  } catch (error) {
    console.error(colors.red + `❌ Falha na conexão com Flowise: ${error.message}` + colors.reset);
  }
  
  // Testar conexão com ZanAI
  try {
    const zanaiResponse = await apiRequest(`${ZANAI_URL}/api/v1/agents`);
    console.log(colors.green + `✅ Conexão com ZanAI OK!` + colors.reset);
    console.log(colors.blue + `   API respondendo corretamente` + colors.reset);
  } catch (error) {
    console.error(colors.red + `❌ Falha na conexão com ZanAI: ${error.message}` + colors.reset);
  }
}

// Função principal
async function main() {
  console.log(colors.cyan + '🚀 Iniciando teste de exportação real...' + colors.reset);
  console.log(colors.blue + `Flowise URL: ${FLOWISE_URL}` + colors.reset);
  console.log(colors.blue + `ZanAI URL: ${ZANAI_URL}` + colors.reset);
  console.log(colors.blue + `Flowise API Key: ${FLOWISE_API_KEY ? 'Configurada' : 'NÃO CONFIGURADA'}` + colors.reset + '\n');

  if (!FLOWISE_API_KEY) {
    console.error(colors.red + '❌ FLOWISE_API_KEY não está configurada!' + colors.reset);
    return;
  }

  try {
    // Testar conexões
    await testConnections();
    
    // Criar agente de teste
    const agent = await createTestAgent();
    
    // Verificar se o workflow foi criado no Flowise
    if (agent.flowise && agent.flowise.workflowId) {
      const workflowExists = await verifyWorkflowInFlowise(agent.flowise.workflowId);
      
      if (workflowExists) {
        console.log(colors.green + colors.bright + '\n🎉 SUCESSO COMPLETO!' + colors.reset);
        console.log(colors.green + 'Agente criado e workflow exportado para Flowise com sucesso!' + colors.reset);
        console.log(colors.yellow + '\n📝 URLs de acesso:' + colors.reset);
        console.log(colors.blue + `   Agente no ZanAI: ${ZANAI_URL}/chat/${agent.id}` + colors.reset);
        console.log(colors.blue + `   Workflow no Flowise: ${FLOWISE_URL}/canvas/${agent.flowise.workflowId}` + colors.reset);
        console.log(colors.blue + `   Chat do Workflow: ${FLOWISE_URL}/chat/${agent.flowise.workflowId}` + colors.reset);
      } else {
        console.log(colors.red + colors.bright + '\n❌ FALHA NA EXPORTAÇÃO!' + colors.reset);
        console.log(colors.red + 'Agente criado mas workflow não foi encontrado no Flowise!' + colors.reset);
      }
    } else {
      console.log(colors.red + colors.bright + '\n❌ FALHA NA INTEGRAÇÃO!' + colors.reset);
      console.log(colors.red + 'Agente criado mas não houve integração com Flowise!' + colors.reset);
      if (agent.flowise && agent.flowise.error) {
        console.log(colors.red + `Erro: ${agent.flowise.error}` + colors.reset);
      }
    }
    
  } catch (error) {
    console.error(colors.red + colors.bright + '\n💥 ERRO CRÍTICO!' + colors.reset);
    console.error(colors.red + `Erro: ${error.message}` + colors.reset);
  }
}

// Executar o teste
main().catch(console.error);