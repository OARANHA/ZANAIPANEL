/**
 * Exemplo de Uso Completo - ZanAI + Flowise
 * Este arquivo demonstra como criar agentes no ZanAI e enviá-los para o Flowise
 */

const { ZanAIFlowiseIntegration } = require('./zanai-flowise-integration');

// Configurações - ajuste conforme seu ambiente
const config = {
  flowiseUrl: process.env.FLOWISE_URL || 'http://localhost:3000',
  flowiseApiKey: process.env.FLOWISE_API_KEY,
  serpApiKey: process.env.SERP_API_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN
};

async function main() {
  console.log('🚀 Iniciando demonstração ZanAI + Flowise\n');

  // Criar instância da integração
  const integration = new ZanAIFlowiseIntegration(config.flowiseUrl, config.flowiseApiKey);

  try {
    // 1. Criar um agente de suporte técnico
    console.log('1️⃣ Criando Agente de Suporte Técnico...');
    const techSupportAgent = await integration.createAndSendAgent({
      name: "Agente de Suporte Técnico",
      description: "Assistente especializado em suporte técnico e solução de problemas",
      systemMessage: `Você é um agente de suporte técnico especializado. 
      Sua função é ajudar os usuários a resolver problemas técnicos de forma clara e eficiente.
      
      **Suas principais responsabilidades:**
      - Diagnosticar problemas técnicos
      - Fornecer soluções passo a passo
      - Buscar informações atualizadas quando necessário
      - Realizar cálculos técnicos quando preciso
      - Ser paciente e educado com todos os usuários
      
      **Como proceder:**
      1. Ouça atentamente o problema do usuário
      2. Faça perguntas claras para entender melhor a situação
      3. Use ferramentas de busca para encontrar soluções atualizadas
      4. Forneça instruções detalhadas e fáceis de seguir
      5. Ofereça acompanhamento se necessário`,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.7,
      tools: [
        {
          type: "calculator",
          name: "Calculadora Técnica",
          config: {}
        },
        {
          type: "serp",
          name: "Busca de Soluções",
          config: {
            apiKey: config.serpApiKey || "sua_api_key"
          }
        }
      ],
      saveToFile: true,
      filename: "tech-support-agent.json"
    });

    console.log('✅ Agente de Suporte Técnico criado!');
    if (techSupportAgent.flowiseResponse) {
      console.log(`📋 ID no Flowise: ${techSupportAgent.flowiseResponse.id}`);
    }
    console.log(`📁 Arquivo salvo: ${techSupportAgent.filePath}\n`);

    // 2. Criar um agente de vendas
    console.log('2️⃣ Criando Agente de Vendas...');
    const salesAgent = await integration.createAndSendAgent({
      name: "Agente de Vendas",
      description: "Assistente especializado em vendas e atendimento ao cliente",
      systemMessage: `Você é um agente de vendas profissional e persuasivo.
      
      **Sua missão:**
      - Ajudar clientes a encontrar os melhores produtos/serviços
      - Fornecer informações precisas sobre produtos
      - Realizar cálculos de preços e orçamentos
      - Ser persuasivo mas honesto
      - Focar nas necessidades reais do cliente
      
      **Abordagem recomendada:**
      1. Entenda as necessidades do cliente
      2. Pesquise produtos relevantes
      3. Apresente opções com vantagens e desvantagens
      4. Faça cálculos de custo-benefício
      5. Ofereça a melhor solução para o cliente`,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.8,
      tools: [
        {
          type: "calculator",
          name: "Calculadora de Preços",
          config: {}
        },
        {
          type: "serp",
          name: "Pesquisa de Produtos",
          config: {
            apiKey: config.serpApiKey || "sua_api_key"
          }
        }
      ],
      saveToFile: true,
      filename: "sales-agent.json"
    });

    console.log('✅ Agente de Vendas criado!');
    if (salesAgent.flowiseResponse) {
      console.log(`📋 ID no Flowise: ${salesAgent.flowiseResponse.id}`);
    }
    console.log(`📁 Arquivo salvo: ${salesAgent.filePath}\n`);

    // 3. Criar um agente de pesquisa
    console.log('3️⃣ Criando Agente de Pesquisa...');
    const researchAgent = await integration.createAndSendAgent({
      name: "Agente de Pesquisa Acadêmica",
      description: "Assistente especializado em pesquisa acadêmica e análise de dados",
      systemMessage: `Você é um agente de pesquisa acadêmica especializado.
      
      **Sua especialização:**
      - Buscar artigos acadêmicos e estudos científicos
      - Analisar dados e estatísticas
      - Fornecer informações precisas e atualizadas
      - Citar fontes confiáveis
      - Ser meticuloso e preciso nas informações
      
      **Metodologia de trabalho:**
      1. Entenda o tema de pesquisa
      2. Busque artigos relevantes em bases acadêmicas
      3. Analise dados estatísticos quando necessário
      4. Sintetize informações de forma clara
      5. Forneça referências completas`,
      modelName: "gpt-4-turbo-preview",
      temperature: 0.5,
      tools: [
        {
          type: "serp",
          name: "Busca Acadêmica",
          config: {
            apiKey: config.serpApiKey || "sua_api_key"
          }
        },
        {
          type: "arxiv",
          name: "Busca em Artigos",
          config: {}
        },
        {
          type: "calculator",
          name: "Análise Estatística",
          config: {}
        }
      ],
      saveToFile: true,
      filename: "research-agent.json"
    });

    console.log('✅ Agente de Pesquisa criado!');
    if (researchAgent.flowiseResponse) {
      console.log(`📋 ID no Flowise: ${researchAgent.flowiseResponse.id}`);
    }
    console.log(`📁 Arquivo salvo: ${researchAgent.filePath}\n`);

    // 4. Listar todos os agentes no Flowise
    console.log('4️⃣ Listando agentes no Flowise...');
    try {
      const agents = await integration.listAgents();
      console.log(`📊 Total de agentes encontrados: ${agents.length}`);
      
      agents.forEach((agent, index) => {
        console.log(`${index + 1}. ${agent.name} - ${agent.description}`);
        console.log(`   ID: ${agent.id}`);
        console.log(`   Tipo: ${agent.type}`);
        console.log(`   Deployado: ${agent.deployed ? 'Sim' : 'Não'}`);
        console.log('');
      });
    } catch (listError) {
      console.log('⚠️ Não foi possível listar agentes (pode ser que o Flowise não esteja acessível)');
    }

    // 5. Testar um agente (se tivermos agentes criados)
    if (techSupportAgent.flowiseResponse) {
      console.log('5️⃣ Testando agente de suporte técnico...');
      try {
        const testResult = await integration.testAgent(
          techSupportAgent.flowiseResponse.id,
          "Olá! Meu computador está lento, o que você sugere?"
        );
        console.log('✅ Teste realizado com sucesso!');
        console.log(`💬 Resposta: ${testResult.text.substring(0, 100)}...`);
      } catch (testError) {
        console.log('⚠️ Não foi possível testar o agente (pode precisar de configuração adicional)');
      }
    }

    console.log('\n🎉 Demonstração concluída com sucesso!');
    console.log('\n📋 Resumo:');
    console.log('- ✅ Agentes criados no formato ZanAI');
    console.log('- ✅ Convertidos para o formato Flowise');
    console.log('- ✅ Enviados para o Flowise (se disponível)');
    console.log('- ✅ Arquivos JSON salvos localmente');
    console.log('\n📁 Arquivos gerados:');
    console.log('- tech-support-agent.json');
    console.log('- sales-agent.json');
    console.log('- research-agent.json');
    console.log('\n🌐 Para acessar os agentes no Flowise:');
    console.log(`1. Abra ${config.flowiseUrl}`);
    console.log('2. Faça login na sua conta');
    console.log('3. Os agentes estarão disponíveis na lista de chatflows');

  } catch (error) {
    console.error('❌ Erro durante a demonstração:', error);
    
    // Mesmo com erro, tenta criar os agentes localmente
    console.log('\n🔄 Tentando criar agentes localmente...');
    try {
      const localIntegration = new ZanAIFlowiseIntegration('');
      
      const localAgents = [
        await localIntegration.createTechSupportAgent(),
        await localIntegration.createSalesAgent(),
        await localIntegration.createResearchAgent()
      ];
      
      console.log('✅ Agentes criados localmente com sucesso!');
      console.log('📁 Verifique os arquivos JSON gerados:');
      localAgents.forEach(agent => {
        if (agent.filePath) {
          console.log(`- ${agent.filePath}`);
        }
      });
      
      console.log('\n💡 Para usar estes agentes no Flowise:');
      console.log('1. Importe os arquivos JSON manualmente no Flowise');
      console.log('2. Configure as credenciais das ferramentas');
      console.log('3. Faça o deploy dos agentes');
      
    } catch (localError) {
      console.error('❌ Falha ao criar agentes localmente:', localError);
    }
  }
}

