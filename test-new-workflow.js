#!/usr/bin/env node

/**
 * Script para testar envio de novo workflow para o Flowise
 * Uso: node test-new-workflow.js
 */

const testWorkflow = {
  name: "Agente de Vendas Inteligente",
  description: "Agente especializado em vendas e atendimento ao cliente",
  type: "CHATFLOW",
  category: "business",
  deployed: false,
  isPublic: false,
  flowData: JSON.stringify({
    nodes: [
      {
        id: "chat-input-1",
        type: "ChatInput",
        position: { x: 100, y: 100 },
        data: {
          label: "Chat Input",
          name: "chatInput",
          category: "Input",
          inputs: [],
          outputs: [{ type: "message", name: "message" }]
        }
      },
      {
        id: "openai-1",
        type: "OpenAI",
        position: { x: 300, y: 100 },
        data: {
          label: "OpenAI",
          name: "openai",
          category: "LLMs",
          inputs: [
            { type: "message", name: "message" },
            { type: "systemPrompt", name: "systemPrompt" }
          ],
          outputs: [{ type: "message", name: "response" }],
          modelName: "gpt-3.5-turbo",
          temperature: 0.8,
          maxTokens: 1500,
          systemMessage: `Você é um agente de vendas inteligente e especializado.

**Personalidade e Estilo:**
- Profissional, amigável e persuasivo
- Focado em soluções e benefícios
- Linguagem clara e objetiva

**Expertise:**
- Vendas consultivas
- Atendimento ao cliente
- Identificação de necessidades
- Fechamento de negócios

**Contexto:**
- Trabalha para uma empresa de tecnologia inovadora
- Produtos/Serviços: Soluções de IA e automação
- Público-alvo: Empresas de pequeno e médio porte

**Diretrizes:**
1. Seja proativo em identificar oportunidades
2. Foque nos benefícios e resultados
3. Use exemplos concretos quando possível
4. Seja transparente sobre preços e condições
5. Mantenha tom profissional mas acessível

Responda sempre em português e busque entender as necessidades do cliente antes de apresentar soluções.`
        }
      },
      {
        id: "chat-output-1",
        type: "ChatOutput",
        position: { x: 500, y: 100 },
        data: {
          label: "Chat Output",
          name: "chatOutput",
          category: "Output",
          inputs: [{ type: "message", name: "message" }],
          outputs: []
        }
      },
      {
        id: "memory-1",
        type: "Conversation Memory",
        position: { x: 300, y: 250 },
        data: {
          label: "Conversation Memory",
          name: "conversationMemory",
          category: "Memory",
          inputs: [{ type: "message", name: "message" }],
          outputs: [{ type: "memory", name: "context" }],
          memoryType: "buffer",
          memoryCapacity: 500
        }
      }
    ],
    edges: [
      {
        id: "e1",
        source: "chat-input-1",
        target: "openai-1",
        sourceHandle: "message",
        targetHandle: "message"
      },
      {
        id: "e2",
        source: "openai-1",
        target: "chat-output-1",
        sourceHandle: "response",
        targetHandle: "message"
      },
      {
        id: "e3",
        source: "memory-1",
        target: "openai-1",
        sourceHandle: "context",
        targetHandle: "systemPrompt"
      }
    ],
    viewport: { x: 0, y: 0, zoom: 1 }
  })
};

console.log('🚀 Testando envio de novo workflow para o Flowise...');
console.log('📋 Dados do workflow:');
console.log(`   Nome: ${testWorkflow.name}`);
console.log(`   Descrição: ${testWorkflow.description}`);
console.log(`   Tipo: ${testWorkflow.type}`);
console.log(`   Categoria: ${testWorkflow.category}`);
console.log('');

// Testar via API local
const testLocalAPI = async () => {
  try {
    console.log('🔧 Testando via API local...');
    
    const response = await fetch('http://localhost:3000/api/flowise-external-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'export_workflow',
        canvasId: '', // Deixar vazio para criar novo
        workflowData: testWorkflow
      })
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Sucesso! Workflow criado/atualizado no Flowise');
      console.log('📊 Resultado:', JSON.stringify(result, null, 2));
      
      if (result.data?.flowiseResponse?.id) {
        const workflowId = result.data.flowiseResponse.id;
        console.log('');
        console.log('🌐 URLs de acesso:');
        console.log(`   Editor: https://aaranha-zania.hf.space/chatflows/${workflowId}`);
        console.log(`   Chat: https://aaranha-zania.hf.space/chat/${workflowId}`);
      }
    } else {
      console.log('❌ Erro na requisição:', result);
    }
  } catch (error) {
    console.error('❌ Erro ao testar API local:', error.message);
  }
};

// Testar via API direta do Flowise
const testDirectAPI = async () => {
  try {
    console.log('');
    console.log('🔧 Testando via API direta do Flowise...');
    
    const response = await fetch('https://aaranha-zania.hf.space/api/v1/chatflows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer wNFL5HJcOA3RwJdKiVTUWqdzigK7OCUwRKo9KEgjenw'
      },
      body: JSON.stringify(testWorkflow)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Sucesso! Workflow criado diretamente no Flowise');
      console.log('📊 Resultado:', JSON.stringify(result, null, 2));
      
      if (result.id) {
        console.log('');
        console.log('🌐 URLs de acesso:');
        console.log(`   Editor: https://aaranha-zania.hf.space/chatflows/${result.id}`);
        console.log(`   Chat: https://aaranha-zania.hf.space/chat/${result.id}`);
      }
    } else {
      console.log('❌ Erro na requisição direta:', result);
    }
  } catch (error) {
    console.error('❌ Erro ao testar API direta:', error.message);
  }
};

// Executar testes
const runTests = async () => {
  await testLocalAPI();
  await testDirectAPI();
  
  console.log('');
  console.log('🎉 Testes concluídos!');
  console.log('💡 Verifique os resultados acima e acesse as URLs geradas para testar os workflows.');
};

runTests().catch(console.error);