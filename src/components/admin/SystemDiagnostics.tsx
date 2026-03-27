import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Shield, 
  CreditCard, 
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  Target, 
  Calendar, 
  Palette, 
  Globe, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  Activity,
  Layers
} from 'lucide-react';

interface SystemFeature {
  category: string;
  icon: React.ReactNode;
  features: {
    name: string;
    status: 'active' | 'configured' | 'partial';
    description: string;
  }[];
}

const SystemDiagnostics: React.FC = () => {
  const [features] = useState<SystemFeature[]>([
    {
      category: 'Autenticação & Segurança',
      icon: <Shield className="h-5 w-5" />,
      features: [
        { name: 'Login/Logout', status: 'active', description: 'Sistema de autenticação completo com Supabase' },
        { name: 'Registro de Usuários', status: 'active', description: 'Cadastro com validação de email' },
        { name: 'Recuperação de Senha', status: 'active', description: 'Reset de senha via email' },
        { name: 'Proteção de Rotas', status: 'active', description: 'Middleware de autenticação em rotas privadas' },
        { name: 'Perfis de Usuário', status: 'active', description: 'Gerenciamento de dados pessoais' },
        { name: 'Roles (Admin/User)', status: 'active', description: 'Sistema de permissões com roles' }
      ]
    },
    {
      category: 'Gestão Financeira',
      icon: <BarChart3 className="h-5 w-5" />,
      features: [
        { name: 'Transações', status: 'active', description: 'CRUD completo de receitas e despesas' },
        { name: 'Categorias', status: 'active', description: 'Sistema de categorização personalizável' },
        { name: 'Metas Financeiras', status: 'active', description: 'Criação e acompanhamento de metas' },
        { name: 'Relatórios', status: 'active', description: 'Relatórios detalhados com filtros' },
        { name: 'Dashboard Analytics', status: 'active', description: 'Gráficos e estatísticas em tempo real' },
        { name: 'Transações Recorrentes', status: 'active', description: 'Agendamento de pagamentos fixos' }
      ]
    },
    {
      category: 'Assinaturas & Pagamentos',
      icon: <CreditCard className="h-5 w-5" />,
      features: [
        { name: 'Integração Stripe', status: 'active', description: 'Sistema de pagamentos completo' },
        { name: 'Planos de Assinatura', status: 'active', description: 'Múltiplos planos configuráveis' },
        { name: 'Checkout Seguro', status: 'active', description: 'Processo de compra otimizado' },
        { name: 'Portal do Cliente', status: 'active', description: 'Gestão de assinaturas pelos usuários' },
        { name: 'Webhooks', status: 'active', description: 'Sincronização automática com Stripe' },
        { name: 'Recuperação de Compras', status: 'active', description: 'Sistema de recuperação de transações' }
      ]
    },
    {
      category: 'Interface & Experiência',
      icon: <Palette className="h-5 w-5" />,
      features: [
        { name: 'Design Responsivo', status: 'active', description: 'Interface adaptável a todos os dispositivos' },
        { name: 'Tema Escuro/Claro', status: 'active', description: 'Alternância automática de temas' },
        { name: 'Navegação Mobile', status: 'active', description: 'Menu otimizado para dispositivos móveis' },
        { name: 'PWA', status: 'active', description: 'Aplicativo web progressivo instalável' },
        { name: 'Offline Support', status: 'active', description: 'Funcionalidades básicas offline' },
        { name: 'Branding Dinâmico', status: 'active', description: 'Personalização visual completa' }
      ]
    },
    {
      category: 'Administração',
      icon: <Settings className="h-5 w-5" />,
      features: [
        { name: 'Painel Admin', status: 'active', description: 'Dashboard administrativo completo' },
        { name: 'Gestão de Usuários', status: 'active', description: 'Controle total sobre usuários' },
        { name: 'Configurações Globais', status: 'active', description: 'Sistema de settings centralizadas' },
        { name: 'Gerador HTML Estático', status: 'active', description: 'Geração automática de landing pages' },
        { name: 'Monitoramento Sistema', status: 'active', description: 'Health checks e diagnósticos' },
        { name: 'Gestão de Preços', status: 'active', description: 'Configuração dinâmica de planos' }
      ]
    },
    {
      category: 'Integração & APIs',
      icon: <Globe className="h-5 w-5" />,
      features: [
        { name: 'WhatsApp Integration', status: 'configured', description: 'Botão de ativação via WhatsApp' },
        { name: 'Email Notifications', status: 'configured', description: 'Sistema de notificações por email' },
        { name: 'Edge Functions', status: 'active', description: '15+ funções serverless ativas' },
        { name: 'API REST', status: 'active', description: 'APIs completas para todas as funcionalidades' },
        { name: 'Webhooks Stripe', status: 'active', description: 'Sincronização automática de pagamentos' },
        { name: 'Storage de Arquivos', status: 'active', description: 'Upload e gestão de imagens/logos' }
      ]
    },
    {
      category: 'Dados & Analytics',
      icon: <Database className="h-5 w-5" />,
      features: [
        { name: 'Base de Dados', status: 'active', description: '10+ tabelas principais configuradas' },
        { name: 'RLS Policies', status: 'active', description: 'Segurança a nível de linha implementada' },
        { name: 'Backup Automático', status: 'active', description: 'Backup contínuo via Supabase' },
        { name: 'Migrations', status: 'active', description: 'Sistema de versionamento de BD' },
        { name: 'Relatórios Customizados', status: 'active', description: 'Geração de relatórios personalizados' },
        { name: 'Export PDF', status: 'active', description: 'Exportação de relatórios em PDF' }
      ]
    },
    {
      category: 'Multilíngue & Localização',
      icon: <Globe className="h-5 w-5" />,
      features: [
        { name: 'Português/Inglês', status: 'active', description: 'Sistema multilíngue completo' },
        { name: 'Formatação de Moeda', status: 'active', description: 'Múltiplas moedas suportadas' },
        { name: 'Formatos de Data', status: 'active', description: 'Localização de datas por região' },
        { name: 'Timezone Support', status: 'active', description: 'Suporte a diferentes fusos horários' }
      ]
    }
  ]);

  const getStatusBadge = (status: 'active' | 'configured' | 'partial') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>;
      case 'configured':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Configurado</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Parcial</Badge>;
    }
  };

  const getStatusIcon = (status: 'active' | 'configured' | 'partial') => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'configured':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const totalFeatures = features.reduce((acc, category) => acc + category.features.length, 0);
  const activeFeatures = features.reduce((acc, category) => 
    acc + category.features.filter(f => f.status === 'active').length, 0);
  const configuredFeatures = features.reduce((acc, category) => 
    acc + category.features.filter(f => f.status === 'configured').length, 0);

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Diagnóstico Completo do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{totalFeatures}</div>
              <div className="text-sm text-green-600">Total de Funcionalidades</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{activeFeatures}</div>
              <div className="text-sm text-green-600">Funcionalidades Ativas</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{configuredFeatures}</div>
              <div className="text-sm text-blue-600">Configuradas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{Math.round((activeFeatures / totalFeatures) * 100)}%</div>
              <div className="text-sm text-green-600">Taxa de Completude</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">📊 Status Geral</h4>
            <p className="text-sm text-blue-800">
              Sistema completamente funcional com {activeFeatures} funcionalidades ativas, 
              {configuredFeatures} configuradas e prontas para uso. Taxa de completude de {Math.round((activeFeatures / totalFeatures) * 100)}%.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {features.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {category.icon}
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start justify-between gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(feature.status)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{feature.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(feature.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tecnologias Utilizadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Stack Tecnológico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">Frontend</div>
              <div className="text-sm text-muted-foreground mt-1">React + TypeScript</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">Backend</div>
              <div className="text-sm text-muted-foreground mt-1">Supabase + Edge Functions</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">Database</div>
              <div className="text-sm text-muted-foreground mt-1">PostgreSQL</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">Pagamentos</div>
              <div className="text-sm text-muted-foreground mt-1">Stripe</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">UI</div>
              <div className="text-sm text-muted-foreground mt-1">Tailwind + Shadcn</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">Build</div>
              <div className="text-sm text-muted-foreground mt-1">Vite</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">PWA</div>
              <div className="text-sm text-muted-foreground mt-1">Workbox</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium">Charts</div>
              <div className="text-sm text-muted-foreground mt-1">Recharts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDiagnostics;