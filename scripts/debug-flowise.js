// Script para debugar problemas com a interface Flowise Workflows
console.log('Iniciando debug da interface Flowise Workflows...');

// Testar se a página está carregando
async function testPageLoad() {
    try {
        const response = await fetch('http://localhost:3000/flowise-workflows');
        console.log('Status da página:', response.status);
        console.log('Content-Type:', response.headers.get('content-type'));
        
        if (response.ok) {
            const content = await response.text();
            console.log('Página carregada com sucesso!');
            console.log('Tamanho do conteúdo:', content.length, 'bytes');
            
            // Verificar se contém o componente principal
            const hasComponent = content.includes('FlowiseWorkflowManager');
            console.log('Contém FlowiseWorkflowManager:', hasComponent);
            
            // Verificar se há erros de JavaScript
            const hasErrors = content.includes('error') || content.includes('Error');
            console.log('Contém possíveis erros:', hasErrors);
            
            return true;
        } else {
            console.error('Erro ao carregar página:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Erro de rede:', error.message);
        return false;
    }
}

// Testar a API de workflows
async function testAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/flowise-workflows', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'get_workflows',
                data: { page: 1, limit: 10 }
            })
        });
        
        console.log('Status da API:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('API funcionando!');
            console.log('Sucesso:', data.success);
            console.log('Workflows encontrados:', data.workflows?.length || 0);
            
            if (data.workflows && data.workflows.length > 0) {
                const workflow = data.workflows[0];
                console.log('Primeiro workflow:', {
                    id: workflow.id,
                    name: workflow.name,
                    type: workflow.type,
                    capabilities: workflow.capabilities,
                    capabilitiesType: typeof workflow.capabilities
                });
            }
            
            return true;
        } else {
            console.error('Erro na API:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Erro na API:', error.message);
        return false;
    }
}

// Executar testes
async function runTests() {
    console.log('\n=== Testando carregamento da página ===');
    const pageOk = await testPageLoad();
    
    console.log('\n=== Testando API ===');
    const apiOk = await testAPI();
    
    console.log('\n=== Resumo ===');
    console.log('Página:', pageOk ? '✅ OK' : '❌ ERRO');
    console.log('API:', apiOk ? '✅ OK' : '❌ ERRO');
    
    if (pageOk && apiOk) {
        console.log('\n🎉 Tudo parece estar funcionando!');
        console.log('Se você ainda está vendo erro 500, pode ser um problema no navegador.');
        console.log('Tente:');
        console.log('1. Limpar o cache do navegador (Ctrl+F5)');
        console.log('2. Abrir o console do navegador (F12) para ver erros de JavaScript');
        console.log('3. Verificar se há algum erro de CORS ou permissão');
    } else {
        console.log('\n❌ Há problemas que precisam ser corrigidos');
    }
}

runTests().catch(console.error);