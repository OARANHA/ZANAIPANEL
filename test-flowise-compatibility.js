/**
 * Teste de Compatibilidade Flowise
 * Verifica se os workflows exportados do ZanAI funcionam no Flowise
 */

const fs = require('fs');
const path = require('path');

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

console.log(colors.cyan + colors.bright + '🧪 TESTE DE COMPATIBILIDADE FLOWISE' + colors.reset);
console.log(colors.blue + '===================================' + colors.reset + '\n');

// Configurações
const FLOWISE_URL = process.env.FLOWISE_URL || 'http://localhost:3000';
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY || 'your-api-key-here';
const ZANAI_URL = process.env.ZANAI_URL || 'http://localhost:3000';

// Templates de teste baseados nos nossos agentes
const testWorkflows = [
  {
    name: 'Simple Chat Test',
    type: 'simple-chat',
    description: 'Teste de workflow simples de chat',
    config: {
      nodes: [
        {
          id: 'chat-input',
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
          id: 'openai',
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
            systemMessage: 'Você é um assistente útil e amigável.'
          }
        },
        {
          id: 'chat-output',
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
          source: 'chat-input',
          target: 'openai',
          sourceHandle: 'message',
          targetHandle: 'message'
        },
        {
          id: 'e2',
          source: 'openai',
          target: 'chat-output',
          sourceHandle: 'response',
          targetHandle: 'message'
        }
      ]
    }
  },
  {
    name: 'Documentation Test',
    type: 'documentation',
    description: 'Teste de workflow de documentação',
    config: {
      nodes: [
        {
          id: 'file-upload',
          type: 'FileUpload',
          position: { x: 100, y: 100 },
          data: {
            label: 'File Upload',
            name: 'fileUpload',
            category: 'Input',
            inputs: [],
            outputs: [{ type: 'file', name: 'file' }],
            acceptedFileTypes: '.txt,.pdf,.doc,.docx',
            maxFileSize: '10MB'
          }
        },
        {
          id: 'document-loader',
          type: 'DocumentLoader',
          position: { x: 300, y: 100 },
          data: {
            label: 'Document Loader',
            name: 'documentLoader',
            category: 'Processing',
            inputs: [{ type: 'file', name: 'file' }],
            outputs: [{ type: 'documents', name: 'documents' }],
            chunkSize: 1000,
            chunkOverlap: 200
          }
        },
        {
          id: 'vector-store',
          type: 'VectorStore',
          position: { x: 500, y: 100 },
          data: {
            label: 'Vector Store',
            name: 'vectorStore',
            category: 'Memory',
            inputs: [{ type: 'documents', name: 'documents' }],
            outputs: [{ type: 'vectors', name: 'vectors' }],
            vectorStoreType: 'FAISS'
          }
        },
        {
          id: 'retrieval-qa',
          type: 'RetrievalQA',
          position: { x: 700, y: 100 },
          data: {
            label: 'Retrieval QA',
            name: 'retrievalQA',
            category: 'LLMs',
            inputs: [
              { type: 'question', name: 'question' },
              { type: 'vectors', name: 'vectors' }
            ],
            outputs: [{ type: 'answer', name: 'answer' }],
            modelName: 'gpt-3.5-turbo',
            temperature: 0.1,
            systemMessage: 'Você é um assistente especializado em documentação.'
          }
        },
        {
          id: 'chat-output',
          type: 'ChatOutput',
          position: { x: 900, y: 100 },
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
          id: 'e1',
          source: 'file-upload',
          target: 'document-loader',
          sourceHandle: 'file',
          targetHandle: 'file'
        },
        {
          id: 'e2',
          source: 'document-loader',
          target: 'vector-store',
          sourceHandle: 'documents',
          targetHandle: 'documents'
        },
        {
          id: 'e3',
          source: 'vector-store',
          target: 'retrieval-qa',
          sourceHandle: 'vectors',
          targetHandle: 'vectors'
        },
        {
          id: 'e4',
          source: 'retrieval-qa',
          target: 'chat-output',
          sourceHandle: 'answer',
          targetHandle: 'answer'
        }
      ]
    }
  }
];

// Função para fazer requisições à API
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(colors.red + `❌ Erro na requisição: ${error.message}` + colors.reset);
    throw error;
  }
}

