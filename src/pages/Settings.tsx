import { useState, useRef, useCallback } from 'react'
import {
  Database,
  Monitor,
  Keyboard,
  Info,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  X,
  ArrowUpRight,
  Github,
  FileJson,
} from 'lucide-react'
import { useResume } from '@/context/ResumeContext'
import { useToast } from '@/hooks/useToast'
import ConfirmDialog from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { ResumeData } from '@/types/resume'

/* ─── Settings Page ─── */
export default function Settings() {
  return (
    <div className="flex-1 overflow-y-auto bg-paper">
      <div className="max-w-[720px] mx-auto pt-10 pb-16 px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-display font-serif text-ink-primary tracking-tight">
            设置
          </h1>
          <p className="text-body text-ink-secondary mt-2">
            管理你的简历数据和偏好
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-6">
          <DataManagementSection />
          <DisplayPreferencesSection />
          <KeyboardShortcutsSection />
          <AboutSection />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   Section 1: Data Management
   ═══════════════════════════════════════ */

function DataManagementSection() {
  const { state, dispatch } = useResume()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importData, setImportData] = useState<ResumeData | null>(null)

  // ── Export JSON ──
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(state.data, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    a.href = url
    a.download = `resume-data-${timestamp}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast({ message: '数据导出成功', type: 'success' })
  }, [state.data, showToast])

  // ── Import: parse & validate ──
  const parseAndValidateJSON = useCallback((content: string): ResumeData | null => {
    try {
      const parsed = JSON.parse(content) as ResumeData
      // Validate required fields
      if (!parsed || typeof parsed !== 'object') return null
      if (!parsed.personal || typeof parsed.personal !== 'object') return null
      if (!Array.isArray(parsed.experience)) return null
      if (!Array.isArray(parsed.education)) return null
      if (!Array.isArray(parsed.skills)) return null
      if (!Array.isArray(parsed.projects)) return null
      if (!Array.isArray(parsed.customSections)) return null
      if (!Array.isArray(parsed.sectionOrder)) return null
      return parsed
    } catch {
      return null
    }
  }, [])

  // ── Import: file selected ──
  const handleFileSelected = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const validated = parseAndValidateJSON(content)
      if (validated) {
        setImportData(validated)
        setImportDialogOpen(true)
      } else {
        showToast({ message: '文件格式无效，请导入有效的简历数据文件', type: 'error' })
      }
    }
    reader.onerror = () => {
      showToast({ message: '文件读取失败', type: 'error' })
    }
    reader.readAsText(file)
  }, [parseAndValidateJSON, showToast])

  // ── Import: confirm overwrite ──
  const handleConfirmImport = useCallback(() => {
    if (importData) {
      dispatch({ type: 'LOAD_DATA', payload: importData })
      showToast({ message: '数据导入成功', type: 'success' })
      setImportData(null)
      setSelectedFile(null)
    }
  }, [importData, dispatch, showToast])

  // ── File input change ──
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleFileSelected(file)
    }
  }, [handleFileSelected])

  // ── Drag & drop handlers ──
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.name.endsWith('.json')) {
      setSelectedFile(file)
      handleFileSelected(file)
    } else {
      showToast({ message: '请上传 .json 格式的文件', type: 'error' })
    }
  }, [handleFileSelected, showToast])

  // ── Reset ──
  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_DATA' })
    showToast({ message: '数据已重置为默认值', type: 'success' })
  }, [dispatch, showToast])

  // ── Clear ──
  const handleClear = useCallback(() => {
    dispatch({
      type: 'LOAD_DATA',
      payload: {
        personal: { name: '', title: '', email: '', phone: '', location: '', website: '', customFields: [] },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        awards: [],
        customSections: [],
        sectionOrder: [
          { type: 'builtin', sectionType: 'summary' },
          { type: 'builtin', sectionType: 'experience' },
          { type: 'builtin', sectionType: 'education' },
          { type: 'builtin', sectionType: 'projects' },
          { type: 'builtin', sectionType: 'skills' },
        ],
        layout: { sectionSpacing: 10, bodyFontSize: 10, headingFontSize: 12, fontFamily: 'noto-serif' },
        skillDisplayMode: 'simple',
        skillsMarkdown: '',
      },
    })
    showToast({ message: '所有数据已清空', type: 'success' })
  }, [dispatch, showToast])

  return (
    <section className="bg-surface rounded-xl border border-divider-faint shadow-sm p-6">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <Database className="w-5 h-5 text-ink-tertiary" />
        <h2 className="text-headline font-semibold text-ink-primary">数据管理</h2>
      </div>

      {/* Export */}
      <div>
        <h3 className="text-body font-semibold text-ink-primary">数据导出</h3>
        <p className="text-body text-ink-secondary mt-2">
          将你的简历数据导出为 JSON 文件，作为备份或在其他设备上恢复。
        </p>
        <Button
          variant="outline"
          onClick={handleExport}
          className="mt-4 h-9 px-4 rounded-lg border-divider bg-surface text-ink-primary hover:bg-surface-highlight hover:border-ink-tertiary text-sm font-medium transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-1.5" />
          导出 JSON
        </Button>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-divider" />

      {/* Import */}
      <div>
        <h3 className="text-body font-semibold text-ink-primary">数据导入</h3>
        <p className="text-body text-ink-secondary mt-2">
          从之前导出的 JSON 文件恢复简历数据。导入将覆盖当前所有数据，请谨慎操作。
        </p>

        {/* File Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-4 rounded-[10px] border border-dashed p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-themeaccent bg-[#FEF3C7]/30 shadow-glow'
              : 'border-divider bg-surface-highlight hover:border-themeaccent hover:bg-[#FEF3C7]/30'
          }`}
        >
          <Upload className="w-8 h-8 text-ink-tertiary" />
          <p className="text-body text-ink-secondary text-center">
            点击选择文件或拖拽到此处
          </p>
          <p className="text-micro text-ink-tertiary">支持 .json 格式</p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Selected file indicator */}
        {selectedFile && (
          <div className="mt-3 flex items-center gap-2 text-body text-ink-primary">
            <FileJson className="w-4 h-4 text-themeaccent" />
            <span className="text-sm">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="ml-1 p-0.5 rounded hover:bg-surface-highlight text-ink-tertiary hover:text-ink-primary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="mt-8 pt-6 border-t border-danger/30">
        <h3 className="text-body font-semibold text-danger">危险操作</h3>
        <p className="text-body text-ink-secondary mt-2">
          清除所有本地存储的简历数据，此操作不可撤销。
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setResetDialogOpen(true)}
            className="h-9 px-4 rounded-lg border-divider bg-transparent text-ink-secondary hover:bg-surface-highlight hover:text-ink-primary text-sm font-medium transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            重置数据
          </Button>
          <Button
            variant="outline"
            onClick={() => setClearDialogOpen(true)}
            className="h-9 px-4 rounded-lg border-danger/50 bg-transparent text-danger hover:bg-danger-bg hover:text-danger text-sm font-medium transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            清空数据
          </Button>
        </div>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="重置数据"
        message="确定要重置为默认数据吗？当前数据将丢失。"
        confirmText="确认重置"
        variant="danger"
        onConfirm={handleReset}
      />
      <ConfirmDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        title="清空数据"
        message="确定要清空所有数据吗？此操作不可撤销。"
        confirmText="确认清除"
        variant="danger"
        onConfirm={handleClear}
      />
      <ConfirmDialog
        open={importDialogOpen}
        onOpenChange={(open) => {
          setImportDialogOpen(open)
          if (!open) {
            setImportData(null)
            setSelectedFile(null)
          }
        }}
        title="导入数据"
        message="导入将覆盖当前所有简历数据，是否继续？"
        confirmText="确认导入"
        variant="primary"
        onConfirm={handleConfirmImport}
      />
    </section>
  )
}