// Função para mostrar como usar a biblioteca
function showUsageExample() {
  console.log('📖 Exemplo de Uso da Biblioteca\n');
  
  console.log('// 1. Importar a biblioteca');
  console.log('const { ZanAIFlowiseIntegration } = require(\'./zanai-flowise-integration\');');
  console.log('');
  
  console.log('// 2. Criar instância');
  console.log('const integration = new ZanAIFlowiseIntegration(');
  console.log('  \'http://localhost:3000\',');
  console.log('  \'sua-api-key\'');
  console.log(');');
  console.log('');
  
  console.log('// 3. Criar um agente simples');
  console.log('const agent = await integration.createAndSendAgent({');
  console.log('  name: "Meu Agente",');
  console.log('  description: "Descrição do agente",');
  console.log('  systemMessage: "Você é um assistente útil",');
  console.log('  modelName: "gpt-4-turbo-preview",');
  console.log('  temperature: 0.7,');
  console.log('  tools: [');
  console.log('    {');
  console.log('      type: "calculator",');
  console.log('      name: "Calculadora",');
  console.log('      config: {}');
  console.log('    }');
  console.log('  ],');
  console.log('  saveToFile: true');
  console.log('});');
  console.log('');
  
  console.log('// 4. Listar agentes');
  console.log('const agents = await integration.listAgents();');
  console.log('');
  
  console.log('// 5. Testar agente');
  console.log('const response = await integration.testAgent(agentId, "Olá!");');
}

// Executar a demonstração
if (require.main === module) {
  // Mostrar exemplo de uso
  showUsageExample();
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Executar demonstração
  main().catch(console.error);
}

module.exports = { main, showUsageExample };