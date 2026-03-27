# 📄 CORREÇÃO DO NOME DA EMPRESA NO RELATÓRIO PDF

## 📋 PROBLEMA IDENTIFICADO

**Situação:** Ao baixar o relatório em PDF, o sistema sempre mostrava "Relatório Financeiro - Poupeja" no título, independente do nome da empresa configurado no painel administrativo.

**Causa Raiz:** O nome da empresa estava hardcoded na função `downloadPDF` do arquivo `src/utils/reportUtils.ts`, não utilizando as configurações de branding do banco de dados.

**Impacto:** Relatórios PDF não refletiam a personalização da marca da empresa, mantendo sempre o nome "Poupeja" mesmo quando configurado um nome diferente.

---

## 🎯 ARQUIVOS MODIFICADOS

1. **`src/utils/reportUtils.ts`** - Função downloadPDF modificada para aceitar nome da empresa
2. **`src/pages/ReportsPage.tsx`** - Adicionado hook useBrandingConfig para obter nome da empresa

---

## 📝 IMPLEMENTAÇÃO PASSO A PASSO

### **CORREÇÃO 1: reportUtils.ts - Modificar Função downloadPDF**

**Arquivo:** `src/utils/reportUtils.ts`

#### **PASSO 1.1: Modificar assinatura da função**
**Linha:** 62
**ANTES:**
```typescript
export const downloadPDF = (data: Transaction[]): void => {
```

**DEPOIS:**
```typescript
export const downloadPDF = (data: Transaction[], companyName?: string): void => {
```

#### **PASSO 1.2: Modificar título do PDF**
**Linhas:** 67-69
**ANTES:**
```typescript
    // Set document title
    doc.setFontSize(20);
    doc.text('Relatório Financeiro - Poupeja', 20, 20);
```

**DEPOIS:**
```typescript
    // Set document title
    doc.setFontSize(20);
    const title = companyName ? `Relatório Financeiro - ${companyName}` : 'Relatório Financeiro - Poupeja';
    doc.text(title, 20, 20);
```

#### **PASSO 1.3: Modificar nome do arquivo PDF**
**Linhas:** 115-117
**ANTES:**
```typescript
    // Save the PDF
    const fileName = `poupeja-relatorio-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
```

**DEPOIS:**
```typescript
    // Save the PDF
    const fileName = companyName 
      ? `${companyName.toLowerCase().replace(/\s+/g, '-')}-relatorio-${new Date().toISOString().slice(0, 10)}.pdf`
      : `poupeja-relatorio-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
```

### **CORREÇÃO 2: ReportsPage.tsx - Adicionar Hook useBrandingConfig**

**Arquivo:** `src/pages/ReportsPage.tsx`

#### **PASSO 2.1: Adicionar import do useBrandingConfig**
**Linha:** 7 (após os outros imports)
**ADICIONAR:**
```typescript
import { useBrandingConfig } from '@/hooks/useBrandingConfig';
```

#### **PASSO 2.2: Adicionar hook no componente**
**Linha:** 15 (após as outras declarações)
**ADICIONAR:**
```typescript
  const { companyName } = useBrandingConfig();
```

#### **PASSO 2.3: Modificar chamada da função downloadPDF**
**Linha:** 33
**ANTES:**
```typescript
      downloadPDF(reportData);
```

**DEPOIS:**
```typescript
      downloadPDF(reportData, companyName);
```

---

## 🔧 PRINCIPAIS MUDANÇAS EXPLICADAS

### **MUDANÇA 1: Parâmetro Opcional na Função**
- **O que faz:** Adiciona parâmetro `companyName?: string` na função `downloadPDF`
- **Por que:** Permite passar o nome da empresa configurado no banco de dados
- **Resultado:** Função flexível que aceita nome personalizado ou usa fallback

### **MUDANÇA 2: Título Dinâmico do PDF**
- **O que faz:** Usa `companyName` para gerar título personalizado
- **Por que:** PDF reflete a marca da empresa configurada
- **Resultado:** "Relatório Financeiro - [Nome da Empresa]" em vez de "Poupeja"

### **MUDANÇA 3: Nome do Arquivo Personalizado**
- **O que faz:** Gera nome do arquivo baseado no nome da empresa
- **Por que:** Arquivo salvo com nome da empresa (ex: "minha-empresa-relatorio-2025-01-15.pdf")
- **Resultado:** Arquivos organizados por empresa

### **MUDANÇA 4: Integração com BrandingConfig**
- **O que faz:** Usa hook `useBrandingConfig` para obter nome da empresa
- **Por que:** Acessa configurações de branding do banco de dados
- **Resultado:** Nome da empresa carregado automaticamente das configurações

---

## ✅ RESULTADO ESPERADO

### **ANTES (PROBLEMÁTICO):**
- ❌ Título sempre "Relatório Financeiro - Poupeja"
- ❌ Arquivo sempre "poupeja-relatorio-YYYY-MM-DD.pdf"
- ❌ Não refletia personalização da marca

### **DEPOIS (CORRIGIDO):**
- ✅ Título "Relatório Financeiro - [Nome da Empresa]"
- ✅ Arquivo "[nome-empresa]-relatorio-YYYY-MM-DD.pdf"
- ✅ Reflete personalização configurada no admin
- ✅ Fallback para "Poupeja" se não houver configuração

---

## 🧪 TESTES DE VALIDAÇÃO

### **TESTE 1: Configuração Padrão**
1. ✅ Acessar `/admin` → Aba "Branding"
2. ✅ Deixar campo "Nome da Empresa" vazio
3. ✅ Gerar relatório PDF
4. ✅ Verificar se título é "Relatório Financeiro - Poupeja"

