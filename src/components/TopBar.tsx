import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Download, Settings } from 'lucide-react'
import { useResume } from '@/context/ResumeContext'
import { TEMPLATE_NAMES } from '@/types/resume'
import type { TemplateType } from '@/types/resume'

export default function TopBar() {
  const { state } = useResume()
  const location = useLocation()
  const isSettingsPage = location.pathname === '/settings'
  const isLandingPage = location.pathname === '/welcome'
  const isTemplatesPage = location.pathname === '/templates'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const templateName = TEMPLATE_NAMES[state.currentTemplate as TemplateType] || '经典商务模板'

  const handleExportPDF = () => {
    window.print()
  }

  if (isLandingPage || isTemplatesPage) {
    return null
  }

  return (
    <header
      className={`topbar no-print h-14 sticky top-0 z-50 flex items-center justify-between px-4 bg-surface border-b border-divider-faint transition-shadow duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      {/* Left: Brand */}
      <Link to="/" className="flex items-center gap-0 select-none">
        <span className="text-headline font-serif text-ink-primary tracking-tight">
          Resu
        </span>
        <span className="text-headline font-serif text-ink-primary tracking-tight relative">
          Me
          <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-themeaccent" />
        </span>
      </Link>

      {/* Center: Template name — hidden on settings */}
      {!isSettingsPage && (
        <span className="hidden sm:block text-small text-ink-tertiary">
          {templateName}模板
        </span>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {!isSettingsPage && (
          <button
            onClick={handleExportPDF}
            className="ghost-btn flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-ink-secondary hover:bg-surface-highlight hover:text-ink-primary transition-all duration-150"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">导出 PDF</span>
          </button>
        )}
        <Link
          to="/settings"
          className="ghost-btn flex items-center justify-center w-9 h-9 rounded-lg text-ink-secondary hover:bg-surface-highlight hover:text-ink-primary transition-all duration-150"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  )
}
