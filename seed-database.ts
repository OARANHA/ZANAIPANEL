import { db } from './src/lib/db';

async function seedDatabase() {
  try {
    // Criar usuário inicial
    const user = await db.user.create({
      data: {
        email: 'default-user@example.com',
        name: 'Default User'
      }
    });

    console.log('Usuário criado:', user);

    // Criar workspace inicial
    const workspace = await db.workspace.create({
      data: {
        name: 'Workspace Inicial',
        description: 'Workspace padrão para demonstração do sistema Zanai',
        config: JSON.stringify({
          version: '1.0.0',
          settings: {
            autoSave: true,
            maxAgents: 10,
            enableLearning: true
          }
        }),
        userId: user.id
      }
    });

    console.log('Workspace criado:', workspace);

    // Criar agentes iniciais
    const agents = [
      {
        name: 'Assistente de Documentação',
        description: 'Agente especializado em criar e gerenciar documentação técnica',
        type: 'template',
        config: `
name: Documentation Assistant
version: 1.0.0
description: Specialized agent for technical documentation
capabilities:
  - generate_documentation
  - format_markdown
  - create_examples
  - review_content
settings:
  language: pt-BR
  style: technical
  format: markdown
`,
        knowledge: `# Assistente de Documentação

## Especialidades
- Criação de documentação técnica
- Formatação em Markdown
- Geração de exemplos
- Revisão de conteúdo

## Diretrizes
- Usar linguagem clara e objetiva
- Seguir padrões de documentação
- Incluir exemplos práticos
- Manter consistência no estilo
`,
        workspaceId: workspace.id
      },
      {
        name: 'Analisador de Código',
        description: 'Agente para análise e otimização de código',
        type: 'template',
        config: `
name: Code Analyzer
version: 1.0.0
description: Agent for code analysis and optimization
capabilities:
  - analyze_code
  - suggest_optimizations
  - detect_bugs
  - generate_tests
settings:
  languages: [javascript, typescript, python, java]
  complexity_threshold: 10
  security_checks: true
`,
        knowledge: `# Analisador de Código

## Funcionalidades
- Análise estática de código
- Sugestões de otimização
- Detecção de bugs
- Geração de testes

## Padrões
- Seguir convenções de codificação
- Identificar code smells
- Sugerir refatorações
- Garantir segurança do código
`,
        workspaceId: workspace.id
      },
      {
        name: 'Gerador de API',
        description: 'Agente para criação e documentação de APIs',
        type: 'template',
        config: `
name: API Generator
version: 1.0.0
description: Agent for API creation and documentation
capabilities:
  - design_apis
  - generate_endpoints
  - create_documentation
  - validate_schemas
settings:
  frameworks: [express, fastify, nextjs]
  documentation: openapi
  validation: true
`,
        knowledge: `# Gerador de API

## Especializações
- Design de APIs RESTful
- Geração de endpoints
- Documentação OpenAPI
- Validação de schemas

## Melhores Práticas
- Usar métodos HTTP corretos
- Implementar versionamento
- Documentar todos os endpoints
- Validar dados de entrada
`,
        workspaceId: workspace.id
      }
    ];

    for (const agentData of agents) {
      const agent = await db.agent.create({
        data: agentData
      });
      console.log('Agente criado:', agent.name);
    }

    console.log('Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
  } finally {
    await db.$disconnect();
  }
}

seedDatabase();