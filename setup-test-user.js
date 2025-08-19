/**
 * Script para verificar e criar usuário de teste
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

async function main() {
  console.log(colors.cyan + colors.bright + '🔍 VERIFICANDO E CRIANDO USUÁRIO DE TESTE' + colors.reset);
  console.log(colors.blue + '=============================================' + colors.reset + '\n');

  try {
    // Verificar usuários existentes
    const users = await prisma.user.findMany();
    console.log(colors.yellow + `📋 Encontrados ${users.length} usuários no banco de dados:` + colors.reset);
    
    users.forEach((user, index) => {
      console.log(colors.blue + `   ${index + 1}. ID: ${user.id}, Email: ${user.email}, Nome: ${user.name || 'N/A'}, Role: ${user.role}` + colors.reset);
    });

    // Se não houver usuários, criar um usuário de teste
    if (users.length === 0) {
      console.log(colors.yellow + '\n📋 Criando usuário de teste...' + colors.reset);
      
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          role: 'SUPER_ADMIN'
        }
      });

      console.log(colors.green + `✅ Usuário de teste criado com sucesso!` + colors.reset);
      console.log(colors.blue + `   ID: ${testUser.id}` + colors.reset);
      console.log(colors.blue + `   Email: ${testUser.email}` + colors.reset);
      console.log(colors.blue + `   Nome: ${testUser.name}` + colors.reset);
      console.log(colors.blue + `   Role: ${testUser.role}` + colors.reset);
    }

    // Criar workspace para o primeiro usuário (ou usuário de teste)
    const firstUser = users.length > 0 ? users[0] : await prisma.user.findFirst();
    
    if (firstUser) {
      const existingWorkspace = await prisma.workspace.findFirst({
        where: { userId: firstUser.id }
      });

      if (!existingWorkspace) {
        console.log(colors.yellow + `\n📋 Criando workspace para o usuário ${firstUser.email}...` + colors.reset);
        
        const workspace = await prisma.workspace.create({
          data: {
            name: `${firstUser.name || firstUser.email}'s Workspace`,
            description: 'Default workspace for testing',
            config: '{}',
            userId: firstUser.id
          }
        });

        console.log(colors.green + `✅ Workspace criado com sucesso!` + colors.reset);
        console.log(colors.blue + `   ID: ${workspace.id}` + colors.reset);
        console.log(colors.blue + `   Nome: ${workspace.name}` + colors.reset);
        console.log(colors.blue + `   User ID: ${workspace.userId}` + colors.reset);
      } else {
        console.log(colors.green + `\n✅ Workspace já existe para o usuário ${firstUser.email}` + colors.reset);
        console.log(colors.blue + `   Workspace ID: ${existingWorkspace.id}` + colors.reset);
      }
    }

    console.log(colors.magenta + colors.bright + '\n📊 RESUMO FINAL' + colors.reset);
    console.log(colors.magenta + '===============' + colors.reset);
    console.log(colors.green + '✅ Banco de dados verificado e configurado!' + colors.reset);
    console.log(colors.yellow + 'Agora você pode testar a criação de agentes com os seguintes dados:' + colors.reset);
    
    const finalUser = users.length > 0 ? users[0] : await prisma.user.findFirst();
    if (finalUser) {
      console.log(colors.blue + `   User ID: ${finalUser.id}` + colors.reset);
      console.log(colors.blue + `   Email: ${finalUser.email}` + colors.reset);
      console.log(colors.blue + `   Role: ${finalUser.role}` + colors.reset);
    }

  } catch (error) {
    console.error(colors.red + colors.bright + '\n💥 ERRO!' + colors.reset);
    console.error(colors.red + `Erro: ${error.message}` + colors.reset);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);