import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { DATA_GROUND_TRUTH } from '../../utils/dataValidation'

/* ─── animation helpers ─── */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

/* ─── data ─── */
const PROCESSO_STEPS = [
  {
    n: '01',
    title: 'Contrato de Compra e Venda',
    desc: 'Comprador e vendedor assinam o instrumento particular ou público de compra e venda. O valor acordado é a base declarada para o cálculo do imposto.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="6.5" y1="7" x2="13.5" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="6.5" y1="10" x2="13.5" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="6.5" y1="13" x2="10" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    color: '#325565',
    tag: 'Pré-ITBI',
  },
  {
    n: '02',
    title: 'Avaliação da Base de Cálculo',
    desc: 'A SEFIN compara o valor declarado com o valor venal cadastral. A base de cálculo será o maior entre os dois. Imóveis sem registro atualizado podem ser avaliados pelo fiscal.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6.5v3.5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: '#00A0DC',
    tag: 'Cálculo',
  },
  {
    n: '03',
    title: 'Emissão da Guia ITBI',
    desc: 'O comprador solicita a guia de recolhimento no Portal SEFIN (online) ou presencialmente. É necessário CPF/CNPJ das partes, endereço do imóvel e valor da transação.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 14v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 8h6M7 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    color: '#F15A22',
    tag: 'Emissão',
  },
  {
    n: '04',
    title: 'Pagamento do Imposto',
    desc: 'O ITBI pode ser pago à vista ou parcelado em até 3 vezes. O pagamento deve ocorrer antes da lavratura da escritura. Atraso gera multa de 2% + juros Selic.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 9h16" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="5" y="12" width="4" height="1.5" rx="0.5" fill="currentColor"/>
      </svg>
    ),
    color: '#009889',
    tag: 'Pagamento',
  },
  {
    n: '05',
    title: 'Lavratura da Escritura',
    desc: 'Com a certidão de quitação do ITBI em mãos, as partes comparecem ao Cartório de Notas para lavrar a escritura pública de compra e venda.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 15.5L7 12.5l7-7a2.121 2.121 0 00-3-3l-7 7L1 16.5l3-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12.5 3.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: '#325565',
    tag: 'Cartório',
  },
  {
    n: '06',
    title: 'Registro no Cartório de Imóveis',
    desc: 'A escritura é levada ao Cartório de Registro de Imóveis competente. Somente com o registro o comprador se torna, juridicamente, o novo proprietário do imóvel.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L3 7v11h14V7L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7 18v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    color: '#009889',
    tag: 'Registro',
  },
]

const GLOSSARIO = [
  {
    term: 'ITBI',
    def: 'Imposto sobre Transmissão de Bens Imóveis inter vivos, a qualquer título, por ato oneroso. Cobrado pelo município onde o imóvel está localizado.',
    art: 'Art. 156, II — CF/88',
  },
  {
    term: 'Base de Cálculo',
    def: 'Valor que serve como referência para aplicar a alíquota. Em Fortaleza, é o maior entre o valor venal do imóvel (definido pelo Fisco) e o valor declarado na transação.',
    art: 'Art. 38 — CTN',
  },
  {
    term: 'Valor Venal',
    def: 'Valor estimado pelo Fisco municipal para fins de tributação, geralmente calculado com base na área, localização, padrão construtivo e outros fatores cadastrais.',
    art: 'Decreto Municipal',
  },
  {
    term: 'Alíquota',
    def: 'Percentual aplicado sobre a base de cálculo para obter o valor do imposto. Em Fortaleza: 2% (geral) ou 0,5% (Programas Habitacionais — SFH).',
    art: 'Lei nº 5.591/1981',
  },
  {
    term: 'Fato Gerador',
    def: 'A transmissão, a qualquer título e por ato oneroso, da propriedade ou do domínio útil de bens imóveis por natureza ou por acessão física.',
    art: 'Art. 35 — CTN',
  },
  {
    term: 'Contribuinte',
    def: 'O adquirente (comprador) do imóvel é o sujeito passivo do ITBI, responsável pelo recolhimento do imposto antes da lavratura da escritura.',
    art: 'Art. 42 — CTN',
  },
  {
    term: 'SEFIN',
    def: 'Secretaria Municipal de Finanças de Fortaleza. Órgão responsável pela administração tributária municipal, incluindo lançamento, fiscalização e cobrança do ITBI.',
    art: 'Município de Fortaleza',
  },
  {
    term: 'Imunidade ITBI',
    def: 'Operações que não geram ITBI: fusão, incorporação, cisão ou extinção de PJ; integralização de capital com imóvel (exceto se a PJ tem atividade imobiliária habitual).',
    art: 'Art. 156, §2º — CF/88',
  },
]

