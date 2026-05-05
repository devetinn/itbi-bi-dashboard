// Valores calculados diretamente do CSV fonte — para apresentação ao professor
// Fonte: itbi_clean.csv processado por etl_itbi.py (Python puro, sem Power Query)

export const DATA_GROUND_TRUTH = {
  fonte: 'itbi_clean.csv — Portal Dados Abertos Fortaleza (SEFIN)',
  totalRegistros: 94970,
  bairrosUnicos: 121,
  registrosComValor: 87872,
  somaVlBaseCalculo: 43_161_327_445.36,
  mediaVlBaseCalculo: 491_184.08,
  mesPicoTransacoes: '2025/11',
  qtdMesPico: 2493,
  etlRealizado: 'Python puro (etl_itbi.py) — sem Power Query',
  anosCobertura: '1996–2026',
  // ATENÇÃO: "2187/2026" visto no CSV é o num_dti (nº sequencial do
  // último documento registrado em 2026), NÃO o total de registros.
  observacao: 'num_dti=2187/2026 é o nº seq. do último doc. de 2026, não o total.',
}

export interface ValidationCheck {
  campo: string
  esperado: number | string
  calculado: number | string
  delta?: number  // diferença percentual, se numérico
  ok: boolean
}

export interface ValidationResult {
  checks: ValidationCheck[]
  allPassed: boolean
  score: number // 0–100
  completenessRate: number // % de registros com vl_base_calculo
}

export function validateData(params: {
  totalRegistros: number
  bairrosUnicos: number
  registrosComValor: number
  somaVlBaseCalculo: number
  mediaVlBaseCalculo: number
}): ValidationResult {
  const gt = DATA_GROUND_TRUTH
  const TOL = 0.005 // 0,5% de tolerância

  function numCheck(campo: string, esperado: number, calculado: number): ValidationCheck {
    const delta = esperado !== 0 ? Math.abs((calculado - esperado) / esperado) : 0
    return { campo, esperado, calculado, delta, ok: delta <= TOL }
  }

  const checks: ValidationCheck[] = [
    numCheck('Total de Registros', gt.totalRegistros, params.totalRegistros),
    numCheck('Bairros Únicos', gt.bairrosUnicos, params.bairrosUnicos),
    numCheck('Registros c/ Valor', gt.registrosComValor, params.registrosComValor),
    numCheck('Soma VL Base (R$)', gt.somaVlBaseCalculo, params.somaVlBaseCalculo),
    numCheck('Média VL Base (R$)', gt.mediaVlBaseCalculo, params.mediaVlBaseCalculo),
  ]

  const passed = checks.filter((c) => c.ok).length
  const score = Math.round((passed / checks.length) * 100)
  const completenessRate = params.totalRegistros > 0
    ? (params.registrosComValor / params.totalRegistros) * 100
    : 0

  return { checks, allPassed: passed === checks.length, score, completenessRate }
}
