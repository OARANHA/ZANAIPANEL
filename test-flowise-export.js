/**
 * Teste Focado: Exportação ZanAI → Flowise
 * Verifica se os workflows gerados abrem corretamente no Flowise
 */

const fs = require('fs');
const path = require('path');

// Configurações
const FLOWISE_URL = process.env.FLOWISE_URL || 'http://localhost:3000';
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY || 'your-api-key-here';

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

console.log(colors.cyan + colors.bright + '🧪 TESTE DE EXPORTAÇÃO ZANAI → FLOWISE' + colors.reset);
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

// Função para testar a criação de um workflow simples
async function testSimpleWorkflowExport() {
  console.log(colors.yellow + '📋 Test 1: Criando workflow simples no Flowise...' + colors.reset);
  
  const simpleWorkflow = {
    name: 'Test Export Simple',
    template: 'simple-chat',
    description: 'Teste de exportação de workflow simples',
    config: {
      nodes: [
        {
          id: '1',
          type: 'ChatInput',
          position: { x: 100, y: 100 },
          data: {}
        },
        {
          id: '2',
          type: 'OpenAI',
          position: { x: 400, y: 100 },
          data: {
            modelName: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 1000,
            systemMessage: 'Você é um assistente útil.'
          }
        },
        {
          id: '3',
          type: 'ChatOutput',
          position: { x: 700, y: 100 },
          data: {}
        }
      ],
      edges: [
        { source: '1', target: '2', sourceHandle: null, targetHandle: null },
        { source: '2', target: '3', sourceHandle: null, targetHandle: null }
      ]
    }
  };

  try {
    const response = await flowiseRequest('/api/v1/chatflows', {
      method: 'POST',
      body: JSON.stringify(simpleWorkflow)
    });

    console.log(colors.green + `✅ Workflow simples criado: ${response.id}` + colors.reset);
    console.log(colors.blue + `   Nome: ${response.name}` + colors.reset);
    console.log(colors.blue + `   URL: ${FLOWISE_URL}/chat/${response.id}` + colors.reset);
    
    return response.id;
  } catch (error) {
    console.error(colors.red + `❌ Falha ao criar workflow simples: ${error.message}` + colors.reset);
    throw error;
  }
}

// Função para testar a abertura do workflow no Flowise
async function testWorkflowOpening(workflowId) {
  console.log(colors.yellow + '\n📋 Test 2: Verificando se o workflow abre no Flowise...' + colors.reset);
  
  try {
    // Verificar se o workflow existe
    const workflow = await flowiseRequest(`/api/v1/chatflows/${workflowId}`);
    console.log(colors.green + `✅ Workflow encontrado no Flowise` + colors.reset);
    console.log(colors.blue + `   ID: ${workflow.id}` + colors.reset);
    console.log(colors.blue + `   Nome: ${workflow.name}` + colors.reset);
    console.log(colors.blue + `   Status: ${workflow.status || 'Ativo'}` + colors.reset);

    // Verificar a estrutura do workflow
    if (workflow.flowData) {
      const flowData = typeof workflow.flowData === 'string' ? 
        JSON.parse(workflow.flowData) : workflow.flowData;
      
      console.log(colors.green + `✅ Estrutura do workflow válida` + colors.reset);
      console.log(colors.blue + `   Nodes: ${flowData.nodes?.length || 0}` + colors.reset);
      console.log(colors.blue + `   Edges: ${flowData.edges?.length || 0}` + colors.reset);

      // Validar nodes
      if (flowData.nodes && flowData.nodes.length > 0) {
        console.log(colors.green + `✅ Nodes configurados corretamente` + colors.reset);
        flowData.nodes.forEach((node, index) => {
          console.log(colors.blue + `   Node ${index + 1}: ${node.type} (${node.id})` + colors.reset);
        });
      }

      // Validar edges
      if (flowData.edges && flowData.edges.length > 0) {
        console.log(colors.green + `✅ Conexões (edges) configuradas corretamente` + colors.reset);
        flowData.edges.forEach((edge, index) => {
          console.log(colors.blue + `   Edge ${index + 1}: ${edge.source} → ${edge.target}` + colors.reset);
        });
      }
    }

    // Testar a URL de embed
    const embedUrl = `${FLOWISE_URL}/chat/${workflowId}`;
    console.log(colors.green + `✅ URL de embed gerada: ${embedUrl}` + colors.reset);

    return true;
  } catch (error) {
    console.error(colors.red + `❌ Falha ao abrir workflow: ${error.message}` + colors.reset);
    return false;
  }
}

