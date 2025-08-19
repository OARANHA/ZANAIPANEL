/**
 * Teste simples para verificar a autenticação
 */

const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config();

// Configurações
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

console.log(colors.cyan + colors.bright + '🧪 TESTE DE AUTENTICAÇÃO' + colors.reset);
console.log(colors.blue + '==========================' + colors.reset + '\n');

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
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(colors.red + `❌ Error response: ${responseText}` + colors.reset);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    try {
      const data = JSON.parse(responseText);
      console.log(colors.green + `✅ Response received successfully` + colors.reset);
      return data;
    } catch (e) {
      console.log(colors.green + `✅ Response received (text): ${responseText}` + colors.reset);
      return responseText;
    }
  } catch (error) {
    console.error(colors.red + `❌ Request failed: ${error.message}` + colors.reset);
    throw error;
  }
}

// Testar diferentes endpoints
async function testAuthentication() {
  console.log(colors.yellow + '📋 Testando endpoints sem autenticação...' + colors.reset);
  
  // Testar GET /api/v1/agents
  try {
    await apiRequest(`${ZANAI_URL}/api/v1/agents`);
    console.log(colors.green + `✅ GET /api/v1/agents - OK` + colors.reset);
  } catch (error) {
    console.log(colors.red + `❌ GET /api/v1/agents - Falhou: ${error.message}` + colors.reset);
  }
  
  // Testar POST /api/v1/agents sem autenticação
  try {
    const agentData = {
      name: `Teste Auth ${Date.now()}`,
      type: 'custom',
      persona: {
        name: 'Test',
        role: 'Teste',
        personality: 'Teste',
        expertise: [],
        communicationStyle: 'Teste',
        language: 'pt'
      },
      context: {
        businessDomain: 'Teste',
        industry: 'Teste',
        targetAudience: 'Teste'
      }
    };
    
    await apiRequest(`${ZANAI_URL}/api/v1/agents`, {
      method: 'POST',
      body: JSON.stringify(agentData)
    });
    console.log(colors.green + `✅ POST /api/v1/agents - OK` + colors.reset);
  } catch (error) {
    console.log(colors.red + `❌ POST /api/v1/agents - Falhou: ${error.message}` + colors.reset);
  }
  
  // Testar com cookies de autenticação (simulando um usuário logado)
  console.log(colors.yellow + '\n📋 Testando com cookies de autenticação...' + colors.reset);
  
  try {
    const agentData = {
      name: `Teste Auth com Cookie ${Date.now()}`,
      type: 'custom',
      persona: {
        name: 'Test',
        role: 'Teste',
        personality: 'Teste',
        expertise: [],
        communicationStyle: 'Teste',
        language: 'pt'
      },
      context: {
        businessDomain: 'Teste',
        industry: 'Teste',
        targetAudience: 'Teste'
      }
    };
    
    const response = await apiRequest(`${ZANAI_URL}/api/v1/agents`, {
      method: 'POST',
      body: JSON.stringify(agentData),
      headers: {
        'Cookie': 'isAuthenticated=true; userId=cmei1348d0000ox4qxipzjqk9; userEmail=superadmin@zanai.com; userName=Super Administrador; userRole=SUPER_ADMIN'
      }
    });
    console.log(colors.green + `✅ POST /api/v1/agents com cookies - OK` + colors.reset);
    
    if (response.flowise) {
      console.log(colors.green + `✅ Integração Flowise:` + colors.reset);
      console.log(colors.blue + `   Status: ${response.flowise.status}` + colors.reset);
      console.log(colors.blue + `   Workflow ID: ${response.flowise.workflowId || 'N/A'}` + colors.reset);
      console.log(colors.blue + `   Embed URL: ${response.flowise.embedUrl || 'N/A'}` + colors.reset);
      
      if (response.flowise.error) {
        console.log(colors.red + `   Erro: ${response.flowise.error}` + colors.reset);
      }
    }
    
  } catch (error) {
    console.log(colors.red + `❌ POST /api/v1/agents com cookies - Falhou: ${error.message}` + colors.reset);
  }
}

// Função principal
async function main() {
  console.log(colors.cyan + '🚀 Iniciando teste de autenticação...' + colors.reset);
  console.log(colors.blue + `ZanAI URL: ${ZANAI_URL}` + colors.reset + '\n');

  try {
    await testAuthentication();
    
    console.log(colors.magenta + colors.bright + '\n📊 RESUMO' + colors.reset);
    console.log(colors.magenta + '==========' + colors.reset);
    console.log(colors.yellow + 'Verifique os resultados acima para ver se a autenticação está funcionando.' + colors.reset);
    console.log(colors.yellow + 'Se os testes com cookies falharem, o problema pode estar na:' + colors.reset);
    console.log(colors.blue + '1. Configuração dos cookies no middleware' + colors.reset);
    console.log(colors.blue + '2. Lógica de autenticação no arquivo auth.ts' + colors.reset);
    console.log(colors.blue + '3. Forma como a interface está enviando os cookies' + colors.reset);
    
  } catch (error) {
    console.error(colors.red + colors.bright + '\n💥 ERRO CRÍTICO!' + colors.reset);
    console.error(colors.red + `Erro: ${error.message}` + colors.reset);
  }
}

// Executar o teste
main().catch(console.error);