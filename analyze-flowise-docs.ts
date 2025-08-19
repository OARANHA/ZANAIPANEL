import ZAI from 'z-ai-web-dev-sdk';

async function analyzeDocumentation() {
  try {
    console.log('=== Analisando Documentação do Flowise ===\n');
    
    // Inicializar ZAI diretamente
    const zai = await ZAI.create();
    
    console.log('ZAI initialized successfully\n');
    
    // Buscar conteúdo da documentação principal
    const searchResult1 = await zai.functions.invoke("web_search", {
      query: 'Flowise AgentFlow v2 vs ChatFlows documentation',
      num: 5
    });
    
    console.log('1. Resultados da busca sobre AgentFlow v2 vs ChatFlows:');
    console.log(JSON.stringify(searchResult1, null, 2));
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Buscar conteúdo específico da documentação
    const searchResult2 = await zai.functions.invoke("web_search", {
      query: 'site:docs.flowiseai.com AgentFlow v2 ChatFlows difference',
      num: 5
    });
    
    console.log('2. Resultados específicos da documentação do Flowise:');
    console.log(JSON.stringify(searchResult2, null, 2));
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Buscar mais detalhes sobre AgentFlow
    const searchResult3 = await zai.functions.invoke("web_search", {
      query: 'Flowise AgentFlow v2 features components structure',
      num: 5
    });
    
    console.log('3. Resultados sobre AgentFlow v2 features:');
    console.log(JSON.stringify(searchResult3, null, 2));
    
  } catch (error) {
    console.error('Erro ao buscar documentação:', error.message);
  }
}

analyzeDocumentation();