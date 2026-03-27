import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, FileText, Code, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PWAManifestData {
  company_name: string
  company_description: string
  logo_url: string
  theme_color: string
  background_color: string
  files: {
    manifest: {
      filename: string
      content: string
    }
    serviceWorker: {
      filename: string
      content: string
    }
  }
}

export function PWAManifestGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [manifestData, setManifestData] = useState<PWAManifestData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generatePWAFiles = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // URL correta da Edge Function do Supabase
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const functionUrl = `${supabaseUrl}/functions/v1/generate-pwa-manifest`
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data: PWAManifestData = await response.json()
      setManifestData(data)
      
      toast({
        title: "✅ Arquivos PWA Gerados!",
        description: "Os arquivos manifest.json e service worker foram gerados com sucesso.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      
      toast({
        title: "❌ Erro ao Gerar Arquivos PWA",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "📥 Download Iniciado",
      description: `Arquivo ${filename} baixado com sucesso.`,
    })
  }

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "📋 Copiado!",
        description: `Conteúdo do ${type} copiado para a área de transferência.`,
      })
    } catch (err) {
      toast({
        title: "❌ Erro ao Copiar",
        description: "Não foi possível copiar o conteúdo.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-600" />
          Gerador de PWA Manifest
        </CardTitle>
        <CardDescription>
          Gere automaticamente o manifest.json e service worker personalizados baseados nas configurações de branding do seu banco de dados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Botão de Geração */}
        <Button 
          onClick={generatePWAFiles}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Gerando Arquivos PWA...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Gerar Arquivos PWA
            </>
          )}
        </Button>
        
        <p className="text-sm text-gray-600 text-center">
          Os arquivos serão gerados baseados nas configurações de branding salvas no banco de dados.
        </p>

        {/* Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Erro:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Resultados */}
        {manifestData && (
          <>
            <Separator />
            
            {/* Informações da Empresa */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Configurações Detectadas
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700">Nome da Empresa:</div>
                  <div className="text-gray-900">{manifestData.company_name}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Descrição:</div>
                  <div className="text-gray-900">{manifestData.company_description}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Cor do Tema:</div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: manifestData.theme_color }}
                    ></div>
                    <span className="text-gray-900">{manifestData.theme_color}</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Cor de Fundo:</div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: manifestData.background_color }}
                    ></div>
                    <span className="text-gray-900">{manifestData.background_color}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Arquivo manifest.json */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  manifest.json
                  <Badge variant="secondary">PWA</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <pre>{manifestData.files.manifest.content}</pre>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadFile(manifestData.files.manifest.content, manifestData.files.manifest.filename)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(manifestData.files.manifest.content, 'manifest.json')}
                  >
                    📋 Copiar
                  </Button>
                </div>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <p>📁 Salve como: <code className="bg-gray-100 px-1 rounded">/public/manifest.json</code></p>
                  <p>Este arquivo define as propriedades do PWA para instalação.</p>
                </div>
              </CardContent>
            </Card>

            {/* Arquivo Service Worker */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-4 w-4 text-purple-600" />
                  sw.js
                  <Badge variant="secondary">Service Worker</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <pre>{manifestData.files.serviceWorker.content}</pre>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadFile(manifestData.files.serviceWorker.content, manifestData.files.serviceWorker.filename)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(manifestData.files.serviceWorker.content, 'service worker')}
                  >
                    📋 Copiar
                  </Button>
                </div>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <p>📁 Salve como: <code className="bg-gray-100 px-1 rounded">/public/sw.js</code></p>
                  <p>Este arquivo gerencia o cache e funcionalidades offline do PWA.</p>
                </div>
              </CardContent>
            </Card>

            {/* Instruções de Instalação */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">📋 Instruções de Instalação</div>
                <div className="space-y-1 text-sm">
                  <div>1. Baixe os dois arquivos gerados acima</div>
                  <div>2. Substitua os arquivos existentes na pasta /public/</div>
                  <div>3. Deploy da aplicação para que as mudanças tenham efeito</div>
                  <div>4. Teste a instalação do PWA no navegador</div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Links Úteis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-gray-600" />
                  Links Úteis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>📖 <strong>Documentação PWA:</strong> Aprenda mais sobre Progressive Web Apps</p>
                <p>🔧 <strong>Teste PWA:</strong> Use as ferramentas de desenvolvedor do Chrome para testar</p>
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </Card>
  )
}