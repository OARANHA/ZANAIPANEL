import { NextRequest, NextResponse } from 'next/server';
import { createFlowiseClient, defaultFlowiseConfig } from '@/lib/flowise-client';

export async function GET() {
  try {
    console.log('Checking Flowise integration status...');
    
    // Verificar configuração
    const config = {
      ...defaultFlowiseConfig,
      baseUrl: process.env.FLOWISE_BASE_URL || defaultFlowiseConfig.baseUrl,
      apiKey: process.env.FLOWISE_API_KEY || defaultFlowiseConfig.apiKey
    };

    console.log('Flowise config:', {
      baseUrl: config.baseUrl,
      hasApiKey: !!config.apiKey,
      timeout: config.timeout
    });

    // Criar cliente Flowise
    const flowiseClient = createFlowiseClient(config);

    // Testar conexão básica
    const isConnected = await flowiseClient.testConnection();
    console.log('Flowise connection test:', isConnected);

    if (!isConnected) {
      return NextResponse.json({
        status: 'error',
        message: 'Não foi possível conectar ao Flowise',
        details: {
          config: {
            baseUrl: config.baseUrl,
            hasApiKey: !!config.apiKey
          },
          error: 'Connection failed'
        }
      }, { status: 503 });
    }

    // Obter informações de saúde
    let healthInfo;
    try {
      healthInfo = await flowiseClient.getHealth();
      console.log('Flowise health info:', healthInfo);
    } catch (error) {
      console.warn('Could not get health info:', error);
      healthInfo = null;
    }

    // Obter estatísticas básicas
    let workflowsCount = 0;
    let toolsCount = 0;
    let credentialsCount = 0;

    try {
      const { data: workflows } = await flowiseClient.getChatflows({ limit: 1 });
      workflowsCount = workflows.length;
    } catch (error) {
      console.warn('Could not get workflows count:', error);
    }

    try {
      const tools = await flowiseClient.getTools();
      toolsCount = tools.length;
    } catch (error) {
      console.warn('Could not get tools count:', error);
    }

    try {
      const credentials = await flowiseClient.getCredentials();
      credentialsCount = credentials.length;
    } catch (error) {
      console.warn('Could not get credentials count:', error);
    }

    // Verificar configuração ZAI
    const zaiConfig = {
      hasApiKey: !!process.env.ZAI_API_KEY,
      hasBaseUrl: !!process.env.ZAI_BASE_URL,
      apiKeyLength: process.env.ZAI_API_KEY ? process.env.ZAI_API_KEY.length : 0
    };

    console.log('ZAI config:', zaiConfig);

    // Retornar status completo
    return NextResponse.json({
      status: 'healthy',
      message: 'Integração Flowise está funcionando corretamente',
      timestamp: new Date().toISOString(),
      details: {
        flowise: {
          connected: isConnected,
          health: healthInfo,
          stats: {
            workflows: workflowsCount,
            tools: toolsCount,
            credentials: credentialsCount
          },
          config: {
            baseUrl: config.baseUrl,
            hasApiKey: !!config.apiKey,
            timeout: config.timeout,
            retryAttempts: config.retryAttempts
          }
        },
        zanai: {
          configured: zaiConfig.hasApiKey && zaiConfig.hasBaseUrl,
          config: zaiConfig
        }
      },
      capabilities: [
        'workflow_generation',
        'workflow_conversion',
        'workflow_execution',
        'real_time_sync'
      ]
    });

  } catch (error) {
    console.error('Erro ao verificar status do Flowise:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Erro ao verificar status da integração Flowise',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}