### **TESTE 2: Configuração Personalizada**
1. ✅ Acessar `/admin` → Aba "Branding"
2. ✅ Configurar "Nome da Empresa" como "Minha Empresa"
3. ✅ Salvar configurações
4. ✅ Gerar relatório PDF
5. ✅ Verificar se título é "Relatório Financeiro - Minha Empresa"
6. ✅ Verificar se arquivo é "minha-empresa-relatorio-YYYY-MM-DD.pdf"

### **TESTE 3: Nomes com Espaços**
1. ✅ Configurar nome como "Empresa Teste Ltda"
2. ✅ Gerar relatório PDF
3. ✅ Verificar se arquivo é "empresa-teste-ltda-relatorio-YYYY-MM-DD.pdf"

### **TESTE 4: Caracteres Especiais**
1. ✅ Configurar nome com acentos (ex: "Empresa São Paulo")
2. ✅ Gerar relatório PDF
3. ✅ Verificar se caracteres especiais são tratados corretamente

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **FRONTEND (OBRIGATÓRIO):**
- [ ] **Parâmetro companyName** adicionado na função downloadPDF
- [ ] **Título dinâmico** implementado no PDF
- [ ] **Nome do arquivo** personalizado implementado
- [ ] **Import useBrandingConfig** adicionado em ReportsPage.tsx
- [ ] **Hook useBrandingConfig** implementado em ReportsPage.tsx
- [ ] **Chamada downloadPDF** modificada para passar companyName
- [ ] **Build executado** sem erros (`npm run build`)
- [ ] **Testes realizados** conforme seção de validação

### **OPCIONAL:**
- [ ] **Testar com diferentes nomes** de empresas
- [ ] **Verificar caracteres especiais** no nome do arquivo
- [ ] **Validar responsividade** do PDF gerado

---

## 🚨 TROUBLESHOOTING

### **Se o nome não aparece no PDF:**
1. **Verifique:** Se as configurações de branding estão salvas no admin
2. **Verifique:** Se o hook useBrandingConfig está retornando o nome
3. **Verifique:** Se a função downloadPDF está recebendo o parâmetro
4. **Teste:** Console.log para debugar valores

### **Se o arquivo não salva com nome correto:**
1. **Verifique:** Se a função de sanitização está funcionando
2. **Verifique:** Se não há caracteres inválidos no nome
3. **Teste:** Com nomes simples primeiro

### **Se houver erros no build:**
1. **Verifique:** Se todos os imports estão corretos
2. **Verifique:** Se a sintaxe TypeScript está válida
3. **Teste:** `npm run build` para validar

### **Se o fallback não funciona:**
1. **Verifique:** Se a lógica condicional está correta
2. **Verifique:** Se o valor undefined está sendo tratado
3. **Teste:** Com configuração vazia no admin

---

## 🎯 RESUMO EXECUTIVO

**PROBLEMA:** Relatório PDF sempre mostrava "Poupeja" no título  
**CAUSA:** Nome da empresa hardcoded na função downloadPDF  
**SOLUÇÃO:** Integração com configurações de branding do banco de dados  
**ARQUIVOS:** 2 arquivos modificados  
**RESULTADO:** PDF personalizado com nome da empresa configurado  

**📌 AÇÃO OBRIGATÓRIA:** Implementar as 5 mudanças conforme especificado acima.

---

## 📚 ARQUIVOS RELACIONADOS

- **Documentação branding:** `docs/BRANDING_FLASH_FIX_IMPLEMENTATION.md`
- **Documentação mobile logo:** `docs/MOBILE_LOGO_FIX_IMPLEMENTATION.md`
- **Documentação metas:** `docs/GOAL_EDIT_BUG_FIX.md`
- **Documentação menu mobile:** `docs/MOBILE_GOALS_MENU_ADDITION.md`

---

## 🔄 INFORMAÇÕES TÉCNICAS ADICIONAIS

### **Sobre useBrandingConfig:**
- Hook que acessa configurações de branding do banco de dados
- Carrega dados da tabela `poupeja_settings` com categoria `branding`
- Fornece `companyName`, `logoUrl`, `faviconUrl`, `logoAltText`
- Cache automático para performance

### **Sobre Sanitização de Nomes:**
```typescript
// Converte "Empresa Teste Ltda" para "empresa-teste-ltda"
companyName.toLowerCase().replace(/\s+/g, '-')
```

### **Sobre Fallback:**
- Se `companyName` for undefined, vazio ou null
- Usa "Poupeja" como nome padrão
- Garante que sempre há um nome válido

### **Sobre jsPDF:**
- Biblioteca para geração de PDFs no frontend
- `doc.text()` para adicionar texto
- `doc.save()` para salvar arquivo
- Suporte a fontes e estilos

---

*Esta correção garante que os relatórios PDF reflitam a personalização da marca configurada no painel administrativo.*

**Versão do guia:** 1.0  
**Status:** Pronto para implementação em produção

---

## 🚀 DEPLOYMENT - COMANDO GIT

Após implementar todas as correções acima, execute o seguinte comando para fazer commit e push das mudanças:

```bash
git add .; git commit -m "feat: personalizar nome da empresa no relatório PDF - integrar configurações de branding para título e nome do arquivo do relatório"; git push origin main
```

**INSTRUÇÕES:**
1. **Abra o terminal** na pasta raiz do projeto
2. **Execute o comando acima** para fazer commit e push
3. **Aguarde a confirmação** de que o push foi realizado com sucesso
4. **Verifique no GitHub** se as mudanças foram aplicadas

**NOTA:** Este comando irá:
- Adicionar todos os arquivos modificados ao staging
- Criar um commit com a mensagem descritiva
- Fazer push para o branch main no GitHub 