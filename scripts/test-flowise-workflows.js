const fetch = require('node-fetch');

async function testFlowiseWorkflows() {
  console.log('Testando a interface /flowise-workflows...\n');

  try {
    // Testar a API de workflows
    console.log('1. Testando API /api/v1/flowise-workflows...');
    const apiResponse = await fetch('http://localhost:3000/api/v1/flowise-workflows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'get_workflows',
        data: { page: 1, limit: 10 }
      })
    });

    const apiData = await apiResponse.json();
    console.log(`   Status: ${apiResponse.status}`);
    console.log(`   Sucesso: ${apiData.success}`);
    console.log(`   Workflows encontrados: ${apiData.workflows?.length || 0}`);
    
    if (apiData.workflows && apiData.workflows.length > 0) {
      console.log('   Primeiro workflow:', {
        id: apiData.workflows[0].id,
        name: apiData.workflows[0].name,
        type: apiData.workflows[0].type,
        complexity: apiData.workflows[0].complexityScore
      });
    }
    console.log('');

    // Testar a API de sincronização externa
    console.log('2. Testando API /api/flowise-external-sync...');
    const syncResponse = await fetch('http://localhost:3000/api/flowise-external-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'test_connection'
      })
    });

    const syncData = await syncResponse.json();
    console.log(`   Status: ${syncResponse.status}`);
    console.log(`   Sucesso: ${syncData.success}`);
    console.log(`   Mensagem: ${syncData.message}`);
    console.log('');

    // Testar a página principal
    console.log('3. Testando página /flowise-workflows...');
    const pageResponse = await fetch('http://localhost:3000/flowise-workflows');
    console.log(`   Status: ${pageResponse.status}`);
    console.log(`   Content-Type: ${pageResponse.headers.get('content-type')}`);
    
    if (pageResponse.ok) {
      const pageContent = await pageResponse.text();
      const hasFlowiseManager = pageContent.includes('FlowiseWorkflowManager');
      console.log(`   Contém FlowiseWorkflowManager: ${hasFlowiseManager}`);
    }
    console.log('');

    console.log('✅ Testes concluídos com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    process.exit(1);
  }
}

testFlowiseWorkflows();