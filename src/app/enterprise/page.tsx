'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Brain, Activity, TrendingUp, Plus, AlertCircle, CheckCircle } from 'lucide-react';

export default function EnterpriseDashboard() {
  // Dados mockados da empresa
  const companyInfo = {
    name: 'Mix Corporation',
    plan: 'Empresa',
    admins: 2,
    totalUsers: 15,
    activeUsers: 12,
    totalAgents: 8,
    activeAgents: 6,
    monthlyExecutions: 1247,
    successRate: 94
  };

  const recentActivity = [
    {
      id: '1',
      type: 'agent_created',
      user: 'João Silva',
      description: 'Criou novo agente "Suporte ao Cliente"',
      time: '2 horas atrás'
    },
    {
      id: '2',
      type: 'user_added',
      user: 'Maria Santos',
      description: 'Novo funcionário adicionado',
      time: '5 horas atrás'
    },
    {
      id: '3',
      type: 'agent_executed',
      user: 'Pedro Oliveira',
      description: 'Executou agente de Análise de Dados',
      time: '1 dia atrás'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'agent_created':
        return <Brain className="w-4 h-4 text-blue-600" />;
      case 'user_added':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'agent_executed':
        return <Activity className="w-4 h-4 text-purple-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Corporativo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {companyInfo.name} - Painel de Gerenciamento
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              {companyInfo.plan}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              {companyInfo.admins} Admins
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyInfo.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {companyInfo.activeUsers} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agentes da Empresa</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyInfo.totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              {companyInfo.activeAgents} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execuções/Mês</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyInfo.monthlyExecutions}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyInfo.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Eficiência geral
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="space-y-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  <span>Convidar Funcionário</span>
                </CardTitle>
                <CardDescription>
                  Adicione novos membros à sua equipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Convidar Funcionário
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span>Criar Agente Empresarial</span>
                </CardTitle>
                <CardDescription>
                  Desenvolva agentes para toda a empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Criar Agente
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  <span>Configurações da Empresa</span>
                </CardTitle>
                <CardDescription>
                  Gerencie permissões e configurações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Configurar Empresa
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.user}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company Info */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Informações da Empresa</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500">Nome da Empresa</div>
                <div className="text-lg font-semibold">{companyInfo.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Plano</div>
                <div className="text-lg font-semibold">
                  <Badge className="bg-green-100 text-green-800">
                    {companyInfo.plan}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Administradores</div>
                <div className="text-lg font-semibold">{companyInfo.admins}/2</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className="text-lg font-semibold">
                  <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Ativa</span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}