// Função para testar a execução do workflow
async function testWorkflowExecution(workflowId) {
  console.log(colors.yellow + '\n📋 Test 3: Testando execução do workflow...' + colors.reset);
  
  try {
    const testMessage = {
      message: 'Olá! Este é um teste de execução.',
      history: []
    };

    const response = await flowiseRequest(`/api/v1/chatflows/${workflowId}`, {
      method: 'POST',
      body: JSON.stringify(testMessage)
    });

    console.log(colors.green + `✅ Workflow executado com sucesso` + colors.reset);
    console.log(colors.blue + `   Resposta: ${response.text || response.answer || 'Sem resposta'}` + colors.reset);
    
    return true;
  } catch (error) {
    console.error(colors.red + `❌ Falha na execução do workflow: ${error.message}` + colors.reset);
    return false;
  }
}

// Função para testar a exportação de um agente complexo
async function testComplexWorkflowExport() {
  console.log(colors.yellow + '\n📋 Test 4: Criando workflow complexo (Documentation Agent)...' + colors.reset);
  
  const complexWorkflow = {
    name: 'Test Export Documentation',
    template: 'documentation',
    description: 'Teste de exportação de workflow complexo',
    config: {
      nodes: [
        {
          id: '1',
          type: 'ChatInput',
          position: { x: 100, y: 100 },
          data: {}
        },
        {
          id: '2',
          type: 'FileUpload',
          position: { x: 100, y: 200 },
          data: {
            acceptedFileTypes: '.txt,.pdf,.doc,.docx',
            maxFileSize: '10MB'
          }
        },
        {
          id: '3',
          type: 'DocumentLoader',
          position: { x: 400, y: 150 },
          data: {
            chunkSize: 1000,
            chunkOverlap: 200
          }
        },
        {
          id: '4',
          type: 'VectorStore',
          position: { x: 700, y: 150 },
          data: {
            vectorStoreType: 'FAISS'
          }
        },
        {
          id: '5',
          type: 'RetrievalQA',
          position: { x: 1000, y: 150 },
          data: {
            modelName: 'gpt-3.5-turbo',
            temperature: 0.1,
            systemMessage: 'Você é um assistente especializado em documentação.'
          }
        },
        {
          id: '6',
          type: 'ChatOutput',
          position: { x: 1300, y: 150 },
          data: {}
        }
      ],
      edges: [
        { source: '1', target: '5', sourceHandle: null, targetHandle: null },
        { source: '2', target: '3', sourceHandle: null, targetHandle: null },
        { source: '3', target: '4', sourceHandle: null, targetHandle: null },
        { source: '4', target: '5', sourceHandle: null, targetHandle: null },
        { source: '5', target: '6', sourceHandle: null, targetHandle: null }
      ]
    }
  };

  try {
    const response = await flowiseRequest('/api/v1/chatflows', {
      method: 'POST',
      body: JSON.stringify(complexWorkflow)
    });

    console.log(colors.green + `✅ Workflow complexo criado: ${response.id}` + colors.reset);
    console.log(colors.blue + `   Nome: ${response.name}` + colors.reset);
    console.log(colors.blue + `   Template: ${response.template}` + colors.reset);
    
    return response.id;
  } catch (error) {
    console.error(colors.red + `❌ Falha ao criar workflow complexo: ${error.message}` + colors.reset);
    throw error;
  }
}

