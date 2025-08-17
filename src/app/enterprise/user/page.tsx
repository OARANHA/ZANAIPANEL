'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Brain, Activity, Settings, BarChart3, MessageSquare } from 'lucide-react';

export default function EnterpriseUserPage() {
  // Dados mockados do usuário
  const userInfo = {
    name: 'João Silva',
    email: 'joao.silva@mix.com',
    role: 'Funcionário',
    company: 'Mix Corporation',
    department: 'TI',
    joinDate: '2024-01-15',
    totalAgents: 3,
    activeAgents: 2,
    monthlyExecutions: 89,
    successRate: 87
  };

  const userAgents = [
    {
      id: '1',
      name: 'Suporte ao Cliente',
      description: 'Atendimento ao cliente automatizado',
      status: 'active',
      executions: 45,
      successRate: 92
    },
    {
      id: '2',
      name: 'Análise de Dados',
      description: 'Análise de relatórios e métricas',
      status: 'active',
      executions: 32,
      successRate: 85
    },
    {
      id: '3',
      name: 'Geração de Relatórios',
      description: 'Criação de relatórios automáticos',
      status: 'inactive',
      executions: 12,
      successRate: 78
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Meu Espaço
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bem-vindo, {userInfo.name} - {userInfo.department}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">
              {userInfo.role}
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              {userInfo.company}
            </Badge>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Agentes</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userInfo.totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              {userInfo.activeAgents} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execuções/Mês</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userInfo.monthlyExecutions}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userInfo.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Minha performance
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departamento</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userInfo.department}</div>
            <p className="text-xs text-muted-foreground">
              Desde {new Date(userInfo.joinDate).toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Agents */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Meus Agentes</h2>
          <div className="space-y-4">
            {userAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span>{agent.name}</span>
                    </CardTitle>
                    {getStatusBadge(agent.status)}
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Execuções:</span>
                      <span className="ml-2 font-medium">{agent.executions}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Sucesso:</span>
                      <span className="ml-2 font-medium">{agent.successRate}%</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Activity className="w-4 h-4 mr-2" />
                      Executar
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Estatísticas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="space-y-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <span>Chat com Agentes</span>
                </CardTitle>
                <CardDescription>
                  Interaja com seus agentes disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Abrir Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Histórico de Execuções</span>
                </CardTitle>
                <CardDescription>
                  Veja o histórico de suas execuções
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ver Histórico
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <span>Configurações</span>
                </CardTitle>
                <CardDescription>
                  Personalize suas preferências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Configurar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Meu Perfil</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500">Nome</div>
                <div className="text-lg font-semibold">{userInfo.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div className="text-lg font-semibold">{userInfo.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Cargo</div>
                <div className="text-lg font-semibold">{userInfo.role}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Empresa</div>
                <div className="text-lg font-semibold">{userInfo.company}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}