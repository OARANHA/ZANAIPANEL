/**
 * Exemplo de Integração UI ZanAI + Flowise
 * Componente React para criar agentes no ZanAI e enviá-los para o Flowise
 */

import React, { useState } from 'react';
import { ZanAIFlowiseIntegration } from './zanai-flowise-integration';

interface AgentConfig {
  name: string;
  description: string;
  systemMessage: string;
  modelName: string;
  temperature: number;
  tools: Array<{
    type: string;
    name: string;
    config?: Record<string, any>;
  }>;
}

interface ToolOption {
  value: string;
  label: string;
  description: string;
  requiresConfig: boolean;
}

const ZanAIFlowiseUI: React.FC = () => {
  const [flowiseUrl, setFlowiseUrl] = useState('http://localhost:3000');
  const [apiKey, setApiKey] = useState('');
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
    description: '',
    systemMessage: '',
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7,
    tools: []
  });
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const toolOptions: ToolOption[] = [
    { value: 'calculator', label: 'Calculadora', description: 'Realiza cálculos matemáticos', requiresConfig: false },
    { value: 'serp', label: 'Busca Web', description: 'Busca informações na web', requiresConfig: true },
    { value: 'web_browser', label: 'Navegador Web', description: 'Navega por páginas web', requiresConfig: false },
    { value: 'arxiv', label: 'Busca Acadêmica', description: 'Busca artigos acadêmicos', requiresConfig: false },
    { value: 'wolfram_alpha', label: 'Wolfram Alpha', description: 'Motor de conhecimento computacional', requiresConfig: true },
    { value: 'gmail', label: 'Gmail', description: 'Gerencia emails', requiresConfig: true },
    { value: 'google_calendar', label: 'Google Calendar', description: 'Gerencia calendário', requiresConfig: true },
    { value: 'google_sheets', label: 'Google Sheets', description: 'Gerencia planilhas', requiresConfig: true },
    { value: 'jira', label: 'Jira', description: 'Gerencia tickets Jira', requiresConfig: true },
    { value: 'slack', label: 'Slack', description: 'Envia mensagens Slack', requiresConfig: true }
  ];

  const agentTemplates = [
    {
      name: 'Agente de Suporte Técnico',
      description: 'Assistente especializado em suporte técnico',
      systemMessage: 'Você é um agente de suporte técnico especializado. Ajude os usuários a resolver problemas técnicos de forma clara e eficiente.',
      tools: ['calculator', 'serp']
    },
    {
      name: 'Agente de Vendas',
      description: 'Assistente especializado em vendas',
      systemMessage: 'Você é um agente de vendas profissional. Ajude os clientes a encontrar os melhores produtos e serviços.',
      tools: ['calculator', 'serp']
    },
    {
      name: 'Agente de Pesquisa',
      description: 'Assistente especializado em pesquisa acadêmica',
      systemMessage: 'Você é um agente de pesquisa acadêmica. Busque informações precisas e atualizadas.',
      tools: ['serp', 'arxiv', 'calculator']
    },
    {
      name: 'Agente de Produtividade',
      description: 'Assistente para gestão de produtividade',
      systemMessage: 'Você é um agente de produtividade. Ajude os usuários a organizar tarefas e gerenciar tempo.',
      tools: ['google_calendar', 'gmail', 'google_sheets']
    }
  ];

  const handleTemplateSelect = (template: any) => {
    setAgentConfig({
      ...agentConfig,
      name: template.name,
      description: template.description,
      systemMessage: template.systemMessage
    });
    setSelectedTools(template.tools);
  };

  const handleToolToggle = (toolValue: string) => {
    setSelectedTools(prev => 
      prev.includes(toolValue) 
        ? prev.filter(t => t !== toolValue)
        : [...prev, toolValue]
    );
  };

  const handleCreateAgent = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const integration = new ZanAIFlowiseIntegration(flowiseUrl, apiKey);
      
      const tools = selectedTools.map(toolType => {
        const toolOption = toolOptions.find(t => t.value === toolType);
        return {
          type: toolType,
          name: toolOption?.label || toolType,
          config: toolOption?.requiresConfig ? {} : {}
        };
      });

      const response = await integration.createAndSendAgent({
        name: agentConfig.name,
        description: agentConfig.description,
        systemMessage: agentConfig.systemMessage,
        modelName: agentConfig.modelName,
        temperature: agentConfig.temperature,
        tools,
        saveToFile: true
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ZanAI + Flowise Integration
        </h1>
        <p className="text-gray-600">
          Crie agentes no ZanAI e envie-os diretamente para o Flowise
        </p>
      </div>

      {/* Configuração do Flowise */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Configuração do Flowise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL do Flowise
            </label>
            <input
              type="text"
              value={flowiseUrl}
              onChange={(e) => setFlowiseUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="http://localhost:3000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key (opcional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sua API key"
            />
          </div>
        </div>
      </div>

      {/* Templates de Agentes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Templates de Agentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agentTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => handleTemplateSelect(template)}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <h3 className="font-medium text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              <div className="mt-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {template.tools.length} ferramentas
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Configuração do Agente */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Configuração do Agente</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Agente
            </label>
            <input
              type="text"
              value={agentConfig.name}
              onChange={(e) => setAgentConfig({...agentConfig, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do agente"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={agentConfig.description}
              onChange={(e) => setAgentConfig({...agentConfig, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Descrição do agente"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem de Sistema
            </label>
            <textarea
              value={agentConfig.systemMessage}
              onChange={(e) => setAgentConfig({...agentConfig, systemMessage: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Instruções para o agente"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo
              </label>
              <select
                value={agentConfig.modelName}
                onChange={(e) => setAgentConfig({...agentConfig, modelName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperatura: {agentConfig.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={agentConfig.temperature}
                onChange={(e) => setAgentConfig({...agentConfig, temperature: parseFloat(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Seleção de Ferramentas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ferramentas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolOptions.map((tool) => (
            <div key={tool.value} className="flex items-start space-x-3">
              <input
                type="checkbox"
                id={tool.value}
                checked={selectedTools.includes(tool.value)}
                onChange={() => handleToolToggle(tool.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor={tool.value} className="font-medium text-gray-900 cursor-pointer">
                  {tool.label}
                </label>
                <p className="text-sm text-gray-600">{tool.description}</p>
                {tool.requiresConfig && selectedTools.includes(tool.value) && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Configuração necessária"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão de Criação */}
      <div className="text-center">
        <button
          onClick={handleCreateAgent}
          disabled={isLoading || !agentConfig.name || !agentConfig.systemMessage}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Criando Agente...' : 'Criar e Enviar para Flowise'}
        </button>
      </div>

      {/* Resultados */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Agente Criado com Sucesso!</h3>
          <div className="space-y-2">
            <p><strong>Nome:</strong> {result.agent.name}</p>
            <p><strong>Descrição:</strong> {result.agent.description}</p>
            {result.flowiseResponse && (
              <>
                <p><strong>ID no Flowise:</strong> {result.flowiseResponse.id}</p>
                <p><strong>Status:</strong> {result.flowiseResponse.deployed ? 'Deployado' : 'Não deployado'}</p>
              </>
            )}
            {result.filePath && (
              <p><strong>Arquivo Salvo:</strong> {result.filePath}</p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Erro</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ZanAIFlowiseUI;