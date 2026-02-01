# Figma Vectorizer

Aplicação web que converte imagens raster (PNG, JPEG, WebP) em vetores editáveis no Figma.

## Características

- **Upload Drag-and-Drop**: Interface intuitiva para upload de imagens
- **Vetorização Inteligente**: Converte imagens em SVG usando Potrace
- **Configurações Ajustáveis**:
  - Modo de cor (B&W, Grayscale, Colorido)
  - Nível de detalhe (0-100)
  - Suavização (0-100)
  - Threshold para imagens B&W
- **Preview em Tempo Real**: Visualize o resultado antes de exportar
- **Exportação para Figma**: Copie SVG para clipboard ou faça download
- **Otimização SVG**: Reduz tamanho do arquivo mantendo qualidade

## Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Vetorização**: Potrace
- **Processamento de Imagem**: Sharp
- **Gerenciamento de Estado**: Zustand
- **Otimização SVG**: SVGO

## Instalação

```bash
cd next-app
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Como Usar

### 1. Upload de Imagem

- Arraste e solte uma imagem ou clique para selecionar
- Formatos suportados: PNG, JPEG, WebP
- Tamanho máximo: 10MB

### 2. Configurar Vetorização

- **Modo de Cor**:
  - **B&W**: Converte para preto e branco (melhor para logos simples)
  - **Grayscale**: Mantém tons de cinza
  - **Color**: Preserva cores (experimental)

- **Nível de Detalhe**: Quanto maior, mais detalhes são preservados

- **Suavização**: Quanto maior, curvas mais suaves

- **Threshold** (apenas B&W): Controla o ponto de corte entre preto e branco

### 3. Exportar para Figma

Duas opções:

#### Opção A: Usar Plugin Figma (Recomendado)

1. Clique em "Copy SVG"
2. Abra o Figma
3. Instale e execute um plugin de importação SVG
4. Cole o SVG copiado
5. O vetor será criado no canvas, totalmente editável!

#### Opção B: Drag-and-Drop

1. Clique em "Download"
2. Arraste o arquivo .svg para o Figma
3. O vetor será importado automaticamente

## Estrutura do Projeto

```
next-app/
├── app/                      # Páginas e rotas
│   ├── api/                  # API endpoints
│   │   ├── upload/           # Upload de imagem
│   │   └── vectorize/        # Vetorização
│   ├── page.tsx              # Página principal
│   └── layout.tsx            # Layout base
├── components/               # Componentes React
│   ├── upload/               # Upload de arquivos
│   ├── vectorization/        # Vetorização e preview
│   ├── figma/                # Exportação Figma
│   └── ui/                   # Componentes UI base
├── lib/                      # Lógica de negócio
│   ├── vectorizer/           # Engine de vetorização
│   │   ├── vectorize.ts      # Lógica principal
│   │   ├── preprocessor.ts   # Pré-processamento
│   │   └── svg-optimizer.ts  # Otimização SVG
│   ├── store/                # Estado global (Zustand)
│   └── utils/                # Utilitários
└── types/                    # Definições TypeScript
```

## API Endpoints

### POST /api/upload

Faz upload de uma imagem.

**Request:**
```typescript
FormData {
  file: File
}
```

**Response:**
```typescript
{
  success: true,
  fileId: string,
  metadata: {
    name: string,
    size: number,
    type: string
  }
}
```

### POST /api/vectorize

Vetoriza uma imagem.

**Request:**
```typescript
{
  fileId?: string,
  buffer?: string, // base64
  options: {
    colorMode: 'bw' | 'grayscale' | 'color',
    detailLevel: number, // 0-100
    smoothness: number, // 0-100
    threshold?: number, // 0-255
    maxColors?: number // 2-32
  }
}
```

**Response:**
```typescript
{
  success: true,
  svg: string,
  metadata: {
    originalSize: number,
    svgSize: number,
    optimizedSize: number,
    pathCount: number,
    colorCount: number,
    processingTime: number,
    compressionRatio: string
  },
  figmaCompatibility: {
    isValid: boolean,
    warnings: string[]
  }
}
```

## Próximos Passos

### Aplicação Web (Completo ✅)
- [x] Upload de imagens
- [x] Vetorização com Potrace
- [x] Pré-processamento de imagem
- [x] Configurações ajustáveis
- [x] Preview do resultado
- [x] Otimização SVG
- [x] Exportação (clipboard + download)

### Plugin Figma (Pendente)
- [ ] Inicializar projeto do plugin
- [ ] Conversor SVG → Figma VectorPath
- [ ] UI do plugin
- [ ] Importação de vetores
- [ ] Publicação no Figma Community

### Melhorias Futuras
- [ ] Vetorização colorida aprimorada
- [ ] Processamento em lote
- [ ] Histórico de vetorizações
- [ ] Presets de configuração
- [ ] Preview antes/depois lado a lado
- [ ] Suporte a mais formatos (GIF, BMP)
- [ ] API pública

## Limitações Conhecidas

- **Vetorização colorida**: Implementação básica, converte para grayscale
- **Armazenamento**: Arquivos são mantidos em memória por 30 minutos
- **Tamanho de arquivo**: Limite de 10MB por upload
- **Imagens muito complexas**: Podem gerar SVGs grandes

## Desenvolvimento do Plugin Figma

O plugin Figma ainda não foi implementado. Quando estiver pronto:

1. O plugin receberá o SVG da web app
2. Converterá paths SVG para VectorPath do Figma
3. Criará nós vetoriais editáveis no canvas

## Licença

MIT

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Suporte

Para problemas ou dúvidas, abra uma issue no GitHub.

---

Desenvolvido com ❤️ usando Next.js e Potrace
