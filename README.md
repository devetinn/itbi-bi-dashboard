# Dashboard ITBI Fortaleza

Dashboard web interativo para análise de transações imobiliárias (ITBI) de Fortaleza, desenvolvido com React e Recharts. Os dados provêm do Portal de Dados Abertos da Prefeitura de Fortaleza (SEFIN) e foram processados com Python puro — sem Power Query.

## O que é o ITBI?

O ITBI (Imposto sobre Transmissão de Bens Imóveis) é cobrado toda vez que um imóvel muda de dono. Cada transação registrada pela SEFIN revela o valor do imóvel, o bairro, o tipo de uso e o padrão construtivo.

## Tecnologias Utilizadas

| Tecnologia | Função no projeto |
|---|---|
| React + Vite | Interface web interativa |
| TypeScript | Tipagem e segurança do código |
| Recharts | Gráficos SVG declarativos |
| Papaparse | Leitura do CSV no browser |
| Framer Motion | Animações e transições |
| Tailwind CSS | Estilização utilitária |
| Python (ETL) | Processamento dos dados brutos da SEFIN |
| Vercel | Deploy gratuito com CDN global |

## De Onde Vêm os Dados

- Fonte: Portal de Dados Abertos de Fortaleza (dados.fortaleza.ce.gov.br)
- Dataset: dados_abertos_itbi_transacoes_imobiliarias.csv (SEFIN)
- Total: 94.970 registros | 121 bairros | 1996-2026

## Como os Dados Foram Processados (ETL em Python)

O CSV bruto tem encoding latin-1, separador ";", números em formato brasileiro e datas no formato dd/mm/yyyy.

O script etl_itbi.py faz o pipeline completo:
1. EXTRACT: le o CSV bruto com encoding correto
2. TRANSFORM: converte formatos, remove duplicatas, calcula campos derivados (idade do imovel, valor/m2, faixa de valor)
3. LOAD: salva itbi_clean.csv em UTF-8 pronto para o dashboard

ATENCAO: O valor "2187/2026" no CSV e o numero sequencial do ultimo documento de 2026, NAO o total de registros. O dataset completo possui 94.970 registros.

## Como Rodar Localmente

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de producao
npx tsc --noEmit  # verificar tipos
```

## Como Funciona o Cross-Filtering

Todos os graficos sao interconectados via FilterContext. Clicar em um bairro no RankingBairros atualiza todos os outros charts automaticamente. Filtros disponiveis: bairro, tipo de uso, faixa de valor, ano, padrao construtivo.

## Estrutura de Arquivos

```
src/
  hooks/useITBIData.ts            - logica de calculo dos KPIs
  context/FilterContext.tsx       - estado global dos filtros
  components/charts/
    TransacoesPorMes.tsx          - AreaChart com gradiente
    RankingBairros.tsx            - BarChart com medalhas
    TipoUsoDonut.tsx              - Donut com centro informativo
    FaixaValorBar.tsx             - BarChart com linha de media
    ParetoChart.tsx               - analise de concentracao
    HeatmapSazonalidade.tsx       - mapa de calor ano x mes
  components/
    AboutModal.tsx                - modal com metodologia
    MethodologyBanner.tsx         - banner de primeira visita
    DataSourceBadge.tsx           - badge com metadados do dataset
  utils/
    dataValidation.ts             - ground truth para validacao
public/
  itbi_clean.csv                  - dataset processado pelo ETL
  fortaleza-bairros.json          - GeoJSON dos bairros
```

## Validacao dos Dados

| Metrica | CSV (fonte) | Dashboard |
|---|---|---|
| Total registros | 94.970 | Correto |
| Bairros unicos | 121 | Correto |
| Mes de pico | Nov/2025 (2.493) | Correto |
| Soma vl_base_calculo | R$ 43,2 bi | Correto |

Os calculos de referencia estao em src/utils/dataValidation.ts.