const LEGISLACAO = [
  {
    sigla: 'CF/88',
    titulo: 'Constituição Federal',
    artigo: 'Art. 156, inciso II',
    desc: 'Atribui competência tributária aos Municípios para instituir o ITBI sobre transmissões onerosas inter vivos de bens imóveis.',
    cor: '#325565',
  },
  {
    sigla: 'CTN',
    titulo: 'Código Tributário Nacional',
    artigo: 'Arts. 35 a 42',
    desc: 'Define fato gerador, base de cálculo, contribuinte e as hipóteses de não incidência do imposto sobre transmissão de imóveis.',
    cor: '#F15A22',
  },
  {
    sigla: 'Lei 5.591',
    titulo: 'Lei Municipal — Fortaleza',
    artigo: 'nº 5.591/1981',
    desc: 'Institui o ITBI no município de Fortaleza, estabelece alíquotas (2% geral, 0,5% SFH) e disciplina os procedimentos administrativos de lançamento.',
    cor: '#009889',
  },
  {
    sigla: 'LAIMO',
    titulo: 'Lei Orgânica Municipal',
    artigo: 'Art. 91 e seguintes',
    desc: 'Consolida as competências tributárias da Câmara Municipal e SEFIN no âmbito do Município de Fortaleza, incluindo normas de fiscalização imobiliária.',
    cor: '#00A0DC',
  },
]

/* ─── sub-components ─── */

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      className="text-[10px] font-bold uppercase tracking-[.14em] mb-3"
      style={{ fontFamily: 'var(--f-display)', color: 'var(--c-ink-4)' }}
    >
      {children}
    </div>
  )
}