// Função para testar a criação de workflow no Flowise
async function testFlowiseCreation(workflow) {
  console.log(colors.yellow + `📋 Testando workflow: ${workflow.name}` + colors.reset);
  
  try {
    // Criar workflow no Flowise
    const flowiseData = {
      name: workflow.name,
      description: workflow.description,
      flowData: JSON.stringify(workflow.config),
      type: 'CHATFLOW',
      category: workflow.type,
      deployed: false,
      isPublic: false
    };

    const response = await apiRequest(`${FLOWISE_URL}/api/v1/chatflows`, {
      method: 'POST',
      body: JSON.stringify(flowiseData),
      headers: {
        'Authorization': `Bearer ${FLOWISE_API_KEY}`
      }
    });

    console.log(colors.green + `✅ Workflow criado no Flowise: ${response.id}` + colors.reset);
    console.log(colors.blue + `   URL: ${FLOWISE_URL}/chat/${response.id}` + colors.reset);

    // Testar se o workflow abre corretamente
    const workflowInfo = await apiRequest(`${FLOWISE_URL}/api/v1/chatflows/${response.id}`, {
      headers: {
        'Authorization': `Bearer ${FLOWISE_API_KEY}`
      }
    });

    console.log(colors.green + `✅ Workflow pode ser acessado via API` + colors.reset);
    console.log(colors.blue + `   Status: ${workflowInfo.status || 'Ativo'}` + colors.reset);

    // Testar a estrutura do workflow
    const flowData = typeof workflowInfo.flowData === 'string' ? 
      JSON.parse(workflowInfo.flowData) : workflowInfo.flowData;

    if (flowData.nodes && flowData.edges) {
      console.log(colors.green + `✅ Estrutura do workflow válida` + colors.reset);
      console.log(colors.blue + `   Nodes: ${flowData.nodes.length}` + colors.reset);
      console.log(colors.blue + `   Edges: ${flowData.edges.length}` + colors.reset);
    }

    // Testar execução básica
    try {
      const testMessage = {
        message: 'Olá! Este é um teste de compatibilidade.',
        history: []
      };

      const executionResponse = await apiRequest(`${FLOWISE_URL}/api/v1/chatflows/${response.id}`, {
        method: 'POST',
        body: JSON.stringify(testMessage),
        headers: {
          'Authorization': `Bearer ${FLOWISE_API_KEY}`
        }
      });

      console.log(colors.green + `✅ Workflow executado com sucesso` + colors.reset);
      console.log(colors.blue + `   Resposta: ${executionResponse.text || executionResponse.answer || 'Resposta recebida'}` + colors.reset);
    } catch (execError) {
      console.log(colors.yellow + `⚠️  Workflow criado mas execução falhou: ${execError.message}` + colors.reset);
    }

    // Limpar workflow de teste
    try {
      await apiRequest(`${FLOWISE_URL}/api/v1/chatflows/${response.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${FLOWISE_API_KEY}`
        }
      });
      console.log(colors.green + `✅ Workflow de teste removido` + colors.reset);
    } catch (deleteError) {
      console.log(colors.yellow + `⚠️  Falha ao remover workflow: ${deleteError.message}` + colors.reset);
    }

    return true;
  } catch (error) {
    console.error(colors.red + `❌ Falha no teste do workflow ${workflow.name}: ${error.message}` + colors.reset);
    return false;
  }
}

// Função para testar a API do ZanAI
async function testZanAIAPI() {
  console.log(colors.yellow + '\n📋 Testando API do ZanAI...' + colors.reset);
  
  try {
    // Testar listagem de agentes
    const agentsResponse = await apiRequest(`${ZANAI_URL}/api/v1/agents`);
    console.log(colors.green + `✅ API do ZanAI acessível` + colors.reset);
    console.log(colors.blue + `   Total de agentes: ${agentsResponse.length || 0}` + colors.reset);

    // Testar listagem de workflows Flowise
    const workflowsResponse = await apiRequest(`${ZANAI_URL}/api/v1/flowise-workflows`);
    console.log(colors.green + `✅ Workflows Flowise registrados` + colors.reset);
    console.log(colors.blue + `   Total de workflows: ${workflowsResponse.length || 0}` + colors.reset);

    return true;
  } catch (error) {
    console.error(colors.red + `❌ Falha na API do ZanAI: ${error.message}` + colors.reset);
    return false;
  }
}

// Função para validar a estrutura dos workflows
function validateWorkflowStructure(workflow) {
  const errors = [];
  const warnings = [];

  // Validar nodes
  if (!workflow.config.nodes || workflow.config.nodes.length === 0) {
    errors.push('Workflow sem nodes');
  } else {
    workflow.config.nodes.forEach((node, index) => {
      if (!node.id) errors.push(`Node ${index + 1} sem ID`);
      if (!node.type) errors.push(`Node ${index + 1} sem tipo`);
      if (!node.position) errors.push(`Node ${index + 1} sem posição`);
      if (!node.data) warnings.push(`Node ${index + 1} sem dados`);
    });
  }

  // Validar edges
  if (!workflow.config.edges || workflow.config.edges.length === 0) {
    warnings.push('Workflow sem edges');
  } else {
    workflow.config.edges.forEach((edge, index) => {
      if (!edge.source) errors.push(`Edge ${index + 1} sem source`);
      if (!edge.target) errors.push(`Edge ${index + 1} sem target`);
    });
  }

  // Validar conectividade
  if (workflow.config.nodes && workflow.config.edges) {
    const nodeIds = new Set(workflow.config.nodes.map(n => n.id));
    const disconnectedNodes = [];
    
    workflow.config.nodes.forEach(node => {
      const hasConnection = workflow.config.edges.some(e => 
        e.source === node.id || e.target === node.id
      );
      
      if (!hasConnection) {
        disconnectedNodes.push(node.id);
      }
    });
    
    if (disconnectedNodes.length > 0) {
      warnings.push(`Nodes desconectados: ${disconnectedNodes.join(', ')}`);
    }
  }

  return { errors, warnings };
}