/* ═══════════════════════════════════════
   Section 2: Display Preferences
   ═══════════════════════════════════════ */

function DisplayPreferencesSection() {
  const [previewScale, setPreviewScale] = useState<'fit' | '100%' | '150%'>('fit')
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')

  return (
    <section className="bg-surface rounded-xl border border-divider-faint shadow-sm p-6">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <Monitor className="w-5 h-5 text-ink-tertiary" />
        <h2 className="text-headline font-semibold text-ink-primary">显示偏好</h2>
      </div>

      {/* Preview Scale */}
      <div>
        <h3 className="text-body font-semibold text-ink-primary">预览缩放</h3>
        <p className="text-small text-ink-tertiary mt-1">调整简历预览的显示比例</p>
        <div className="mt-3 flex items-center gap-1 p-1 rounded-[10px] bg-surface-highlight w-fit">
          {([
            { key: 'fit', label: '适应屏幕' },
            { key: '100%', label: '实际大小' },
            { key: '150%', label: '放大' },
          ] as const).map((item) => (
            <button
              key={item.key}
              onClick={() => setPreviewScale(item.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                previewScale === item.key
                  ? 'bg-surface text-ink-primary shadow-sm'
                  : 'text-ink-tertiary hover:text-ink-secondary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-divider" />

      {/* Animation Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-body font-semibold text-ink-primary">动画效果</h3>
          <p className="text-small text-ink-tertiary mt-1">启用动画可提升使用体验</p>
        </div>
        <Switch
          checked={animationsEnabled}
          onCheckedChange={setAnimationsEnabled}
          className="data-[state=checked]:bg-themeaccent"
        />
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-divider" />

      {/* Font Size */}
      <div>
        <h3 className="text-body font-semibold text-ink-primary">字号偏好</h3>
        <p className="text-small text-ink-tertiary mt-1">调整编辑器界面字体大小</p>
        <div className="mt-3 flex items-center gap-1 p-1 rounded-[10px] bg-surface-highlight w-fit">
          {([
            { key: 'small', label: '小' },
            { key: 'medium', label: '中' },
            { key: 'large', label: '大' },
          ] as const).map((item) => (
            <button
              key={item.key}
              onClick={() => setFontSize(item.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                fontSize === item.key
                  ? 'bg-surface text-ink-primary shadow-sm'
                  : 'text-ink-tertiary hover:text-ink-secondary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════
   Section 3: Keyboard Shortcuts
   ═══════════════════════════════════════ */

const shortcuts = [
  { keys: ['Ctrl/Cmd', 'S'], action: '保存简历' },
  { keys: ['Ctrl/Cmd', 'P'], action: '导出 PDF' },
  { keys: ['Ctrl/Cmd', 'T'], action: '切换模板' },
  { keys: ['Escape'], action: '关闭弹窗/抽屉' },
]

const sectionShortcuts = [
  { keys: ['Ctrl/Cmd', '1'], action: '个人信息' },
  { keys: ['Ctrl/Cmd', '2'], action: '求职意向' },
  { keys: ['Ctrl/Cmd', '3'], action: '教育背景' },
  { keys: ['Ctrl/Cmd', '4'], action: '工作经历' },
  { keys: ['Ctrl/Cmd', '5'], action: '项目经历' },
  { keys: ['Ctrl/Cmd', '6'], action: '技能特长' },
  { keys: ['Ctrl/Cmd', '7'], action: '荣誉证书' },
  { keys: ['Ctrl/Cmd', '8'], action: '自我评价' },
]

function KeyboardShortcutsSection() {
  return (
    <section className="bg-surface rounded-xl border border-divider-faint shadow-sm p-6">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <Keyboard className="w-5 h-5 text-ink-tertiary" />
        <h2 className="text-headline font-semibold text-ink-primary">快捷键</h2>
      </div>

      <div>
        <h3 className="text-body font-semibold text-ink-primary">键盘快捷键</h3>
        <p className="text-small text-ink-tertiary mt-1">
          在编辑器中可用的快捷键，提升编辑效率
        </p>

        {/* Global shortcuts */}
        <ShortcutsTable shortcuts={shortcuts} />

        {/* Section label */}
        <div className="mt-4 mb-2">
          <span className="text-micro text-themeaccent uppercase tracking-[0.06em]">
            板块跳转
          </span>
        </div>
        <ShortcutsTable shortcuts={sectionShortcuts} />
      </div>
    </section>
  )
}

function ShortcutsTable({ shortcuts }: { shortcuts: { keys: string[]; action: string }[] }) {
  return (
    <div className="mt-2">
      {shortcuts.map((shortcut, index) => (
        <div
          key={shortcut.action}
          className={`flex items-center justify-between h-11 px-3 rounded-md ${
            index % 2 === 1 ? 'bg-surface-highlight/50' : ''
          }`}
        >
          <div className="flex items-center gap-1">
            {shortcut.keys.map((key, kidx) => (
              <span key={kidx} className="flex items-center gap-1">
                <kbd className="inline-flex items-center px-2 py-0.5 rounded text-small font-mono bg-ink-primary text-white">
                  {key}
                </kbd>
                {kidx < shortcut.keys.length - 1 && (
                  <span className="text-ink-tertiary text-xs mx-0.5">+</span>
                )}
              </span>
            ))}
          </div>
          <span className="text-body text-ink-secondary">{shortcut.action}</span>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════
   Section 4: About
   ═══════════════════════════════════════ */

const techStack = ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Vite', 'Lucide Icons']

function AboutSection() {
  return (
    <section className="bg-surface rounded-xl border border-divider-faint shadow-sm p-6">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <Info className="w-5 h-5 text-ink-tertiary" />
        <h2 className="text-headline font-semibold text-ink-primary">关于 ResuMe</h2>
      </div>

      {/* Brand Info */}
      <div className="flex items-center gap-4">
        <img
          src="./brand-mark.svg"
          alt="ResuMe"
          className="w-12 h-12"
        />
        <div>
          <h3 className="text-display font-serif text-ink-primary tracking-tight">
            ResuMe
          </h3>
          <p className="text-small text-ink-tertiary mt-1">v1.0.0</p>
        </div>
      </div>

      <p className="text-body text-ink-secondary mt-4 max-w-[480px] leading-[1.7]">
        一款简约风格的简历制作工具，帮助你轻松创建专业的个人简历。
      </p>

      {/* Divider */}
      <div className="my-5 border-t border-divider" />

      {/* Links */}
      <div>
        <h3 className="text-body font-semibold text-ink-primary">相关链接</h3>
        <div className="mt-3 flex flex-col gap-2">
          <a
            href="https://github.com/gituptim/resume-craft"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-body text-themeaccent hover:underline transition-all duration-150 w-fit"
          >
            <Github className="w-4 h-4" />
            GitHub
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-body text-themeaccent hover:underline transition-all duration-150 w-fit"
          >
            反馈建议
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-divider" />

      {/* Tech Stack */}
      <div>
        <h3 className="text-body font-semibold text-ink-primary">技术栈</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-3 py-1 rounded-full bg-surface-highlight text-ink-secondary text-small font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-divider" />

      {/* Copyright */}
      <p className="text-small text-ink-tertiary">
        © 2026 ResuMe. All rights reserved.
      </p>
    </section>
  )
}
