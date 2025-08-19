const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./db/custom.db'
    }
  }
});

async function checkDatabase() {
  try {
    console.log('🔍 Verificando tabelas existentes no banco de dados...');
    
    // Tabelas esperadas conforme schema.prisma
    const expectedTables = [
      'users', 'Post', 'Workspace', 'Agent', 'Composition', 'Learning',
      'AgentExecution', 'Execution', 'agent_metrics', 'companies', 'clients',
      'projects', 'contracts', 'tasks', 'reports', 'audit_logs',
      'MCPServer', 'MCPTool', 'MCPConnection', 'user_passwords'
    ];
    
    console.log('\n📋 Tabelas esperadas:', expectedTables.length);
    console.log('=====================================');
    
    // Verificar quais tabelas existem
    const existingTables = [];
    
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
    
    console.log('\n📊 Resumo:');
    console.log('=====================================');
    console.log(`Tabelas existentes: ${existingTables.length}/${expectedTables.length}`);
    
    if (existingTables.length === expectedTables.length) {
      console.log('✅ Todas as tabelas esperadas estão presentes!');
    } else {
      const missingTables = expectedTables.filter(table => !existingTables.includes(table));
      console.log('❌ Tabelas faltantes:', missingTables);
    }
    
    // Verificar dados em cada tabela existente
    console.log('\n📈 Verificando dados nas tabelas existentes...');
    console.log('=====================================');
    
    for (const table of existingTables) {
      try {
        const result = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${table}"`);
        const rowCount = result[0].count;
        console.log(`${table}: ${rowCount} registros`);
      } catch (error) {
        console.log(`${table}: ERRO AO CONTAR REGISTROS - ${error.message}`);
      }
    }
    
    return {
      expectedTables,
      existingTables,
      missingTables: expectedTables.filter(table => !existingTables.includes(table))
    };
    
  } catch (error) {
    console.error('❌ Erro ao verificar banco de dados:', error.message);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();