// Função principal de teste
async function runCompatibilityTests() {
  console.log(colors.cyan + '🚀 Iniciando testes de compatibilidade...' + colors.reset);
  console.log(colors.blue + `Flowise URL: ${FLOWISE_URL}` + colors.reset);
  console.log(colors.blue + `ZanAI URL: ${ZANAI_URL}` + colors.reset);
  console.log(colors.blue + `API Key: ${FLOWISE_API_KEY ? 'Configurada' : 'NÃO CONFIGURADA'}` + colors.reset + '\n');

  const results = {
    zanaiAPI: false,
    workflows: [],
    structureValidation: []
  };

  try {
    // Testar API do ZanAI
    results.zanaiAPI = await testZanAIAPI();

    // Validar estrutura dos workflows
    console.log(colors.yellow + '\n📋 Validando estrutura dos workflows...' + colors.reset);
    
    testWorkflows.forEach((workflow, index) => {
      console.log(colors.blue + `\n📋 Workflow ${index + 1}: ${workflow.name}` + colors.reset);
      
      const validation = validateWorkflowStructure(workflow);
      results.structureValidation.push({
        name: workflow.name,
        validation: validation
      });

      if (validation.errors.length === 0) {
        console.log(colors.green + `✅ Estrutura válida` + colors.reset);
      } else {
        console.log(colors.red + `❌ Estrutura inválida` + colors.reset);
        validation.errors.forEach(error => {
          console.log(colors.red + `   - ${error}` + colors.reset);
        });
      }

      if (validation.warnings.length > 0) {
        console.log(colors.yellow + `⚠️  Avisos:` + colors.reset);
        validation.warnings.forEach(warning => {
          console.log(colors.yellow + `   - ${warning}` + colors.reset);
        });
      }
    });

    // Testar criação no Flowise
    console.log(colors.yellow + '\n📋 Testando criação no Flowise...' + colors.reset);
    
    for (const workflow of testWorkflows) {
      const result = await testFlowiseCreation(workflow);
      results.workflows.push({
        name: workflow.name,
        success: result
      });
    }

    // Resumo dos resultados
    console.log(colors.magenta + colors.bright + '\n📊 RESUMO DOS TESTES' + colors.reset);
    console.log(colors.magenta + '==================' + colors.reset);
    
    console.log(colors.blue + `API ZanAI: ${results.zanaiAPI ? '✅ OK' : '❌ FALHOU'}` + colors.reset);
    
    console.log(colors.blue + '\nEstrutura dos Workflows:' + colors.reset);
    results.structureValidation.forEach(result => {
      const status = result.validation.errors.length === 0 ? '✅ OK' : '❌ FALHOU';
      console.log(colors.blue + `  ${result.name}: ${status}` + colors.reset);
    });
    
    console.log(colors.blue + '\nCriação no Flowise:' + colors.reset);
    results.workflows.forEach(result => {
      const status = result.success ? '✅ OK' : '❌ FALHOU';
      console.log(colors.blue + `  ${result.name}: ${status}` + colors.reset);
    });

    const allTestsPassed = results.zanaiAPI && 
                          results.structureValidation.every(r => r.validation.errors.length === 0) &&
                          results.workflows.every(w => w.success);

    if (allTestsPassed) {
      console.log(colors.green + colors.bright + '\n🎉 TODOS OS TESTES PASSARAM!' + colors.reset);
      console.log(colors.green + 'A integração ZanAI → Flowise está funcionando corretamente!' + colors.reset);
    } else {
      console.log(colors.red + colors.bright + '\n❌ ALGUNS TESTES FALHARAM!' + colors.reset);
      console.log(colors.red + 'É necessário investigar e corrigir os problemas.' + colors.reset);
    }

    return results;

  } catch (error) {
    console.error(colors.red + colors.bright + '\n💥 ERRO CRÍTICO NOS TESTES!' + colors.reset);
    console.error(colors.red + `Erro: ${error.message}` + colors.reset);
    throw error;
  }
}

// Executar os testes
if (require.main === module) {
  runCompatibilityTests().catch(console.error);
}

module.exports = { runCompatibilityTests, testFlowiseCreation, validateWorkflowStructure };