import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useResume } from '@/context/ResumeContext'
import { templateList } from '@/templates'
import type { TemplateType } from '@/types/resume'

/* ───────────────────── animation helpers ───────────────────── */

const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeSmooth, delay },
  },
})

const staggerContainer = (stagger = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
})

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeSmooth },
  },
}

/* ───────────────────── data ───────────────────── */

interface TemplateInfo {
  id: TemplateType
  name: string
  description: string
  detailDesc: string
  tags: string[]
  thumb: string
}

const templateDetailData: Record<string, { detailDesc: string; tags: string[] }> = {
  classic: { detailDesc: '传统单栏排版，稳重大气。适合国企、金融、法律等传统行业。', tags: ['单栏', '稳重大气', '通用'] },
  modern: { detailDesc: '双栏布局，信息密度高。适合互联网、科技、设计等行业。', tags: ['双栏', '现代感', '高效'] },
  minimal: { detailDesc: '极致简约，以少胜多。适合创意行业、艺术、自由职业者。', tags: ['极简', '留白', '创意'] },
  creative: { detailDesc: '非对称设计，视觉冲击力强。适合设计、营销、初创公司。', tags: ['非对称', '视觉冲击', '个性'] },
  elegant: { detailDesc: '优雅学术风，温暖色调与精致排版。适合学术、教育、研究岗位。', tags: ['双栏', '学术风', '优雅'] },
  tech: { detailDesc: '科技现代风，深色顶部栏与左侧竖线分隔。适合工程师、技术岗位。', tags: ['科技风', '深色栏', '现代'] },
  timeline: { detailDesc: '时间线设计，强调职业发展轨迹。适合有清晰晋升路径的求职者。', tags: ['时间线', '轨迹', '进阶'] },
  compact: { detailDesc: '紧凑高效，极小边距最大化内容密度。适合经历丰富的资深人士。', tags: ['紧凑', '高密度', '资深'] },
}

const templateData: TemplateInfo[] = templateList.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  detailDesc: templateDetailData[t.id]?.detailDesc || t.description,
  tags: templateDetailData[t.id]?.tags || [],
  thumb: t.thumbnail,
}))

/* ───────────────────── sub-components ───────────────────── */

/** Simplified TopBar */
function SimplifiedTopBar() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: easeSmooth }}
      className="h-14 sticky top-0 z-50 flex items-center justify-between px-4 bg-surface border-b border-divider-faint"
    >
      {/* Brand */}
      <Link to="/welcome" className="flex items-center gap-0 select-none">
        <span className="text-headline font-serif text-ink-primary tracking-tight">Resu</span>
        <span className="text-headline font-serif text-ink-primary tracking-tight relative">
          Me
          <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-themeaccent" />
        </span>
      </Link>

      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-body text-ink-secondary hover:bg-surface-highlight hover:text-ink-primary transition-all duration-150"
      >
        <ArrowLeft className="w-4 h-4" />
        返回编辑器
      </Link>
    </motion.header>
  )
}