function InfoCard({
  icon, title, children, accent = '#325565',
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  accent?: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, boxShadow: 'var(--sh-2)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative bg-white border border-[#E7E4DC] rounded-[14px] overflow-hidden p-5"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: accent }} />
      <div className="pl-3">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${accent}14`, color: accent }}
          >
            {icon}
          </div>
          <span
            className="font-bold text-[14px] tracking-tight"
            style={{ fontFamily: 'var(--f-display)', color: 'var(--c-ink)' }}
          >
            {title}
          </span>
        </div>
        <div className="text-[13.5px] leading-relaxed" style={{ color: 'var(--c-ink-2)' }}>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

function Calculadora() {
  const [valor, setValor] = useState('')
  const [sfh, setSfh] = useState(false)

  const numero = parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0
  const aliquota = sfh ? 0.005 : 0.02
  const itbi = numero * aliquota
  const cartorioEstimado = numero * 0.015

  const fmt = (v: number) =>
    v > 0
      ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '—'

  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) { setValor(''); return }
    const n = parseInt(digits, 10)
    setValor((n / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
  }

  return (
    <motion.div
      variants={fadeUp}
      className="bg-white border border-[#E7E4DC] rounded-[14px] overflow-hidden"
    >
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid #E7E4DC' }}>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(241,90,34,0.1)', color: '#F15A22' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4 7h6M7 4v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-[15px]" style={{ fontFamily: 'var(--f-display)', color: 'var(--c-ink)' }}>
            Calculadora ITBI
          </span>
        </div>
        <p className="text-[12.5px]" style={{ color: 'var(--c-ink-3)' }}>
          Estimativa rápida — valores reais podem variar conforme avaliação fiscal
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Input */}
        <div>
          <label
            className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ fontFamily: 'var(--f-display)', color: 'var(--c-ink-3)' }}
          >
            Valor do imóvel (R$)
          </label>
          <div className="relative">
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none"
              style={{ color: 'var(--c-ink-3)', fontFamily: 'var(--f-mono)' }}
            >
              R$
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={valor}
              onChange={e => handleChange(e.target.value)}
              placeholder="0,00"
              className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold transition-colors outline-none"
              style={{
                fontFamily: 'var(--f-mono)',
                borderColor: valor ? '#F15A22' : '#E7E4DC',
                background: '#FAFAF7',
                color: 'var(--c-ink)',
                fontSize: '15px',
              }}
            />
          </div>
        </div>

        {/* Toggle SFH */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setSfh(p => !p)}
            className="relative w-9 h-5 rounded-full transition-colors duration-200"
            style={{ background: sfh ? '#009889' : '#E7E4DC' }}
          >
            <motion.div
              animate={{ x: sfh ? 17 : 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </div>
          <div>
            <span className="text-[13px] font-semibold" style={{ color: 'var(--c-ink-2)' }}>
              Programa Habitacional (SFH)
            </span>
            <span className="ml-2 text-[11px] font-medium px-1.5 py-0.5 rounded" style={{ background: '#E2F4F0', color: '#00746A' }}>
              alíquota 0,5%
            </span>
          </div>
        </label>

        {/* Resultado */}
        <div className="rounded-xl p-4 space-y-3" style={{ background: '#FAFAF7', border: '1px solid #E7E4DC' }}>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium" style={{ color: 'var(--c-ink-3)' }}>
              Alíquota aplicada
            </span>
            <span
              className="text-[13px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: sfh ? '#E2F4F0' : '#FEEFE7',
                color: sfh ? '#00746A' : '#C04617',
                fontFamily: 'var(--f-mono)',
              }}
            >
              {(aliquota * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-px" style={{ background: '#E7E4DC' }} />
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold" style={{ color: 'var(--c-ink-2)' }}>
              ITBI estimado
            </span>
            <motion.span
              key={itbi}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[18px] font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--f-display)', color: '#F15A22' }}
            >
              {fmt(itbi)}
            </motion.span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px]" style={{ color: 'var(--c-ink-4)' }}>
              Custo cartorial estimado*
            </span>
            <span
              className="text-[13px] font-semibold"
              style={{ fontFamily: 'var(--f-mono)', color: 'var(--c-ink-3)' }}
            >
              {fmt(cartorioEstimado)}
            </span>
          </div>
          {numero > 0 && (
            <div
              className="text-[11px] leading-relaxed pt-1"
              style={{ color: 'var(--c-ink-4)', borderTop: '1px solid #E7E4DC' }}
            >
              * Estimativa de escritura + registro. Valores reais variam por cartório.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function GlossarioItem({ term, def, art }: typeof GLOSSARIO[0]) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      variants={fadeUp}
      className="border-b last:border-b-0"
      style={{ borderColor: '#E7E4DC' }}
    >
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-3 py-3.5 text-left transition-colors group"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-bold text-[13.5px]"
            style={{ fontFamily: 'var(--f-display)', color: open ? '#F15A22' : 'var(--c-ink)' }}
          >
            {term}
          </span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded hidden sm:inline-block"
            style={{ background: '#F0EFEA', color: 'var(--c-ink-4)', fontFamily: 'var(--f-mono)' }}
          >
            {art}
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.18 }}
          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: open ? '#FEEFE7' : '#F0EFEA', color: open ? '#F15A22' : 'var(--c-ink-3)' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p
              className="pb-4 text-[13px] leading-relaxed"
              style={{ color: 'var(--c-ink-2)' }}
            >
              {def}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── main page ─── */

export function PageProcesso() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-8">

      {/* ── Hero ── */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-[18px] p-7"
        style={{
          background: 'linear-gradient(135deg, #1F3845 0%, #325565 60%, #2a4a5a 100%)',
          boxShadow: 'var(--sh-3)',
        }}
      >
        {/* decorative lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,.15) 28px, rgba(255,255,255,.15) 29px)',
          }}
        />
        <div className="relative z-10">
          <div
            className="inline-block text-[10px] font-bold uppercase tracking-[.16em] px-2.5 py-1 rounded-full mb-4"
            style={{ background: 'rgba(241,90,34,0.22)', color: '#F9A882', fontFamily: 'var(--f-display)' }}
          >
            Guia Completo
          </div>
          <h1
            className="text-white font-extrabold leading-tight mb-3"
            style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', letterSpacing: '-0.03em' }}
          >
            O Processo ITBI.
          </h1>
          <p
            className="max-w-2xl leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.62)', fontSize: '14.5px' }}
          >
            Tudo que você precisa saber sobre o Imposto sobre Transmissão de Bens Imóveis em Fortaleza —
            do conceito jurídico ao passo a passo prático, com base nos{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>
              {DATA_GROUND_TRUTH.totalRegistros.toLocaleString('pt-BR')} registros reais
            </strong>{' '}
            da SEFIN ({DATA_GROUND_TRUTH.anosCobertura}).
          </p>

          {/* stat pills */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            {[
              { label: 'Alíquota geral', value: '2%' },
              { label: 'Alíquota SFH', value: '0,5%' },
              { label: 'Prazo para pagar', value: 'Antes da escritura' },
              { label: 'Competência', value: 'Municipal' },
            ].map(p => (
              <div
                key={p.label}
                className="px-3 py-1.5 rounded-full text-[12px] font-medium"
                style={{ background: 'rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>{p.label}: </span>
                <span className="font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── O que é / Quem paga / Quando ── */}
      <div>
        <SectionLabel>Conceito Fundamental</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            accent="#325565"
            title="O que é o ITBI?"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            }
          >
            Imposto <strong>municipal</strong> que incide toda vez que um imóvel muda de proprietário por ato oneroso (compra, dação em pagamento, arrematação em leilão etc.). Previsto no{' '}
            <span className="font-semibold" style={{ color: '#325565' }}>Art. 156, II da CF/88</span>.
          </InfoCard>

          <InfoCard
            accent="#F15A22"
            title="Quem paga?"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            }
          >
            O <strong>comprador (adquirente)</strong> é o contribuinte responsável pelo recolhimento. O vendedor não tem obrigação tributária no ITBI.{' '}
            <span className="font-semibold" style={{ color: '#F15A22' }}>Art. 42 do CTN</span>.
          </InfoCard>

          <InfoCard
            accent="#009889"
            title="Quando pagar?"
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5 1.5v3M11 1.5v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
              </svg>
            }
          >
            O pagamento deve ocorrer <strong>antes da lavratura da escritura</strong> em cartório. Sem a certidão de quitação do ITBI, o tabelião não pode lavrar o ato.
          </InfoCard>
        </div>
      </div>

      {/* ── Processo Passo a Passo ── */}
      <div>
        <SectionLabel>Fluxo Completo da Transação</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PROCESSO_STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              variants={fadeUp}
              whileHover={{ y: -3, boxShadow: 'var(--sh-2)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="relative bg-white border border-[#E7E4DC] rounded-[14px] p-5 overflow-hidden"
            >
              {/* connector line — not on last */}
              {i < PROCESSO_STEPS.length - 1 && (
                <div
                  className="hidden xl:block absolute -right-[9px] top-1/2 -translate-y-1/2 w-4 h-[2px] z-10"
                  style={{ background: '#E7E4DC' }}
                />
              )}

              <div className="flex items-start gap-3.5">
                {/* Step number */}
                <div className="flex-shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[11px]"
                    style={{ background: step.color, fontFamily: 'var(--f-display)' }}
                  >
                    {step.n}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className="font-bold text-[13.5px] leading-tight"
                      style={{ fontFamily: 'var(--f-display)', color: 'var(--c-ink)' }}
                    >
                      {step.title}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                      style={{ background: `${step.color}14`, color: step.color }}
                    >
                      {step.tag}
                    </span>
                  </div>
                  <p
                    className="text-[12.5px] leading-relaxed"
                    style={{ color: 'var(--c-ink-3)' }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Calculadora + Legislação ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5">
          <SectionLabel>Simulador</SectionLabel>
          <Calculadora />
        </div>

        <div className="md:col-span-7">
          <SectionLabel>Legislação Aplicável</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LEGISLACAO.map(lei => (
              <motion.div
                key={lei.sigla}
                variants={fadeUp}
                whileHover={{ y: -2, boxShadow: 'var(--sh-2)' }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="bg-white border border-[#E7E4DC] rounded-[14px] p-4 overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: lei.cor }} />
                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="font-extrabold text-[11px] uppercase tracking-wider px-2 py-1 rounded-lg"
                      style={{ background: `${lei.cor}14`, color: lei.cor, fontFamily: 'var(--f-mono)' }}
                    >
                      {lei.sigla}
                    </span>
                  </div>
                  <div
                    className="font-bold text-[13px] mb-0.5"
                    style={{ fontFamily: 'var(--f-display)', color: 'var(--c-ink)' }}
                  >
                    {lei.titulo}
                  </div>
                  <div
                    className="text-[11px] font-semibold mb-2"
                    style={{ color: lei.cor, fontFamily: 'var(--f-mono)' }}
                  >
                    {lei.artigo}
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--c-ink-3)' }}>
                    {lei.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Imunidades ── */}
      <motion.div
        variants={fadeUp}
        className="border border-[#E7E4DC] rounded-[14px] p-5 bg-white"
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(0,160,220,0.1)', color: '#00A0DC' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3.5 5.5v5.25C3.5 14.58 6.36 17.86 10 18.5c3.64-.64 6.5-3.92 6.5-7.75V5.5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3
              className="font-bold text-[14.5px] mb-1"
              style={{ fontFamily: 'var(--f-display)', color: 'var(--c-ink)' }}
            >
              Imunidades e Não Incidência
            </h3>
            <p className="text-[13px] mb-3" style={{ color: 'var(--c-ink-3)' }}>
              O ITBI <strong>não incide</strong> nas situações previstas no Art. 156, §2º da CF/88:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { titulo: 'Integralização de Capital', desc: 'Transferência de imóvel para PJ como integralização de capital social — desde que a PJ não tenha por atividade preponderante a compra e venda de imóveis.' },
                { titulo: 'Fusão / Incorporação', desc: 'Transmissão decorrente de fusão, incorporação, cisão ou extinção de pessoa jurídica.' },
                { titulo: 'Herança e Doação', desc: 'Transmissões causa mortis e doações são tributadas pelo ITCMD (estadual), não pelo ITBI municipal.' },
                { titulo: 'SFH — Alíquota Reduzida', desc: 'Aquisições enquadradas no Sistema Financeiro de Habitação têm alíquota reduzida de 0,5% (não é imunidade, mas benefício fiscal).' },
              ].map(im => (
                <div
                  key={im.titulo}
                  className="rounded-xl p-3"
                  style={{ background: '#E1F2FB', border: '1px solid #C5E4F5' }}
                >
                  <div className="font-bold text-[12px] mb-1" style={{ color: '#007AAB', fontFamily: 'var(--f-display)' }}>
                    {im.titulo}
                  </div>
                  <p className="text-[11.5px] leading-relaxed" style={{ color: '#414042' }}>
                    {im.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Glossário ── */}
      <div>
        <SectionLabel>Glossário</SectionLabel>
        <motion.div
          variants={fadeUp}
          className="bg-white border border-[#E7E4DC] rounded-[14px] px-5 py-2"
        >
          {GLOSSARIO.map(g => (
            <GlossarioItem key={g.term} {...g} />
          ))}
        </motion.div>
      </div>

      {/* ── Dataset Stats ── */}
      <div>
        <SectionLabel>Dados Reais — Fortaleza</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Transações registradas',
              value: DATA_GROUND_TRUTH.totalRegistros.toLocaleString('pt-BR'),
              sub: 'dataset SEFIN completo',
              color: '#325565',
              bg: 'rgba(50,85,101,0.06)',
            },
            {
              label: 'Volume total movimentado',
              value: `R$ ${(DATA_GROUND_TRUTH.somaVlBaseCalculo / 1e9).toFixed(1)} bi`,
              sub: 'base de cálculo acumulada',
              color: '#F15A22',
              bg: 'rgba(241,90,34,0.06)',
            },
            {
              label: 'Bairros mapeados',
              value: String(DATA_GROUND_TRUTH.bairrosUnicos),
              sub: 'de Fortaleza',
              color: '#009889',
              bg: 'rgba(0,152,137,0.05)',
            },
            {
              label: 'Cobertura histórica',
              value: DATA_GROUND_TRUTH.anosCobertura,
              sub: 'série temporal completa',
              color: '#00A0DC',
              bg: 'rgba(0,160,220,0.05)',
            },
          ].map(s => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              whileHover={{ y: -2, boxShadow: 'var(--sh-2)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="relative bg-white border border-[#E7E4DC] rounded-[14px] p-4 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${s.bg} 0%, #fff 60%)` }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: s.color }} />
              <div className="pl-3">
                <div
                  className="text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--f-display)', color: 'var(--c-ink-4)' }}
                >
                  {s.label}
                </div>
                <div
                  className="font-extrabold tracking-tight leading-none mb-1"
                  style={{ fontFamily: 'var(--f-display)', fontSize: '1.6rem', color: 'var(--c-ink)', fontVariantNumeric: 'tabular-nums' }}
                >
                  {s.value}
                </div>
                <div className="text-[11.5px] font-medium" style={{ color: 'var(--c-ink-4)' }}>
                  {s.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Source footnote */}
        <motion.div
          variants={fadeUp}
          className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: '#F0EFEA', border: '1px solid #E7E4DC' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0">
            <circle cx="7" cy="7" r="6" stroke="#9A9A95" strokeWidth="1.2"/>
            <path d="M7 6.5v3M7 4.5v.5" stroke="#9A9A95" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <p className="text-[11.5px] leading-relaxed" style={{ color: 'var(--c-ink-3)' }}>
            Fonte: <strong>Portal de Dados Abertos de Fortaleza</strong> (dados.fortaleza.ce.gov.br) — dataset ITBI Transações Imobiliárias,
            processado via ETL em Python puro (<code className="font-mono bg-white px-1 rounded text-[10.5px]">etl_itbi.py</code>), sem Power Query.
            Valores brutos de base de cálculo; ITBI efetivamente recolhido pode diferir por isenções e deduções.
          </p>
        </motion.div>
      </div>

    </motion.div>
  )
}
