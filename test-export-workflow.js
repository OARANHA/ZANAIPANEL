#!/usr/bin/env node

// Script para testar exportação de workflows para o Flowise
const fetch = require('node-fetch');

async function testExport() {
  console.log('🧪 Testando exportação de workflows...\n');

  try {
    // 1. Testar conexão
    console.log('1. Testando conexão com Flowise...');
    const testResponse = await fetch('http://localhost:3000/api/flowise-external-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test_connection' })
    });

    const testResult = await testResponse.json();
    console.log('Resposta do teste de conexão:', JSON.stringify(testResult, null, 2));

    if (!testResult.success) {
      console.error('❌ Falha na conexão:', testResult.message);
      return;
    }

    console.log('✅ Conexão estabelecida com sucesso\n');

    // 2. Obter workflows disponíveis
    console.log('2. Obtendo workflows disponíveis...');
    const workflowsResponse = await fetch('http://localhost:3000/api/flowise-external-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_workflows' })
    });

    const workflowsResult = await workflowsResponse.json();
    console.log('Resposta dos workflows:', JSON.stringify(workflowsResult, null, 2));

    if (!workflowsResult.success) {
      console.error('❌ Falha ao obter workflows:', workflowsResult.message);
      return;
    }

    const workflows = workflowsResult.data || [];
    console.log(`✅ Encontrados ${workflows.length} workflows\n`);

    // 3. Testar exportação do primeiro workflow
    if (workflows.length > 0) {
      console.log('3. Testando exportação do primeiro workflow...');
      const firstWorkflow = workflows[0];
      console.log('Workflow selecionado:', firstWorkflow.name, '(', firstWorkflow.id, ')');

      // Preparar dados para exportação
      const exportData = {
        name: firstWorkflow.name,
        description: firstWorkflow.description || '',
        type: firstWorkflow.type,
        flowData: firstWorkflow.flowData,
        deployed: firstWorkflow.deployed || false,
        isPublic: firstWorkflow.isPublic || false,
        category: firstWorkflow.category || 'general'
      };

      console.log('Dados de exportação:', JSON.stringify(exportData, null, 2));

      const exportResponse = await fetch('http://localhost:3000/api/flowise-external-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export_workflow',
          canvasId: firstWorkflow.id,
          workflowData: exportData
        })
      });

      const exportResult = await exportResponse.json();
      console.log('Resposta da exportação:', JSON.stringify(exportResult, null, 2));

      if (exportResult.success) {
        console.log('✅ Exportação bem sucedida!');
      } else {
        console.error('❌ Falha na exportação:', exportResult.message);
      }
    } else {
      console.log('⚠️ Nenhum workflow disponível para testar exportação');
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Executar teste
testExport();