const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./db/custom.db'
    }
  }
});

async function analyzeDatabase() {
  try {
    console.log('🔍 Analisando o banco de dados para identificar tabelas faltantes...');
    
    // 1. Listar todas as tabelas definidas no schema
    const expectedTables = [
      'users', 'Post', 'Workspace', 'Agent', 'Composition', 'Learning',
      'AgentExecution', 'Execution', 'agent_metrics', 'companies', 'clients',
      'projects', 'contracts', 'tasks', 'reports', 'audit_logs',
      'MCPServer', 'MCPTool', 'MCPConnection', 'user_passwords'
    ];
    
    console.log('\n📋 Tabelas esperadas:', expectedTables.join(', '));
    
    // 2. Verificar quais tabelas existem
    const existingTables = [];
    
    // Verificar cada tabela esperada
    for (const table of expectedTables) {
      try {
        const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name=${table}`;
        if (result && result.length > 0) {
          existingTables.push(table);
          console.log(`✅ ${table}`);
        } else {
          console.log(`❌ ${table} (NÃO ENCONTRADA)`);
        }
      } catch (error) {
        console.log(`❌ ${table} (ERRO AO VERIFICAR)`);
      }
    }
    
    // 3. Identificar tabelas faltantes
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));
    
    // 4. Exibir resultados
    console.log('\n📊 Resumo da análise:');
    console.log('=====================================');
    console.log(`Tabelas esperadas: ${expectedTables.length}`);
    console.log(`Tabelas existentes: ${existingTables.length}`);
    console.log(`Tabelas faltantes: ${missingTables.length}`);
    
    if (missingTables.length > 0) {
      console.log('\n❌ Tabelas faltantes:');
      for (const table of missingTables) {
        console.log(`   ❌ ${table}`);
      }
    }
    
    // 5. Verificar se há dados em cada tabela
    console.log('\n📈 Verificando dados nas tabelas existentes...');
    console.log('=====================================');
    
    for (const table of existingTables) {
      try {
        const count = await prisma.$queryRaw`SELECT COUNT(*) as count FROM ${table}`;
        const rowCount = count[0].count;
        console.log(`${table}: ${rowCount} registros`);
        
        // Se for uma tabela de usuários, verificar a contagem de usuários
        if (table === 'users') {
          const userCount = await prisma.user.count();
          console.log(`   📊 Usuários: ${userCount}`);
        }
        
        // Se for uma tabela de agentes, verificar a contagem de agentes
        if (table === 'agents') {
          const agentCount = await prisma.agent.count();
          console.log(`   🤖 Agentes: ${agentCount}`);
        }
        
        // Se for uma tabela de workspaces, verificar a contagem de workspaces
        if (table === 'workspaces') {
          const workspaceCount = await prisma.workspace.count();
          console.log(`   🏗 Workspaces: ${workspaceCount}`);
        }
        
        // Se for uma tabela de composições, verificar a contagem de composições
        if (table === 'compositions') {
          const compositionCount = await prisma.composition.count();
          console.log(`   📝 Composições: ${compositionCount}`);
        }
        
        // Se for uma tabela de learning, verificar a contagem de aprendizados
        if (table === 'learning') {
          const learningCount = await prisma.learning.count();
          console.log(`   🎓 Learning: ${learningCount}`);
        }
        
        // Se for uma tabela de execuções, verificar a contagem de execuções
        if (table === 'agent_execution') {
          const executionCount = await prisma.agentExecution.count();
          console.log(`   ⚡ Execuções: ${executionCount}`);
        }
        
        // Se for uma tabela de execution, verificar a contagem de execuções
        if (table === 'execution') {
          const executionCount = await prisma.execution.count();
          console.log(`   ⚡ Execuções: ${executionCount}`);
        }
        
        // Se for uma tabela de agent_metrics, verificar a contagem de métricas
        if (table === 'agent_metrics') {
          const metricsCount = await prisma.agentMetrics.count();
          console.log(`   📊 Métricas: ${metricsCount}`);
        }
        
        // Se for uma tabela de empresas, verificar a contagem de empresas
        if (table === 'companies') {
          const companyCount = await prisma.company.count();
          console.log(`   🏢 Empresas: ${companyCount}`);
        }
        
        // Se for uma tabela de clientes, verificar a contagem de clientes
        if (table === 'clients') {
          const clientCount = await prisma.client.count();
          console.log(`   👤 Clientes: ${clientCount}`);
        }
        
        // Se for uma tabela de projetos, verificar a contagem de projetos
        if (table === 'projects') {
          const projectCount = await prisma.project.count();
          console.log(`   📁 Projetos: ${projectCount}`);
        }
        
        // Se for uma tabela de contratos, verificar a contagem de contratos
        if (table === 'contracts') {
          const contractCount = await prisma.contract.count();
          console.log(`   📜 Contratos: ${contractCount}`);
        }
        
        // Se for uma tabela de tarefas, verificar a contagem de tarefas
        if (table === 'tasks') {
          const taskCount = await prisma.task.count();
          console.log(`   ✅ Tarefas: ${taskCount}`);
        }
        
        // Se for uma tabela de relatórios, verificar a contagem de relatórios
        if (table === 'reports') {
          const reportCount = await prisma.report.count();
          console.log(`   📊 Relatórios: ${reportCount}`);
        }
        
        // Se for uma tabela de audit_logs, verificar a contagem de logs de auditoria
        if (table === 'audit_logs') {
          const auditLogCount = await prisma.auditLog.count();
          console.log(`   📋 Audit Logs: ${auditLogCount}`);
        }
        
        // Se for uma tabela de MCPServers, verificar a contagem de servidores MCP
        if (table === 'MCPServers') {
          const mcpServerCount = await prisma.MCPServer.count();
          console.log(`   🔒 MCP Servers: ${mcpServerCount}`);
        }
        
        // Se for uma tabela de MCPTools, verificar a contagem de ferramentas MCP
        if (table === 'MCPTools') {
          const mcpToolCount = await prisma.MCPTool.count();
          console.log(`   🔧 MCP Tools: ${mcpToolCount}`);
        }
        
        // Se for uma tabela de MCPConnections, verificar a contagem de conexões MCP
        if (table === 'MCPConnections') {
          const mcpConnectionCount = await prisma.MCPConnection.count();
          console.log(`   🔗 MCP Connections: ${mcpConnectionCount}`);
        }
        
        // Se for uma tabela de user_passwords, verificar a contagem de senhas
        if (table === 'user_passwords') {
          const userPasswordCount = await prisma.userPassword.count();
          console.log(`   🔐 User Passwords: ${userPasswordCount}`);
        }
        
      } catch (error) {
        console.log(`❌ Erro ao contar registros em ${table}:`, error.message);
      }
    }
    
    // 6. Exibir resultados
    console.log('\n📊 Resumo da análise:');
    console.log('=====================================');
    console.log(`Tabelas esperadas: ${expectedTables.length}`);
    console.log(`Tabelas existentes: ${existingTables.length}`);
    console.log(`Tabelas faltantes: ${missingTables.length}`);
    
    if (missingTables.length > 0) {
      console.log('\n❌ Tabelas faltantes:');
      for (const table of missingTables) {
        console.log(`   ❌ ${table}`);
      }
    }
    
    // 7. Exibir recomendações
    console.log('\n🔧 Recomendações:');
    console.log('=====================================');
    console.log('1. Criar as tabelas faltantes baseadas no schema');
    console.log('2. Verificar se os dados esperados estão presentes');
    console.log('3. Executar um seed completo');
    console.log('4. Verificar a integridade dos dados');
    
    // 8. Salvar os resultados
    console.log('\n💾 Salvando os resultados...');
    
    // Criar um objeto de relatório
    const report = {
      expectedTables,
      existingTables,
      missingTables,
      timestamp: new Date(),
      databaseVersion: 'custom.db',
      analysisComplete: true
    };
    
    // Salvar o relatório em um arquivo JSON
    const reportPath = path.join(process.cwd(), 'database-analysis', `analysis-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Relatório salvo em: ${reportPath}`);
    
    console.log('\n🎉 Análise concluída!');
    console.log('\n💾 Recomendações:');
    console.log('=====================================');
    console.log('1. Executar um seed completo');
    console.log('2. Recriar as tabelas faltantes');
    console.log('3. Verificar a integridade dos dados');
    console.log('4. Verificar se as tabelas estão corretas');
    console.log('5. Verificar se os dados esperados estão presentes');
    
    return report;
    
  } catch (error) {
    console.error('❌ Erro ao analisar o banco de dados:', error.message);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

analyzeDatabase();