# Exemplo de Configuração de Agentes no Flowise

Este documento mostra exemplos práticos de como configurar diferentes tipos de agentes no Flowise para integração com nossa aplicação.

## 🏗️ Estrutura Básica de um AgentFlow

Um AgentFlow no Flowise consiste em:

1. **Supervisor**: Coordena a execução e toma decisões
2. **Workers**: Executam tarefas específicas
3. **Tools**: Ferramentas disponíveis para os agentes
4. **LLM**: Modelo de linguagem para raciocínio

## 🎯 Exemplo 1: Agente de Vendas

### Configuração do Flow

```json
{
  "name": "Agente de Vendas IA",
  "type": "agentflow",
  "nodes": [
    {
      "id": "supervisor",
      "type": "Agent",
      "position": {"x": 400, "y": 50},
      "data": {
        "title": "Supervisor de Vendas",
        "systemMessage": "Você é um supervisor de vendas experiente. Sua função é coordenar a equipe de vendas, qualificar leads e definir estratégias.",
        "llmModel": "gpt-4",
        "temperature": 0.7
      }
    },
    {
      "id": "lead-qualifier",
      "type": "Agent",
      "position": {"x": 200, "y": 200},
      "data": {
        "title": "Qualificador de Leads",
        "systemMessage": "Você é especialista em qualificação de leads. Analise as informações fornecidas e determine se o lead é qualificado, qual seu potencial e próximos passos.",
        "llmModel": "gpt-3.5-turbo",
        "temperature": 0.5
      }
    },
    {
      "id": "proposal-generator",
      "type": "Agent",
      "position": {"x": 600, "y": 200},
      "data": {
        "title": "Gerador de Propostas",
        "systemMessage": "Você é especialista em criar propostas comerciais. Com base nas necessidades do cliente, gere propostas detalhadas e persuasivas.",
        "llmModel": "gpt-4",
        "temperature": 0.6
      }
    },
    {
      "id": "follow-up-agent",
      "type": "Agent",
      "position": {"x": 400, "y": 350},
      "data": {
        "title": "Agente de Follow-up",
        "systemMessage": "Você é responsável pelo follow-up de clientes. Crie estratégias de acompanhamento personalizadas e mantenha o engajamento.",
        "llmModel": "gpt-3.5-turbo",
        "temperature": 0.7
      }
    }
  ],
  "edges": [
    {"id": "e1", "source": "supervisor", "target": "lead-qualifier"},
    {"id": "e2", "source": "supervisor", "target": "proposal-generator"},
    {"id": "e3", "source": "supervisor", "target": "follow-up-agent"}
  ]
}
```

### Ferramentas Recomendadas

1. **Web Search Tool**: Para pesquisar informações sobre empresas
2. **Calculator Tool**: Para cálculos de ROI e métricas
3. **Email Tool**: Para enviar propostas e follow-ups
4. **Calendar Tool**: Para agendar reuniões

## 🎯 Exemplo 2: Agente de Suporte

### Configuração do Flow

```json
{
  "name": "Agente de Suporte IA",
  "type": "agentflow",
  "nodes": [
    {
      "id": "support-supervisor",
      "type": "Agent",
      "position": {"x": 400, "y": 50},
      "data": {
        "title": "Supervisor de Suporte",
        "systemMessage": "Você é o supervisor do suporte técnico. Sua função é analisar os problemas, determinar a complexidade e direcionar para o agente adequado.",
        "llmModel": "gpt-4",
        "temperature": 0.5
      }
    },
    {
      "id": "tier1-agent",
      "type": "Agent",
      "position": {"x": 200, "y": 200},
      "data": {
        "title": "Suporte Nível 1",
        "systemMessage": "Você é agente de suporte nível 1. Resolva problemas comuns e básicos. Se o problema for complexo, escalone para o nível 2.",
        "llmModel": "gpt-3.5-turbo",
        "temperature": 0.3
      }
    },
    {
      "id": "tier2-agent",
      "type": "Agent",
      "position": {"x": 600, "y": 200},
      "data": {
        "title": "Suporte Nível 2",
        "systemMessage": "Você é agente de suporte nível 2. Resolva problemas técnicos complexos que requerem conhecimento especializado.",
        "llmModel": "gpt-4",
        "temperature": 0.4
      }
    },
    {
      "id": "knowledge-base",
      "type": "RetrieverTool",
      "position": {"x": 400, "y": 350},
      "data": {
        "title": "Base de Conhecimento",
        "description": "Acessa a base de conhecimento para encontrar soluções"
      }
    }
  ],
  "edges": [
    {"id": "e1", "source": "support-supervisor", "target": "tier1-agent"},
    {"id": "e2", "source": "support-supervisor", "target": "tier2-agent"},
    {"id": "e3", "source": "support-supervisor", "target": "knowledge-base"}
  ]
}
```

### Ferramentas Recomendadas

1. **Knowledge Base Tool**: Para acessar documentação e FAQs
2. **System Status Tool**: Para verificar status de sistemas
3. **Ticket Creation Tool**: Para criar tickets de suporte
4. **Escalation Tool**: Para escalar problemas complexos

## 🎯 Exemplo 3: Agente de Marketing

### Configuração do Flow

