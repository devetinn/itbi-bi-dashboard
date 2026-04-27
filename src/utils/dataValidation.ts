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
