import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Pencil, Eye, Download, ArrowRight } from 'lucide-react'
import { useResume } from '@/context/ResumeContext'
import { templateList } from '@/templates'
import type { TemplateType } from '@/types/resume'

/* ───────────────────── animation helpers ───────────────────── */

const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
const easeSpring = [0.34, 1.56, 0.64, 1] as [number, number, number, number]

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeSmooth, delay },
  },
})

const staggerContainer = (stagger = 0.12) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
})

const cardReveal = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeSmooth },
  },
}

/* ───────────────────── data ───────────────────── */

const landingTemplates = templateList.map((t) => ({ id: t.id, name: t.name, desc: t.description, thumb: t.thumbnail }))

/* ───────────────────── components ───────────────────── */

/** Section 1: Navigation Bar */
function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-10 transition-all duration-300 ${
        scrolled
          ? 'bg-surface shadow-sm'
          : 'bg-transparent'
      }`}
    >
      {/* Brand */}
      <Link to="/welcome" className="flex items-center gap-0 select-none">
        <span className="text-headline font-serif text-ink-primary tracking-tight">Resu</span>
        <span className="text-headline font-serif text-ink-primary tracking-tight relative">
          Me
          <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-themeaccent" />
        </span>
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <a
          href="#templates"
          className="text-body text-ink-secondary hover:text-ink-primary transition-colors duration-150"
        >
          模板
        </a>
        <a
          href="#features"
          className="text-body text-ink-secondary hover:text-ink-primary transition-colors duration-150"
        >
          功能
        </a>
        <a
          href="#how-it-works"
          className="text-body text-ink-secondary hover:text-ink-primary transition-colors duration-150"
        >
          关于
        </a>
      </div>

      {/* Desktop CTA */}
      <Link
        to="/"
        className="hidden md:inline-flex items-center px-5 py-2 rounded-lg bg-themeaccent text-white text-body font-medium hover:bg-themeaccent-hover active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-themeaccent focus:ring-offset-2"
      >
        开始使用
      </Link>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex flex-col gap-1 p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="菜单"
      >
        <span className={`block w-5 h-0.5 bg-ink-primary transition-transform duration-200 ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
        <span className={`block w-5 h-0.5 bg-ink-primary transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-ink-primary transition-transform duration-200 ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-16 left-0 right-0 bg-surface border-b border-divider-faint shadow-md md:hidden flex flex-col p-6 gap-4"
        >
          <a href="#templates" className="text-body text-ink-secondary" onClick={() => setMobileOpen(false)}>模板</a>
          <a href="#features" className="text-body text-ink-secondary" onClick={() => setMobileOpen(false)}>功能</a>
          <a href="#how-it-works" className="text-body text-ink-secondary" onClick={() => setMobileOpen(false)}>关于</a>
          <Link to="/" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-themeaccent text-white text-body font-medium mt-2">
            开始使用
          </Link>
        </motion.div>
      )}
    </nav>
  )
}

/** Floating decorative particles for hero */
function FloatingParticles() {
  const particles = Array.from({ length: 7 }, (_, i) => ({
    id: i,
    size: 4 + Math.random() * 4,
    left: `${10 + Math.random() * 80}%`,
    duration: 20 + Math.random() * 10,
    delay: Math.random() * 10,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-themeaccent/[0.08]"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            bottom: '-10px',
            animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

/** Section 2: Hero */
function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-16 pb-12 px-4 sm:px-6">
      <FloatingParticles />

      <motion.h1
        variants={fadeUp(0)}
        initial="hidden"
        animate="visible"
        className="text-hero font-serif text-ink-primary text-center max-w-[600px] z-10"
      >
        以简约之道，书写职业故事
      </motion.h1>

      <motion.p
        variants={fadeUp(0.15)}
        initial="hidden"
        animate="visible"
        className="text-body text-ink-secondary text-center max-w-[480px] mt-4 leading-relaxed z-10"
      >
        ResuMe 帮你打造优雅专业的简历。日式极简设计，所见即所得的编辑体验，让你的经历自然呈现。
      </motion.p>

      <motion.div
        variants={fadeUp(0.3)}
        initial="hidden"
        animate="visible"
        className="mt-6 z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3 rounded-lg bg-themeaccent text-white text-body font-medium hover:bg-themeaccent-hover active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-themeaccent focus:ring-offset-2"
        >
          开始制作简历
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: easeSmooth, delay: 0.45 }}
        className="mt-8 w-full max-w-[900px] z-10"
        style={{ perspective: '1200px' }}
      >
        <img
          src="./hero-editor-screenshot.png"
          alt="ResuMe 编辑器工作区预览"
          className="w-full rounded-xl shadow-lg"
          style={{ transform: 'rotateX(2deg)' }}
        />
      </motion.div>
    </section>
  )
}

/** Section 3: Feature Highlights */
function FeatureCard({
  icon,
  title,
  description,
  image,
}: {
  icon: React.ReactNode
  title: string
  description: string
  image?: string
}) {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="flex flex-col items-center text-center bg-surface rounded-xl border border-divider-faint shadow-sm p-5 hover:shadow-md hover:border-divider transition-all duration-200"
    >
      <motion.div
        variants={{
          hidden: { scale: 0.8 },
          visible: { scale: 1, transition: { duration: 0.3, ease: easeSpring } },
        }}
        className="w-12 h-12 rounded-full bg-themeaccent-light flex items-center justify-center"
      >
        {icon}
      </motion.div>
      <h3 className="text-headline text-ink-primary mt-4">{title}</h3>
      <p className="text-body text-ink-secondary mt-2 leading-relaxed">{description}</p>
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full mt-4 rounded-lg shadow-sm object-cover"
        />
      )}
    </motion.div>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 bg-paper">
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <FeatureCard
          icon={<Pencil className="w-[22px] h-[22px] text-themeaccent" />}
          title="极简模板"
          description="8 款精心设计的日式极简模板，每一款都经过排版推敲，让你的简历在简洁中展现专业。"
          image="./feature-template-preview.png"
        />
        <FeatureCard
          icon={<Eye className="w-[22px] h-[22px] text-themeaccent" />}
          title="实时预览"
          description="左侧编辑，右侧即时呈现。所见即所得的写作体验，每一个修改都立即反映在 A4 尺寸的真实简历上。"
        />
        <FeatureCard
          icon={<Download className="w-[22px] h-[22px] text-themeaccent" />}
          title="本地存储"
          description="所有数据保存在你的浏览器本地，无需注册，无需上传。随时导出 JSON 备份，数据完全由你掌控。"
        />
      </motion.div>
    </section>
  )
}

/** Section 4: Template Showcase */
function TemplateShowcase() {
  const navigate = useNavigate()
  const { dispatch } = useResume()

  const handleSelectTemplate = (id: TemplateType) => {
    dispatch({ type: 'SET_TEMPLATE', payload: id })
    navigate('/')
  }

  return (
    <section id="templates" className="py-12 sm:py-16 px-4 sm:px-6 bg-surface">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-10"
        >
          <span className="text-small text-themeaccent uppercase tracking-[0.06em]">模板展示</span>
          <h2 className="text-display font-serif text-ink-primary mt-2">选择适合你的风格</h2>
          <p className="text-body text-ink-secondary mt-3">
            每一款模板都经过精心排版，确保在各种场景下都能展现最佳效果
          </p>
        </motion.div>

        {/* Template Grid */}
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {landingTemplates.map((t) => (
            <motion.div
              key={t.id}
              variants={cardReveal}
              className="group cursor-pointer"
              onClick={() => handleSelectTemplate(t.id)}
            >
              <div className="relative overflow-hidden rounded-xl border border-divider-faint bg-white shadow-sm group-hover:shadow-md group-hover:border-divider transition-all duration-250 ease-out">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={t.thumb}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-250 ease-out"
                  />
                </div>
              </div>
              <h3 className="text-headline text-ink-primary mt-3">{t.name}</h3>
              <p className="text-body text-ink-secondary mt-1">{t.desc}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-body text-themeaccent font-medium group-hover:underline">
                使用此模板
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/** Section 5: How It Works */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: '选择模板',
      desc: '从 8 款精心设计的模板中选择最适合你职业风格的一款。',
    },
    {
      num: '02',
      title: '填写内容',
      desc: '按板块填写你的个人信息、教育背景、工作经历等。实时预览让每一步都清晰可见。',
    },
    {
      num: '03',
      title: '导出使用',
      desc: '一键导出为 PDF，或直接打印。你的简历数据保存在本地，随时可以继续编辑。',
    },
  ]

  return (
    <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-6 bg-paper">
      <div className="max-w-[800px] mx-auto">
        {/* Section Header */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-10"
        >
          <span className="text-small text-themeaccent uppercase tracking-[0.06em]">使用流程</span>
          <h2 className="text-display font-serif text-ink-primary mt-2">三步完成你的简历</h2>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col md:flex-row items-start gap-8 md:gap-4 lg:gap-8"
        >
          {steps.map((step, i) => (
            <div key={step.num} className="flex-1 flex flex-col items-center text-center relative">
              {/* Connecting line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80px] border-t border-dashed border-divider z-0" />
              )}
              <motion.span
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] } },
                }}
                className="text-hero font-serif text-ink-minimal z-10"
              >
                {step.num}
              </motion.span>
              <h3 className="text-headline text-ink-primary mt-2 z-10">{step.title}</h3>
              <p className="text-body text-ink-secondary mt-2 leading-relaxed z-10">{step.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/** Section 6: Footer */
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, ease: easeSmooth }}
      className="border-t border-divider-faint bg-paper py-8 px-4 sm:px-6"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col items-center md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
        {/* Brand */}
        <div>
          <Link to="/welcome" className="flex items-center gap-0 select-none">
            <span className="text-headline font-serif text-ink-primary tracking-tight">Resu</span>
            <span className="text-headline font-serif text-ink-primary tracking-tight relative">
              Me
              <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-themeaccent" />
            </span>
          </Link>
          <p className="text-small text-ink-tertiary mt-1">以简约之道，书写职业故事</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
          <div className="flex flex-col gap-1">
            <span className="text-micro text-ink-tertiary uppercase tracking-wider">产品</span>
            <Link to="/" className="text-small text-ink-secondary hover:text-ink-primary transition-colors duration-150">编辑器</Link>
            <Link to="/templates" className="text-small text-ink-secondary hover:text-ink-primary transition-colors duration-150">模板</Link>
            <Link to="/settings" className="text-small text-ink-secondary hover:text-ink-primary transition-colors duration-150">设置</Link>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-micro text-ink-tertiary uppercase tracking-wider">关于</span>
            <a href="https://github.com/gituptim/resume-craft" target="_blank" rel="noopener noreferrer" className="text-small text-ink-secondary hover:text-ink-primary transition-colors duration-150">GitHub</a>
            <span className="text-small text-ink-secondary cursor-default">反馈建议</span>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-micro text-ink-tertiary">&copy; 2025 ResuMe. All rights reserved.</p>
      </div>
    </motion.footer>
  )
}

/* ───────────────────── main page ───────────────────── */

export default function Landing() {
  return (
    <div className="min-h-[100dvh] w-full bg-paper">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <TemplateShowcase />
      <HowItWorks />
      <Footer />
    </div>
  )
}
