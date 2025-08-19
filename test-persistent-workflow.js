/**
 * Teste Real: Criar workflow persistente no Flowise
 * Este teste cria um workflow que NÃO é deletado para verificação manual
 */

const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config();

// Configurações
const FLOWISE_URL = process.env.NEXT_PUBLIC_FLOWISE_URL || 'https://aaranha-zania.hf.space';
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY;

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

console.log(colors.cyan + colors.bright + '🧪 TESTE REAL: CRIAR WORKFLOW PERSISTENTE' + colors.reset);
console.log(colors.blue + '=============================================' + colors.reset + '\n');

// Função para fazer requisições à API do Flowise
async function flowiseRequest(endpoint, options = {}) {
  const url = `${FLOWISE_URL}${endpoint}`;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FLOWISE_API_KEY}`,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(colors.red + `❌ Erro na requisição: ${error.message}` + colors.reset);
    throw error;
  }
}

// Função para criar um workflow persistente
async function createPersistentWorkflow() {
  console.log(colors.yellow + '📋 Criando workflow persistente no Flowise...' + colors.reset);
  
  const persistentWorkflow = {
    name: 'ZanAI Test Workflow - PERSISTENTE',
    description: 'Workflow criado pelo ZanAI para testes de compatibilidade',
    flowData: JSON.stringify({
      nodes: [
        {
          id: 'chat-input-1',
          type: 'ChatInput',
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
          id: 'openai-1',
          type: 'OpenAI',
          position: { x: 400, y: 100 },
          data: {
            label: 'OpenAI',
            name: 'openai',
            category: 'LLMs',
            inputs: [
              { type: 'message', name: 'message' },
              { type: 'systemPrompt', name: 'systemPrompt' }
            ],
            outputs: [{ type: 'message', name: 'response' }],
            modelName: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 1000,
            systemMessage: 'Você é um assistente útil e amigável. Este é um teste de compatibilidade ZanAI-Flowise.'
          }
        },
        {
          id: 'chat-output-1',
          type: 'ChatOutput',
          position: { x: 700, y: 100 },
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
          id: 'e1',
          source: 'chat-input-1',
          target: 'openai-1',
          sourceHandle: 'message',
          targetHandle: 'message'
        },
        {
          id: 'e2',
          source: 'openai-1',
          target: 'chat-output-1',
          sourceHandle: 'response',
          targetHandle: 'message'
        }
      ]
    }),
    type: 'CHATFLOW',
    category: 'test',
    deployed: false,
    isPublic: false,
    workspaceId: 'a38d6158-637c-43f5-bc00-6429b4365f64'
  };

  try {
    const response = await flowiseRequest('/api/v1/chatflows', {
      method: 'POST',
      body: JSON.stringify(persistentWorkflow)
    });

    console.log(colors.green + `✅ Workflow persistente criado com sucesso!` + colors.reset);
    console.log(colors.blue + `   ID: ${response.id}` + colors.reset);
    console.log(colors.blue + `   Nome: ${response.name}` + colors.reset);
    console.log(colors.blue + `   Canvas URL: ${FLOWISE_URL}/canvas/${response.id}` + colors.reset);
    console.log(colors.blue + `   Chat URL: ${FLOWISE_URL}/chat/${response.id}` + colors.reset);
    
    return response;
  } catch (error) {
    console.error(colors.red + `❌ Falha ao criar workflow persistente: ${error.message}` + colors.reset);
    throw error;
  }
}

// Função para verificar se o workflow existe no banco de dados
async function verifyWorkflowInDatabase(workflowId) {
  console.log(colors.yellow + '\n📋 Verificando se o workflow existe no banco de dados...' + colors.reset);
  
  try {
    const workflow = await flowiseRequest(`/api/v1/chatflows/${workflowId}`);
    
    console.log(colors.green + `✅ Workflow encontrado no banco de dados!` + colors.reset);
    console.log(colors.blue + `   ID: ${workflow.id}` + colors.reset);
    console.log(colors.blue + `   Nome: ${workflow.name}` + colors.reset);
    console.log(colors.blue + `   Criado em: ${workflow.createdAt || new Date().toISOString()}` + colors.reset);
    console.log(colors.blue + `   Status: ${workflow.status || 'Ativo'}` + colors.reset);
    
    // Verificar a estrutura do flowData
    if (workflow.flowData) {
      const flowData = typeof workflow.flowData === 'string' ? 
        JSON.parse(workflow.flowData) : workflow.flowData;
      
      console.log(colors.green + `✅ Estrutura do workflow válida:` + colors.reset);
      console.log(colors.blue + `   Nodes: ${flowData.nodes?.length || 0}` + colors.reset);
      console.log(colors.blue + `   Edges: ${flowData.edges?.length || 0}` + colors.reset);
    }
    
    return true;
  } catch (error) {
    console.error(colors.red + `❌ Workflow não encontrado no banco de dados: ${error.message}` + colors.reset);
    return false;
  }
}

// Função para listar todos os workflows existentes
async function listAllWorkflows() {
  console.log(colors.yellow + '\n📋 Listando todos os workflows existentes...' + colors.reset);
  
  try {
    const workflows = await flowiseRequest('/api/v1/chatflows');
    
    console.log(colors.green + `✅ Encontrados ${workflows.length} workflows no total:` + colors.reset);
    
    workflows.forEach((workflow, index) => {
      console.log(colors.blue + `   ${index + 1}. ${workflow.name} (ID: ${workflow.id})` + colors.reset);
      console.log(colors.cyan + `      Canvas: ${FLOWISE_URL}/canvas/${workflow.id}` + colors.reset);
      console.log(colors.cyan + `      Chat: ${FLOWISE_URL}/chat/${workflow.id}` + colors.reset);
    });
    
    return workflows;
  } catch (error) {
    console.error(colors.red + `❌ Falha ao listar workflows: ${error.message}` + colors.reset);
    return [];
  }
}

// Função principal
async function main() {
  console.log(colors.cyan + '🚀 Iniciando teste de workflow persistente...' + colors.reset);
  console.log(colors.blue + `Flowise URL: ${FLOWISE_URL}` + colors.reset);
  console.log(colors.blue + `API Key: ${FLOWISE_API_KEY ? 'Configurada' : 'NÃO CONFIGURADA'}` + colors.reset + '\n');

  if (!FLOWISE_API_KEY) {
    console.error(colors.red + '❌ FLOWISE_API_KEY não está configurada!' + colors.reset);
    console.error(colors.yellow + 'Configure a variável de ambiente antes de executar este teste.' + colors.reset);
    return;
  }

  try {
    // Listar workflows existentes
    await listAllWorkflows();
    
    // Criar workflow persistente
    const workflow = await createPersistentWorkflow();
    
    // Verificar se o workflow existe no banco de dados
    const existsInDb = await verifyWorkflowInDatabase(workflow.id);
    
    if (existsInDb) {
      console.log(colors.green + colors.bright + '\n🎉 SUCESSO!' + colors.reset);
      console.log(colors.green + 'Workflow criado e persistido no banco de dados com sucesso!' + colors.reset);
      console.log(colors.yellow + '\n📝 INSTRUÇÕES:' + colors.reset);
      console.log(colors.blue + '1. Acesse o Flowise: https://aaranha-zania.hf.space/chatflows' + colors.reset);
      console.log(colors.blue + `2. Procure pelo workflow: "${workflow.name}"` + colors.reset);
      console.log(colors.blue + `3. Ou acesse diretamente: ${FLOWISE_URL}/canvas/${workflow.id}` + colors.reset);
      console.log(colors.red + '\n⚠️  ATENÇÃO: Este workflow NÃO será deletado automaticamente!' + colors.reset);
      console.log(colors.red + 'Você precisará deletá-lo manualmente se necessário.' + colors.reset);
    } else {
      console.log(colors.red + colors.bright + '\n❌ FALHA!' + colors.reset);
      console.log(colors.red + 'Workflow foi criado mas não foi encontrado no banco de dados!' + colors.reset);
    }
    
  } catch (error) {
    console.error(colors.red + colors.bright + '\n💥 ERRO CRÍTICO!' + colors.reset);
    console.error(colors.red + `Erro: ${error.message}` + colors.reset);
  }
}

// Executar o teste
main().catch(console.error);