
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, HelpCircle, MessageSquare, Clock, CheckCircle } from 'lucide-react';

const SupportPage = () => {
  const { t } = usePreferences();

  const handleEmailClick = () => {
    window.location.href = 'mailto:suporte@mordomofiel.com?subject=Suporte - Paz Financeira';
  };

  return (
    <MainLayout title={t('support.title') || 'Suporte'}>
      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{t('support.title') || 'Central de Suporte'}</CardTitle>
                <CardDescription>
                  {t('support.subtitle') || 'Estamos aqui para ajudar você'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t('support.contact.title') || 'Entre em Contato'}
            </CardTitle>
            <CardDescription>
              {t('support.contact.description') || 'Nossa equipe está pronta para atendê-lo'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg border">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">
                  {t('support.contact.emailLabel') || 'E-mail de Suporte'}
                </p>
                <a 
                  href="mailto:suporte@mordomofiel.com" 
                  className="text-primary hover:underline font-medium"
                >
                  suporte@mordomofiel.com
                </a>
              </div>
              <Button onClick={handleEmailClick} className="w-full sm:w-auto">
                <Mail className="h-4 w-4 mr-2" />
                {t('support.contact.sendEmail') || 'Enviar E-mail'}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">
                    {t('support.responseTime.title') || 'Tempo de Resposta'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('support.responseTime.description') || 'Respondemos em até 24 horas úteis'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">
                    {t('support.availability.title') || 'Disponibilidade'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('support.availability.description') || 'Atendimento de segunda a sexta'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('support.instructions.title') || 'Como Solicitar Suporte'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm text-muted-foreground">
                {t('support.instructions.step1') || 'Envie um e-mail para suporte@mordomofiel.com'}
              </li>
              <li className="text-sm text-muted-foreground">
                {t('support.instructions.step2') || 'Descreva detalhadamente sua dúvida ou problema'}
              </li>
              <li className="text-sm text-muted-foreground">
                {t('support.instructions.step3') || 'Inclua informações relevantes, como capturas de tela, se necessário'}
              </li>
              <li className="text-sm text-muted-foreground">
                {t('support.instructions.step4') || 'Aguarde nossa resposta, que será enviada em até 24 horas úteis'}
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Helpful Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('support.helpful.title') || 'Informações Úteis'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong className="text-foreground">
                  {t('support.helpful.tip1.title') || 'Dica:'}
                </strong>{' '}
                <span className="text-muted-foreground">
                  {t('support.helpful.tip1.description') || 'Para um atendimento mais rápido, inclua o máximo de detalhes possível em sua mensagem.'}
                </span>
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong className="text-foreground">
                  {t('support.helpful.tip2.title') || 'Lembrete:'}
                </strong>{' '}
                <span className="text-muted-foreground">
                  {t('support.helpful.tip2.description') || 'Verifique sua pasta de spam caso não receba nossa resposta.'}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SupportPage;