/** Template Card */
function TemplateCard({ template }: { template: TemplateInfo }) {
  const navigate = useNavigate()
  const { dispatch } = useResume()

  const handleUseTemplate = () => {
    dispatch({ type: 'SET_TEMPLATE', payload: template.id })
    navigate('/')
  }

  return (
    <motion.div
      variants={cardReveal}
      className="group flex flex-col bg-surface rounded-xl border border-divider-faint shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 hover:border-themeaccent transition-all duration-250 ease-out"
    >
      {/* Preview Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white border-b border-divider-faint">
        <img
          src={template.thumb}
          alt={template.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
        />
      </div>

      {/* Info Area */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-headline font-semibold text-ink-primary">{template.name}</h3>
        <p className="text-body text-ink-secondary mt-1 line-clamp-2">{template.detailDesc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="text-micro text-ink-secondary bg-surface-highlight rounded px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleUseTemplate}
          className="mt-3 w-full inline-flex items-center justify-center py-2.5 rounded-lg bg-themeaccent text-white text-body font-medium hover:bg-themeaccent-hover active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-themeaccent focus:ring-offset-1"
        >
          使用此模板
        </button>
      </div>
    </motion.div>
  )
}

/** Comparison Section */
function ComparisonSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const comparisons = [
    { name: '经典商务', bestFor: '国企、金融、法律', strengths: '稳重大气、通用性强' },
    { name: '现代简约', bestFor: '互联网、科技、设计', strengths: '信息高效、现代感' },
    { name: '极简留白', bestFor: '创意行业、艺术', strengths: '简约纯粹、呼吸感' },
    { name: '创意个性', bestFor: '设计、营销、初创', strengths: '视觉冲击、差异化' },
    { name: '优雅学术', bestFor: '学术、教育、研究', strengths: '温暖色调、精致排版' },
    { name: '科技现代', bestFor: '工程师、技术岗位', strengths: '深色栏、专业感' },
    { name: '时间轨迹', bestFor: '有晋升路径的求职者', strengths: '时间线、发展轨迹' },
    { name: '紧凑高效', bestFor: '经历丰富的资深人士', strengths: '高密度、内容极多' },
  ]

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: easeSmooth }}
      className="py-10 px-4 sm:px-6 bg-surface border-t border-divider-faint"
    >
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-display font-serif text-ink-primary text-center mb-8">模板对比</h2>

        {/* Desktop: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-divider">
                <th className="text-left py-3 px-4 text-small text-ink-secondary font-medium">模板</th>
                <th className="text-left py-3 px-4 text-small text-ink-secondary font-medium">适用场景</th>
                <th className="text-left py-3 px-4 text-small text-ink-secondary font-medium">核心优势</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c, i) => (
                <tr
                  key={c.name}
                  className={`border-b border-divider-faint ${i % 2 === 0 ? 'bg-paper/50' : ''}`}
                >
                  <td className="py-3 px-4 text-body font-medium text-ink-primary">{c.name}</td>
                  <td className="py-3 px-4 text-body text-ink-secondary">{c.bestFor}</td>
                  <td className="py-3 px-4 text-body text-ink-secondary">{c.strengths}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card List */}
        <div className="sm:hidden flex flex-col gap-3">
          {comparisons.map((c, i) => (
            <div
              key={c.name}
              className={`rounded-lg border border-divider-faint p-4 ${i % 2 === 0 ? 'bg-paper/50' : 'bg-surface'}`}
            >
              <div className="text-body font-medium text-ink-primary">{c.name}</div>
              <div className="mt-2">
                <span className="text-micro text-ink-tertiary">适用场景：</span>
                <span className="text-small text-ink-secondary">{c.bestFor}</span>
              </div>
              <div className="mt-1">
                <span className="text-micro text-ink-tertiary">核心优势：</span>
                <span className="text-small text-ink-secondary">{c.strengths}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

/** Footer */
function Footer() {
  return (
    <footer className="border-t border-divider-faint bg-paper py-6 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/welcome" className="flex items-center gap-0 select-none">
          <span className="text-body font-serif font-semibold text-ink-primary tracking-tight">Resu</span>
          <span className="text-body font-serif font-semibold text-ink-primary tracking-tight relative">
            Me
            <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-themeaccent" />
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-small text-ink-secondary hover:text-ink-primary transition-colors duration-150">编辑器</Link>
          <Link to="/welcome" className="text-small text-ink-secondary hover:text-ink-primary transition-colors duration-150">关于</Link>
          <a href="https://github.com/gituptim/resume-craft" target="_blank" rel="noopener noreferrer" className="text-small text-ink-secondary hover:text-ink-primary transition-colors duration-150">GitHub</a>
        </div>

        <p className="text-micro text-ink-tertiary">&copy; 2025 ResuMe</p>
      </div>
    </footer>
  )
}

/* ───────────────────── main page ───────────────────── */

export default function Templates() {
  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })
  const gridInView = useInView(gridRef, { once: true, margin: '-80px' })

  return (
    <div className="min-h-[100dvh] w-full bg-paper flex flex-col">
      <SimplifiedTopBar />

      {/* Page Header */}
      <section className="pt-10 pb-0 px-4 sm:px-6">
        <div ref={headerRef} className="max-w-[1200px] mx-auto">
          <motion.h1
            variants={fadeUp(0)}
            initial="hidden"
            animate={headerInView ? 'visible' : 'hidden'}
            className="text-hero font-serif text-ink-primary"
          >
            模板库
          </motion.h1>
          <motion.p
            variants={fadeUp(0.1)}
            initial="hidden"
            animate={headerInView ? 'visible' : 'hidden'}
            className="text-body text-ink-secondary mt-3 mb-8"
          >
            每一款模板都经过排版推敲，找到最能展现你职业故事的那一款
          </motion.p>
        </div>
      </section>

      {/* Template Cards Grid */}
      <section className="pb-12 px-4 sm:px-6">
        <motion.div
          ref={gridRef}
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {templateData.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </motion.div>

        {/* Compare Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="max-w-[1200px] mx-auto mt-8 flex items-center justify-center gap-1.5 text-small text-ink-tertiary"
        >
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-ink-secondary transition-colors duration-150">
            不确定选哪个？进入编辑器后随时可以切换模板，内容不会丢失
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </section>

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
