import ZAI from 'z-ai-web-dev-sdk';

async function analyzeDocumentation() {
  try {
    console.log('=== Analisando Documentação do Flowise ===\n');
    
    // Inicializar ZAI diretamente
    const zai = await ZAI.create();
    
    console.log('ZAI initialized successfully\n');
    
    // Pedir à IA para analisar a documentação do Flowise
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em análise de documentação técnica. Por favor, analise e explique as diferenças entre AgentFlow v2 e ChatFlows no Flowise, baseado na documentação oficial.'
        },
        {
          role: 'user',
          content: `Por favor, analise a documentação do Flowise em https://docs.flowiseai.com/using-flowise/agentflowv2 e https://docs.flowiseai.com/ e explique:

1. Qual é a diferença principal entre AgentFlow v2 e ChatFlows?
2. Quando usar cada um?
3. Qual é a estrutura de dados de cada um?
4. Como os componentes são organizados em cada um?
5. Qual é mais adequado para exportar agentes do Zanai?

Por favor, forneça uma análise detalhada e técnica que nos ajude a entender como integrar o Zanai com o Flowise.`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    console.log('Resposta completa da API:');
    console.log(JSON.stringify(completion, null, 2));
    console.log('\n' + '='.repeat(80) + '\n');
    
    if (completion && completion.choices && completion.choices.length > 0) {
      console.log('Análise da documentação do Flowise:');
      console.log(completion.choices[0].message.content);
    } else {
      console.log('Nenhuma resposta válida recebida');
    }
    
  } catch (error) {
    console.error('Erro ao buscar documentação:', error.message);
    console.error('Detalhes do erro:', error);
  }
}

analyzeDocumentation();