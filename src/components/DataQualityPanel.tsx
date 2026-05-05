import { validateData, type ValidationResult } from '../utils/dataValidation'
import { formatBRL } from '../utils/formatters'

interface Props {
  totalRegistros: number
  bairrosUnicos: number
  registrosComValor: number
  somaVlBaseCalculo: number
  mediaVlBaseCalculo: number
}

function StatusIcon({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${ok ? 'bg-[#009889]/15 text-[#009889]' : 'bg-[#F15A22]/15 text-[#F15A22]'}`}>
      {ok ? '✓' : '✗'}
    </span>
  )
}

function formatValue(v: number | string, campo: string): string {
  if (typeof v === 'string') return v
  if (campo.includes('R$') || campo.includes('Média') || campo.includes('Soma')) return formatBRL(v)
  return v.toLocaleString('pt-BR')
}

export function DataQualityPanel({ totalRegistros, bairrosUnicos, registrosComValor, somaVlBaseCalculo, mediaVlBaseCalculo }: Props) {
  const result: ValidationResult = validateData({
    totalRegistros, bairrosUnicos, registrosComValor, somaVlBaseCalculo, mediaVlBaseCalculo,
  })

  const scoreColor = result.score === 100 ? '#009889' : result.score >= 80 ? '#E8A838' : '#F15A22'

  return (
    <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#1A1A1A]">Validação dos Dados</h3>
          <p className="text-[11px] text-[#8A8A8A]">
            Comparação em tempo real com o ground truth do CSV fonte
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: scoreColor }}>{result.score}%</div>
          <div className="text-[10px] text-[#8A8A8A]">acurácia</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {result.checks.map((check) => (
          <div
            key={check.campo}
            className="flex items-center justify-between bg-[#F8F7F2] rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <StatusIcon ok={check.ok} />
              <span className="text-[11px] font-medium text-[#1A1A1A]">{check.campo}</span>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold text-[#1A1A1A]">
                {formatValue(check.calculado, check.campo)}
              </div>
              {!check.ok && (
                <div className="text-[10px] text-[#F15A22]">
                  esperado: {formatValue(check.esperado, check.campo)}
                </div>
              )}
              {check.delta !== undefined && check.ok && (
                <div className="text-[10px] text-[#009889]">
                  Δ {(check.delta * 100).toFixed(4)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-[#E8E6DF]">
        <span className="text-[11px] text-[#8A8A8A]">Completude dos registros</span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-[#E8E6DF] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${result.completenessRate}%`, backgroundColor: '#009889' }}
            />
          </div>
          <span className="text-[11px] font-semibold text-[#009889]">
            {result.completenessRate.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}
