import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface Props { onComplete: () => void }

// Dados dos prédios: [x, y_topo, largura, altura, temJanelas, temAntena]
const PREDIOS = [
  [30,  270, 45, 110, false, false],
  [85,  195, 28, 185, false, false],
  [122, 225, 42, 155, false, false],
  [174, 148, 32, 232, true,  true ],  // alto
  [216, 205, 36, 175, false, false],
  [262, 248, 58, 132, false, false],
  [330, 235, 24, 145, false, false],
  [364, 190, 20, 190, false, false],
  [394, 198, 40, 182, false, false],
  [444, 128, 38, 252, true,  true ],  // o mais alto
  [492, 205, 50, 175, false, false],
  [552, 185, 26, 195, false, false],
  [588, 238, 62, 142, false, false],
  [662, 215, 38, 165, false, false],
  [710, 252, 52, 128, false, false],
  [775, 232, 32, 148, false, false],
  [820, 262, 48, 118, false, false],
] as const

export function IntroAnimation({ onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Gera janelas em grid dentro de um prédio
  function Janelas({ px, py, pw, ph }: {
    px: number, py: number, pw: number, ph: number
  }) {
    const cols = Math.floor((pw - 8) / 9)
    const rows = Math.floor((ph - 16) / 12)
    return (
      <>
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => (
            <rect
              key={`${r}-${c}`}
              className="janela"
              x={px + 5 + c * 9}
              y={py + 10 + r * 12}
              width={5}
              height={7}
              fill="#FFFFFF"
              opacity={0}
            />
          ))
        )}
      </>
    )
  }

  useGSAP(() => {
    const tl = gsap.timeline()

    // ── 1. Stars twinkle in ──────────────────────────────
    gsap.set('.star', { opacity: 0 })
    tl.to('.star', {
      opacity: () => Math.random() * 0.8 + 0.2,
      duration: 0.3,
      stagger: { each: 0.02, from: 'random' },
    }, 0)

    // ── 2. Lua fade in ───────────────────────────────────
    gsap.set('#astro', { opacity: 0 })
    tl.to('#astro', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, 0.2)

    // ── 3. ClipPath reveal dos prédios ──────────────────
    // Cada clipRect começa em y=380 (chão), height=0
    // Anima para y=topo_do_predio, height=altura_total
    PREDIOS.forEach((p, i) => {
      const [, yTopo] = p
      const clipId = `clip-predio-${i}`
      
      // Inicializa: máscara no chão (não revela nada)
      gsap.set(`#${clipId}-rect`, {
        attr: { y: 380, height: 0 }
      })

      // Anima: máscara sobe revelando o prédio
      tl.to(`#${clipId}-rect`, {
        attr: {
          y: yTopo,
          height: 380 - yTopo
        },
        duration: 0.5,
        ease: 'power2.out',
      }, 0.3 + i * 0.06)
    })

    // ── 4. Linha do horizonte se desenha ────────────────
    gsap.set('#linha-horizonte', {
      strokeDasharray: 900,
      strokeDashoffset: 900
    })
    tl.to('#linha-horizonte', {
      strokeDashoffset: 0,
      duration: 0.7,
      ease: 'power1.inOut'
    }, 0.8)

    // ── 5. Janelas ligam aleatoriamente ─────────────────
    tl.to('.janela', {
      opacity: () => Math.random() * 0.45 + 0.05,
      duration: 0.04,
      stagger: { each: 0.015, from: 'random' }
    }, 1.2)

    // ── 6. Glow nos prédios principais ──────────────────
    tl.to('#glow-9, #glow-4', {
      opacity: 0.15,
      duration: 0.8,
      ease: 'power2.out'
    }, 1.4)

    // ── 7. Brasão desce com flip e float contínuo ────────
    gsap.set('#brasao', { opacity: 0, rotationY: -180, scale: 0.5, y: -20 })
    tl.to('#brasao', {
      opacity: 1,
      rotationY: 0,
      scale: 1,
      y: 0,
      duration: 1.2,
      ease: 'back.out(1.5)'
    }, 1.4)

    // Animação contínua (float)
    gsap.to('#brasao', {
      y: -8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2.6
    })

    // ── 8. Título ITBI: letra por letra ─────────────────
    // Cada span de letra anima individualmente
    gsap.set('.letra-itbi', { opacity: 0, y: 20 })
    tl.to('.letra-itbi', {
      opacity: 1,
      y: 0,
      duration: 0.35,
      stagger: 0.1,
      ease: 'power3.out'
    }, 2.0)

    // ── 9. Contador ─────────────────────────────────────
    gsap.set('#intro-counter', { opacity: 0 })
    tl.to('#intro-counter', { opacity: 1, duration: 0.2 }, 2.5)

    const obj = { value: 0 }
    tl.to(obj, {
      value: 30000,
      duration: 0.8,
      ease: 'power1.inOut',
      onUpdate: () => {
        const el = document.getElementById('intro-counter')
        if (el) el.textContent =
          `Carregando ${Math.floor(obj.value).toLocaleString('pt-BR')}+ registros...`
      }
    }, 2.5)

    tl.call(() => {
      const el = document.getElementById('intro-counter')
      if (el) el.textContent = '✓ 30.000+ registros carregados'
    })

    // ── 10. Pausa + fade out gradual da skyline ──────────
    tl.to('#skyline-svg', {
      opacity: 0.3,
      duration: 0.4,
      ease: 'power1.in'
    }, '+=0.3')

    // ── 11. Wipe curtain sobe revelando o dashboard ──────
    tl.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete
    }, '+=0.1')

    // Botão skip: fade in após 0.6s
    gsap.fromTo('#btn-skip',
      { opacity: 0 },
      { opacity: 0.6, duration: 0.4, delay: 0.6 }
    )

  }, [])

  const handleSkip = () => {
    gsap.killTweensOf('*')
    onComplete()
  }

  // Gera estrelas aleatórias
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    cx: Math.random() * 900,
    cy: Math.random() * 200,
    r: Math.random() * 1.2 + 0.3,
  }))

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(180deg, #020818 0%, #09090B 60%, #09090B 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── SVG SKYLINE ──────────────────────────────── */}
      <svg
        id="skyline-svg"
        viewBox="0 0 900 400"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente céu */}
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020818"/>
            <stop offset="100%" stopColor="#09090B"/>
          </linearGradient>

          {/* Gradiente nos prédios (face iluminada) */}
          <linearGradient id="predio-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A1A2E"/>
            <stop offset="40%" stopColor="#1E2240"/>
            <stop offset="100%" stopColor="#0D0D1A"/>
          </linearGradient>

          {/* Glow filter para janelas */}
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          {/* ClipPaths — um por prédio */}
          {PREDIOS.map((_, i) => (
            <clipPath key={i} id={`clip-predio-${i}`}>
              <rect id={`clip-predio-${i}-rect`} x="0" y="380" width="900" height="0"/>
            </clipPath>
          ))}
        </defs>

        {/* Background */}
        <rect width="900" height="400" fill="url(#sky-grad)"/>

        {/* Estrelas */}
        {stars.map(s => (
          <circle
            key={s.id}
            className="star"
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#FFFFFF"
            opacity={0}
          />
        ))}

        {/* Lua */}
        <g id="astro" opacity={0}>
          <circle cx="790" cy="65" r="26" fill="none" stroke="#F5E6A0" strokeWidth="1"/>
          <circle cx="790" cy="65" r="26" fill="#F5E6A0" opacity="0.04"/>
          {/* Crateras sutis */}
          <circle cx="782" cy="60" r="4" fill="none" stroke="#F5E6A0" strokeWidth="0.4" opacity="0.5"/>
          <circle cx="797" cy="72" r="3" fill="none" stroke="#F5E6A0" strokeWidth="0.4" opacity="0.5"/>
        </g>

        {/* Linha do horizonte */}
        <line
          id="linha-horizonte"
          x1="0" y1="380" x2="900" y2="380"
          stroke="#4A7C6F"
          strokeWidth="1.5"
        />

        {/* ── PRÉDIOS com clipPath reveal ── */}
        {PREDIOS.map(([px, py, pw, ph, temJanelas, temAntena], i) => (
          <g key={i} clipPath={`url(#clip-predio-${i})`}>
            {/* Corpo do prédio */}
            <rect
              x={px} y={py} width={pw} height={ph + (380 - py - ph)}
              fill="url(#predio-grad)"
              stroke="#2A3A5E"
              strokeWidth="0.6"
            />
            {/* Topo levemente mais claro */}
            <rect
              x={px} y={py} width={pw} height={4}
              fill="#3A4A7E"
              opacity="0.6"
            />
            {/* Janelas */}
            {temJanelas && (
              <Janelas px={Number(px)} py={Number(py)} pw={Number(pw)} ph={Number(ph)} />
            )}
            {/* Antena */}
            {temAntena && (
              <>
                <line
                  x1={Number(px) + Number(pw)/2}
                  y1={Number(py)}
                  x2={Number(px) + Number(pw)/2}
                  y2={Number(py) - 22}
                  stroke="#4A7C6F"
                  strokeWidth="1.2"
                />
                <circle
                  cx={Number(px) + Number(pw)/2}
                  cy={Number(py) - 24}
                  r="2.5"
                  fill="#F59E0B"
                />
              </>
            )}
          </g>
        ))}

        {/* Glow halos nos 2 prédios mais altos */}
        <ellipse
          id="glow-9"
          cx={463} cy={380}
          rx={60} ry={20}
          fill="#4A7C6F"
          opacity={0}
          filter="url(#glow-filter)"
        />
        <ellipse
          id="glow-4"
          cx={190} cy={380}
          rx={45} ry={15}
          fill="#4A7C6F"
          opacity={0}
          filter="url(#glow-filter)"
        />

        {/* Reflexo da cidade na "água" */}
        <rect x="0" y="380" width="900" height="20"
          fill="url(#sky-grad)" opacity="0.3"/>
      </svg>

      {/* ── CONTEÚDO CENTRAL ──────────────────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '100px',
      }}>
        {/* Brasão Local */}
        <img
          id="brasao"
          src="/Brasão_de_Fortaleza.svg"
          width={88}
          height={74}
          alt="Brasão de Fortaleza"
          style={{ opacity: 0, filter: 'drop-shadow(0 0 12px rgba(74,124,111,0.4))' }}
        />

        {/* Título letra por letra */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {['I','T','B','I'].map((l, i) => (
            <span
              key={i}
              className="letra-itbi"
              style={{
                fontSize: '88px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                lineHeight: 1,
                opacity: 0,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {l}
            </span>
          ))}
        </div>

        {/* Contador */}
        <p
          id="intro-counter"
          style={{
            margin: 0,
            fontSize: '11px',
            color: '#4A7C6F',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            opacity: 0,
          }}
        >
          Carregando dados...
        </p>
      </div>

      {/* Botão skip */}
      <button
        id="btn-skip"
        onClick={handleSkip}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '24px',
          background: 'none',
          border: 'none',
          color: '#444',
          fontSize: '11px',
          cursor: 'pointer',
          opacity: 0,
          fontFamily: 'Inter, system-ui',
        }}
      >
        Pular intro →
      </button>
    </div>
  )
}