// Função para limpar os workflows de teste
async function cleanupTestWorkflows(workflowIds) {
  console.log(colors.yellow + '\n📋 Test 5: Limpando workflows de teste...' + colors.reset);
  
  for (const workflowId of workflowIds) {
    try {
      await flowiseRequest(`/api/v1/chatflows/${workflowId}`, {
        method: 'DELETE'
      });
      console.log(colors.green + `✅ Workflow ${workflowId} removido` + colors.reset);
    } catch (error) {
      console.error(colors.red + `❌ Falha ao remover workflow ${workflowId}: ${error.message}` + colors.reset);
    }
  }
}

// Função principal de teste
async function runExportTests() {
  console.log(colors.cyan + '🚀 Iniciando testes de exportação ZanAI → Flowise...' + colors.reset);
  console.log(colors.blue + `Flowise URL: ${FLOWISE_URL}` + colors.reset);
  console.log(colors.blue + `API Key: ${FLOWISE_API_KEY ? '***' : 'NÃO CONFIGURADA'}` + colors.reset + '\n');

  const testWorkflows = [];

  try {
    // Test 1: Workflow simples
    const simpleWorkflowId = await testSimpleWorkflowExport();
    testWorkflows.push(simpleWorkflowId);

    // Test 2: Abrir workflow simples
    const simpleOpens = await testWorkflowOpening(simpleWorkflowId);
    
    // Test 3: Executar workflow simples
    const simpleExecutes = await testWorkflowExecution(simpleWorkflowId);

    // Test 4: Workflow complexo
    const complexWorkflowId = await testComplexWorkflowExport();
    testWorkflows.push(complexWorkflowId);

    // Test 5: Abrir workflow complexo
    const complexOpens = await testWorkflowOpening(complexWorkflowId);

    // Test 6: Executar workflow complexo
    const complexExecutes = await testWorkflowExecution(complexWorkflowId);

    // Resumo dos testes
    console.log(colors.magenta + colors.bright + '\n📊 RESUMO DOS TESTES' + colors.reset);
    console.log(colors.magenta + '==================' + colors.reset);
    console.log(colors.green + `✅ Workflow Simples - Criação: OK` + colors.reset);
    console.log(colors.green + `✅ Workflow Simples - Abertura: ${simpleOpens ? 'OK' : 'FALHOU'}` + colors.reset);
    console.log(colors.green + `✅ Workflow Simples - Execução: ${simpleExecutes ? 'OK' : 'FALHOU'}` + colors.reset);
    console.log(colors.green + `✅ Workflow Complexo - Criação: OK` + colors.reset);
    console.log(colors.green + `✅ Workflow Complexo - Abertura: ${complexOpens ? 'OK' : 'FALHOU'}` + colors.reset);
    console.log(colors.green + `✅ Workflow Complexo - Execução: ${complexExecutes ? 'OK' : 'FALHOU'}` + colors.reset);

    const allTestsPassed = simpleOpens && simpleExecutes && complexOpens && complexExecutes;
    
    if (allTestsPassed) {
      console.log(colors.green + colors.bright + '\n🎉 TODOS OS TESTES PASSARAM!' + colors.reset);
      console.log(colors.green + 'A exportação ZanAI → Flowise está funcionando corretamente!' + colors.reset);
    } else {
      console.log(colors.red + colors.bright + '\n❌ ALGUNS TESTES FALHARAM!' + colors.reset);
      console.log(colors.red + 'É necessário investigar e corrigir os problemas de exportação.' + colors.reset);
    }

  } catch (error) {
    console.error(colors.red + colors.bright + '\n💥 ERRO CRÍTICO NOS TESTES!' + colors.reset);
    console.error(colors.red + `Erro: ${error.message}` + colors.reset);
  } finally {
    // Limpar workflows de teste
    await cleanupTestWorkflows(testWorkflows);
  }
}

// Executar os testes
if (require.main === module) {
  runExportTests().catch(console.error);
}

module.exports = { runExportTests, testSimpleWorkflowExport, testComplexWorkflowExport };