```json
{
  "name": "Agente de Marketing IA",
  "type": "agentflow",
  "nodes": [
    {
      "id": "marketing-supervisor",
      "type": "Agent",
      "position": {"x": 400, "y": 50},
      "data": {
        "title": "Supervisor de Marketing",
        "systemMessage": "Você é o supervisor de marketing digital. Coordene campanhas, analise resultados e otimize estratégias.",
        "llmModel": "gpt-4",
        "temperature": 0.8
      }
    },
    {
      "id": "content-creator",
      "type": "Agent",
      "position": {"x": 200, "y": 200},
      "data": {
        "title": "Criador de Conteúdo",
        "systemMessage": "Você é especialista em criação de conteúdo. Crie textos persuasivos, posts para redes sociais e materiais de marketing.",
        "llmModel": "gpt-4",
        "temperature": 0.9
      }
    },
    {
      "id": "analyst-agent",
      "type": "Agent",
      "position": {"x": 600, "y": 200},
      "data": {
        "title": "Analista de Marketing",
        "systemMessage": "Você é analista de marketing. Analise dados, identifique tendências e gere insights acionáveis.",
        "llmModel": "gpt-4",
        "temperature": 0.4
      }
    },
    {
      "id": "lead-generator",
      "type": "Agent",
      "position": {"x": 400, "y": 350},
      "data": {
        "title": "Gerador de Leads",
        "systemMessage": "Você é especialista em geração de leads. Crie estratégias para atrair e qualificar leads potenciais.",
        "llmModel": "gpt-3.5-turbo",
        "temperature": 0.7
      }
    }
  ],
  "edges": [
    {"id": "e1", "source": "marketing-supervisor", "target": "content-creator"},
    {"id": "e2", "source": "marketing-supervisor", "target": "analyst-agent"},
    {"id": "e3", "source": "marketing-supervisor", "target": "lead-generator"}
  ]
}
```

### Ferramentas Recomendadas

1. **Web Search Tool**: Para pesquisar tendências de mercado
2. **Social Media Tool**: Para postar em redes sociais
3. **Analytics Tool**: Para analisar métricas de marketing
4. **Email Marketing Tool**: Para criar campanhas de email

## 🔧 Configuração de Ferramentas

### Exemplo: Web Search Tool

```json
{
  "id": "web-search",
  "type": "WebSearch",
  "data": {
    "title": "Pesquisa Web",
    "description": "Faz pesquisas na web para obter informações atualizadas",
    "searchEngine": "google",
    "maxResults": 5
  }
}
```

### Exemplo: Calculator Tool

```json
{
  "id": "calculator",
  "type": "Calculator",
  "data": {
    "title": "Calculadora",
    "description": "Realiza cálculos matemáticos e financeiros"
  }
}
```

### Exemplo: Email Tool

```json
{
  "id": "email-sender",
  "type": "Email",
  "data": {
    "title": "Envio de Email",
    "description": "Envia emails personalizados",
    "smtpHost": "smtp.gmail.com",
    "smtpPort": 587,
    "smtpUser": "seu_email@gmail.com",
    "smtpPass": "sua_senha"
  }
}
```

## 🚀 Passos para Criar um AgentFlow

### 1. Acesse o Flowise
- Abra `http://localhost:3001` no navegador
- Faça login com suas credenciais

### 2. Crie um Novo AgentFlow
- Clique em "Create New"
- Selecione "AgentFlow"
- Dê um nome ao seu flow

### 3. Configure o Supervisor
- Arraste o nó "Agent" para a tela
- Configure o system message
- Selecione o modelo LLM
- Ajuste a temperatura

### 4. Adicione Workers
- Arraste mais nós "Agent" para a tela
- Configure cada um com sua função específica
- Conecte-os ao supervisor

### 5. Adicione Ferramentas
- Arraste as ferramentas necessárias
- Configure cada ferramenta com seus parâmetros
- Conecte-as aos agentes adequados

### 6. Teste o Flow
- Use a interface de teste
- Verifique se as respostas são adequadas
- Ajuste os parâmetros se necessário

### 7. Publique o Flow
- Clique em "Save"
- Copie o ID do flow
- Adicione o ID ao `.env.local`

## 📝 Melhores Práticas

### 1. System Messages
- Seja claro e específico sobre o papel do agente
- Defina limites e responsabilidades
- Inclua exemplos de comportamento esperado

### 2. Temperatura
- **0.1-0.3**: Para tarefas factuais e precisas
- **0.4-0.6**: Para tarefas criativas moderadas
- **0.7-0.9**: Para tarefas muito criativas

### 3. Modelos LLM
- **GPT-3.5-turbo**: Para tarefas simples e rápidas
- **GPT-4**: Para tarefas complexas que exigem raciocínio
- **GPT-4-turbo**: Para balance entre custo e performance

### 4. Estrutura de Agentes
- Mantenha os agentes focados em tarefas específicas
- Use o supervisor para coordenação
- Limite o número de agentes para evitar complexidade

## 🔍 Debug e Troubleshooting

### Problemas Comuns

1. **Respostas Genéricas**:
   - Ajuste o system message
   - Reduza a temperatura
   - Adicione mais contexto

2. **Agentes Não Cooperam**:
   - Verifique as conexões entre nós
   - Ajuste as instruções do supervisor
   - Teste cada agente individualmente

3. **Ferramentas Não Funcionam**:
   - Verifique a configuração das ferramentas
   - Teste as credenciais
   - Verifique os logs de erro

### Logs e Monitoramento

- Use os logs do Flowise para identificar problemas
- Monitore o tempo de resposta
- Acompanhe a qualidade das respostas

---

**Estes exemplos mostram como configurar agentes de IA eficazes no Flowise para diferentes áreas de negócio.**