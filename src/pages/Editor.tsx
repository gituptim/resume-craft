import { useState, useCallback, useRef, useEffect } from 'react'
import {
  X, Plus, GripVertical, Trash2, Check,
  Sparkles, Layout, Menu,
  List, FileText,
} from 'lucide-react'
import { useResume } from '@/context/ResumeContext'
import { templates, templateList } from '@/templates'
import type {
  Experience, Education, Project, Award, TemplateType,
  CustomSection, CustomSectionItem, LayoutSettings,
} from '@/types/resume'
import { cn } from '@/lib/utils'
import SidebarNav from '@/components/SidebarNav'
import MultiPagePreview from '@/components/MultiPagePreview'

/* ─────────────────────── types ─────────────────────── */
type DrawerType = 'personal' | 'summary' | 'education' | 'experience' | 'projects' | 'skills' | 'awards' | 'custom' | 'layout' | null

let idCounter = 0
function uid(prefix: string) {
  return `${prefix}-${++idCounter}-${Date.now().toString(36)}`
}

function drawerLabel(type: DrawerType): string {
  switch (type) {
    case 'personal': return '个人信息'
    case 'summary': return '个人简介'
    case 'education': return '教育背景'
    case 'experience': return '工作经历'
    case 'projects': return '项目经历'
    case 'skills': return '技能特长'
    case 'awards': return '荣誉证书'
    case 'custom': return '自定义板块'
    case 'layout': return '排版设置'
    default: return ''
  }
}

/* ═══════════════════ EDITOR PAGE ═══════════════════ */
export default function Editor() {
  const { state, dispatch } = useResume()
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState<TemplateType>(state.currentTemplate)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  const data = state.data
  const TemplateComponent = templates[state.currentTemplate] || templates.classic

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDrawer(null)
        setShowTemplateModal(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault()
        window.print()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const openDrawer = useCallback((type: DrawerType) => setActiveDrawer(type), [])
  const closeDrawer = useCallback(() => setActiveDrawer(null), [])

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* ─────────── Sidebar ─────────── */}
      <SidebarNav activeDrawer={activeDrawer} onOpenDrawer={(d) => openDrawer(d as DrawerType)} />

      {/* ─────────── Mobile Sidebar Toggle ─────────── */}
      <div className="no-print fixed top-[60px] left-4 z-30 md:hidden">
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="w-10 h-10 bg-surface border border-divider-faint rounded-full shadow-md flex items-center justify-center text-ink-secondary hover:text-ink-primary transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ─────────── Preview Pane ─────────── */}
      <MultiPagePreview>
        <TemplateComponent data={data} />
      </MultiPagePreview>

      {/* ─────────── Section Drawers ─────────── */}
      {activeDrawer && (
        <>
          <div
            className="drawer-backdrop no-print fixed inset-0 bg-ink-primary/[0.15] z-[60] transition-opacity duration-200"
            onClick={closeDrawer}
          />
          <div
            ref={drawerRef}
            className={cn(
              'section-drawer no-print fixed top-0 right-0 z-[60] bg-surface shadow-lg',
              'w-full sm:w-[420px] h-full flex flex-col',
              'transform transition-transform duration-350 ease-smooth'
            )}
            style={{ transform: 'translateX(0)' }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-divider shrink-0">
              <h2 className="text-display text-[1.25rem] font-semibold text-ink-primary">
                {drawerLabel(activeDrawer)}
              </h2>
              <button
                onClick={closeDrawer}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:bg-surface-highlight hover:text-ink-primary transition-all duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeDrawer === 'personal' && <PersonalInfoDrawer />}
              {activeDrawer === 'summary' && <SummaryDrawer />}
              {activeDrawer === 'education' && <EducationDrawer />}
              {activeDrawer === 'experience' && <ExperienceDrawer />}
              {activeDrawer === 'projects' && <ProjectsDrawer />}
              {activeDrawer === 'skills' && <SkillsDrawer />}
              {activeDrawer === 'awards' && <AwardsDrawer />}
              {activeDrawer === 'custom' && <CustomSectionsDrawer />}
              {activeDrawer === 'layout' && <LayoutDrawer />}
            </div>

            {/* Drawer Footer */}
            <div className="shrink-0 px-5 py-4 border-t border-divider-faint flex gap-3">
              <button
                onClick={closeDrawer}
                className="flex-1 h-10 bg-themeaccent text-white rounded-lg text-sm font-medium hover:bg-themeaccent-hover transition-colors duration-200 active:scale-[0.98]"
              >
                保存
              </button>
              <button
                onClick={closeDrawer}
                className="flex-1 h-10 bg-surface text-ink-primary border border-divider rounded-lg text-sm font-medium hover:bg-surface-highlight hover:border-ink-tertiary transition-all duration-200"
              >
                取消
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─────────── Template Selection Modal ─────────── */}
      {showTemplateModal && (
        <>
          <div
            className="modal-backdrop no-print fixed inset-0 bg-ink-primary/[0.2] z-[70] transition-opacity duration-200"
            onClick={() => setShowTemplateModal(false)}
          />
          <div className="no-print fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-surface rounded-2xl shadow-lg max-w-[720px] w-full max-h-[80vh] flex flex-col pointer-events-auto">
              <div className="flex items-center justify-between px-6 h-14 border-b border-divider shrink-0">
                <h2 className="text-display text-[1.25rem] font-semibold text-ink-primary">选择模板</h2>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:bg-surface-highlight hover:text-ink-primary transition-all duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid grid-cols-2 gap-4">
                  {templateList.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setPendingTemplate(tmpl.id)}
                      className={cn(
                        'text-left rounded-xl border-2 overflow-hidden transition-all duration-200 ease-out hover:scale-[1.02]',
                        pendingTemplate === tmpl.id
                          ? 'border-themeaccent bg-themeaccent-light/30'
                          : 'border-divider-faint hover:border-divider'
                      )}
                    >
                      <div className="aspect-video relative bg-surface-highlight">
                        <img
                          src={tmpl.thumbnail}
                          alt={tmpl.name}
                          className="w-full h-full object-cover"
                        />
                        {pendingTemplate === tmpl.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-themeaccent-light/30">
                            <div className="w-8 h-8 rounded-full bg-themeaccent flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-small font-medium text-ink-primary">{tmpl.name}</p>
                        <p className="text-micro text-ink-tertiary mt-0.5">{tmpl.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="shrink-0 px-5 py-4 border-t border-divider-faint flex gap-3 justify-end">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="h-10 px-5 bg-surface text-ink-primary border border-divider rounded-lg text-sm font-medium hover:bg-surface-highlight hover:border-ink-tertiary transition-all duration-200"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_TEMPLATE', payload: pendingTemplate })
                    setShowTemplateModal(false)
                  }}
                  disabled={pendingTemplate === state.currentTemplate}
                  className="h-10 px-5 bg-themeaccent text-white rounded-lg text-sm font-medium hover:bg-themeaccent-hover transition-colors duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  确认选择
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─────────── Mobile Sidebar Overlay ─────────── */}
      {showMobileSidebar && (
        <>
          <div
            className="no-print fixed inset-0 bg-ink-primary/[0.15] z-[55] md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="no-print fixed top-0 left-0 z-[55] w-[260px] h-full bg-surface shadow-lg md:hidden">
            <div className="flex items-center justify-between px-4 h-14 border-b border-divider">
              <span className="text-sm font-medium text-ink-primary">编辑模块</span>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:bg-surface-highlight hover:text-ink-primary transition-all duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav activeDrawer={activeDrawer} onOpenDrawer={(d) => {
                openDrawer(d as DrawerType)
                setShowMobileSidebar(false)
              }} />
            </div>
          </div>
        </>
      )}

      {/* ─────────── Floating Buttons ─────────── */}
      <div className="no-print fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        {/* Layout Settings Button */}
        <button
          onClick={() => {
            setPendingTemplate(state.currentTemplate)
            openDrawer('layout')
          }}
          className="flex items-center gap-2 px-4 h-10 bg-surface border border-divider-faint rounded-full shadow-md text-sm font-medium text-ink-secondary hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <Layout className="w-4 h-4 text-themeaccent" />
          排版设置
        </button>
        {/* Template Switch Button */}
        <button
          onClick={() => {
            setPendingTemplate(state.currentTemplate)
            setShowTemplateModal(true)
          }}
          className="flex items-center gap-2 px-4 h-10 bg-surface border border-divider-faint rounded-full shadow-md text-sm font-medium text-ink-secondary hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4 text-themeaccent" />
          切换模板
        </button>
      </div>
    </div>
  )
}

/* ═══════════════ DRAWER COMPONENTS ═══════════════ */

function PersonalInfoDrawer() {
  const { state, dispatch } = useResume()
  const p = state.data.personal

  const update = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_PERSONAL', payload: { [field]: value } })
  }

  const addField = () => {
    dispatch({
      type: 'ADD_PERSONAL_FIELD',
      payload: { id: uid('cf'), label: '', value: '' },
    })
  }

  const updateField = (field: { id: string; label: string; value: string }) => {
    dispatch({ type: 'UPDATE_PERSONAL_FIELD', payload: field })
  }

  const removeField = (id: string) => {
    dispatch({ type: 'REMOVE_PERSONAL_FIELD', payload: id })
  }

  return (
    <div className="space-y-4">
      <TextField label="姓名" value={p.name} onChange={(v) => update('name', v)} placeholder="请输入姓名" />
      <TextField label="求职意向" value={p.title} onChange={(v) => update('title', v)} placeholder="目标职位，如：产品经理" />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="手机号码" value={p.phone} onChange={(v) => update('phone', v)} placeholder="138 0000 0000" />
        <TextField label="电子邮箱" value={p.email} onChange={(v) => update('email', v)} placeholder="your@email.com" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="所在城市" value={p.location} onChange={(v) => update('location', v)} placeholder="如：北京" />
        <TextField label="个人网站" value={p.website || ''} onChange={(v) => update('website', v)} placeholder="https://your-website.com" />
      </div>

      {/* Custom Fields */}
      <div className="border-t border-divider-faint pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-ink-primary">自定义字段</label>
        </div>
        {p.customFields.map((field) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input
              value={field.label}
              onChange={(e) => updateField({ ...field, label: e.target.value })}
              placeholder="字段名"
              className="w-[90px] h-9 px-2.5 bg-surface border border-divider-faint rounded-lg text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-themeaccent focus:shadow-glow transition-all duration-200"
            />
            <input
              value={field.value}
              onChange={(e) => updateField({ ...field, value: e.target.value })}
              placeholder="内容"
              className="flex-1 h-9 px-2.5 bg-surface border border-divider-faint rounded-lg text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-themeaccent focus:shadow-glow transition-all duration-200"
            />
            <button
              onClick={() => removeField(field.id)}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-ink-tertiary hover:text-danger hover:bg-danger-bg transition-all duration-150"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={addField}
          className="w-full h-9 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-themeaccent hover:bg-surface-highlight rounded-lg transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          添加自定义字段
        </button>
      </div>
    </div>
  )
}

function SummaryDrawer() {
  const { state, dispatch } = useResume()
  const value = state.data.summary
  const maxLen = 300

  return (
    <div className="space-y-4">
      <TextareaField
        label="个人简介"
        value={value}
        onChange={(v) => dispatch({ type: 'UPDATE_SUMMARY', payload: v })}
        placeholder="简要介绍你的专业背景和核心优势..."
        rows={8}
        maxLength={maxLen}
      />
      <button className="flex items-center gap-2 text-sm font-medium text-themeaccent hover:text-themeaccent-hover transition-colors duration-150">
        <Sparkles className="w-4 h-4" />
        AI 辅助生成
      </button>
    </div>
  )
}

function EducationDrawer() {
  const { state, dispatch } = useResume()
  const items = state.data.education

  const add = () => {
    if (items.length >= 5) return
    dispatch({
      type: 'ADD_EDUCATION',
      payload: { id: uid('edu'), school: '', degree: '', startDate: '', endDate: '' },
    })
  }

  const update = (item: Education) => dispatch({ type: 'UPDATE_EDUCATION', payload: item })
  const remove = (id: string) => dispatch({ type: 'REMOVE_EDUCATION', payload: id })

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <EntryCard key={item.id} onRemove={() => remove(item.id)} title={item.school || '新教育经历'}>
          <TextField label="学校名称" value={item.school} onChange={(v) => update({ ...item, school: v })} placeholder="如：北京大学" />
          <TextField label="专业" value={item.degree} onChange={(v) => update({ ...item, degree: v })} placeholder="如：计算机科学与技术" />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="开始时间" value={item.startDate} onChange={(v) => update({ ...item, startDate: v })} placeholder="2020.09" />
            <TextField label="结束时间" value={item.endDate} onChange={(v) => update({ ...item, endDate: v })} placeholder="2024.06" />
          </div>
        </EntryCard>
      ))}
      <button
        onClick={add}
        disabled={items.length >= 5}
        className="w-full h-10 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-themeaccent hover:bg-surface-highlight rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        添加教育经历
      </button>
    </div>
  )
}

function ExperienceDrawer() {
  const { state, dispatch } = useResume()
  const items = state.data.experience

  const add = () => {
    if (items.length >= 6) return
    dispatch({
      type: 'ADD_EXPERIENCE',
      payload: { id: uid('exp'), company: '', position: '', startDate: '', endDate: '', description: '' },
    })
  }

  const update = (item: Experience) => dispatch({ type: 'UPDATE_EXPERIENCE', payload: item })
  const remove = (id: string) => dispatch({ type: 'REMOVE_EXPERIENCE', payload: id })

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <EntryCard key={item.id} onRemove={() => remove(item.id)} title={item.company || '新工作经历'}>
          <TextField label="公司名称" value={item.company} onChange={(v) => update({ ...item, company: v })} placeholder="如：阿里巴巴" />
          <TextField label="职位名称" value={item.position} onChange={(v) => update({ ...item, position: v })} placeholder="如：高级前端工程师" />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="开始时间" value={item.startDate} onChange={(v) => update({ ...item, startDate: v })} placeholder="2022.03" />
            <TextField label="结束时间" value={item.endDate} onChange={(v) => update({ ...item, endDate: v })} placeholder="至今" />
          </div>
          <TextareaField
            label="工作描述"
            value={item.description}
            onChange={(v) => update({ ...item, description: v })}
            placeholder="描述你的工作职责和业绩成果..."
            rows={5}
            maxLength={500}
          />
        </EntryCard>
      ))}
      <button
        onClick={add}
        disabled={items.length >= 6}
        className="w-full h-10 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-themeaccent hover:bg-surface-highlight rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        添加工作经历
      </button>
    </div>
  )
}

function ProjectsDrawer() {
  const { state, dispatch } = useResume()
  const items = state.data.projects

  const add = () => {
    if (items.length >= 6) return
    dispatch({
      type: 'ADD_PROJECT',
      payload: { id: uid('proj'), name: '', description: '', link: '' },
    })
  }

  const update = (item: Project) => dispatch({ type: 'UPDATE_PROJECT', payload: item })
  const remove = (id: string) => dispatch({ type: 'REMOVE_PROJECT', payload: id })

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <EntryCard key={item.id} onRemove={() => remove(item.id)} title={item.name || '新项目经历'}>
          <TextField label="项目名称" value={item.name} onChange={(v) => update({ ...item, name: v })} placeholder="如：企业级后台管理系统" />
          <TextField label="项目链接" value={item.link || ''} onChange={(v) => update({ ...item, link: v })} placeholder="https://project-demo.com" />
          <TextareaField label="项目描述" value={item.description} onChange={(v) => update({ ...item, description: v })} placeholder="描述项目背景、你的贡献和技术栈..." rows={4} />
        </EntryCard>
      ))}
      <button
        onClick={add}
        disabled={items.length >= 6}
        className="w-full h-10 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-themeaccent hover:bg-surface-highlight rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        添加项目经历
      </button>
    </div>
  )
}

function SkillsDrawer() {
  const { state, dispatch } = useResume()
  const skills = state.data.skills
  const mode = state.data.skillDisplayMode
  const [tagInput, setTagInput] = useState('')

  const setMode = (m: 'simple' | 'detailed') => dispatch({ type: 'SET_SKILL_DISPLAY_MODE', payload: m })

  // ── Simple mode: tag input ──
  const addTags = (raw: string) => {
    const names = raw.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
    names.forEach((name) => {
      if (skills.length >= 20) return
      dispatch({
        type: 'ADD_SKILL',
        payload: { id: uid('skill'), name, description: '', level: 3, showLevel: false },
      })
    })
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!tagInput.trim()) return
      addTags(tagInput)
      setTagInput('')
    }
  }

  const handleTagBlur = () => {
    if (tagInput.trim()) {
      addTags(tagInput)
      setTagInput('')
    }
  }

  const removeTag = (id: string) => dispatch({ type: 'REMOVE_SKILL', payload: id })

  // ── Detailed mode: markdown textarea ──
  const updateMarkdown = (v: string) => dispatch({ type: 'UPDATE_SKILLS_MARKDOWN', payload: v })

  return (
    <div className="space-y-4">
      {/* Mode switcher */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setMode('simple')}
          className={cn(
            'flex-1 h-9 flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg border transition-all duration-150',
            mode === 'simple'
              ? 'border-themeaccent bg-themeaccent-light/30 text-themeaccent'
              : 'border-divider-faint text-ink-secondary hover:border-divider hover:text-ink-primary'
          )}
        >
          <List className="w-4 h-4" />
          简洁模式
        </button>
        <button
          onClick={() => setMode('detailed')}
          className={cn(
            'flex-1 h-9 flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg border transition-all duration-150',
            mode === 'detailed'
              ? 'border-themeaccent bg-themeaccent-light/30 text-themeaccent'
              : 'border-divider-faint text-ink-secondary hover:border-divider hover:text-ink-primary'
          )}
        >
          <FileText className="w-4 h-4" />
          详细模式
        </button>
      </div>

      {mode === 'simple' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-ink-primary mb-2">添加技能</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={handleTagBlur}
              placeholder="输入技能名称，按回车或逗号添加多个"
              className="w-full h-10 px-3.5 bg-surface border border-divider-faint rounded-lg text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-themeaccent focus:shadow-glow transition-all duration-200"
            />
            <p className="text-micro text-ink-tertiary mt-1.5">
              已添加 {skills.length}/20 个技能，按回车或逗号分隔批量添加
            </p>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-themeaccent-light text-themeaccent text-sm font-medium transition-all duration-150"
                >
                  {skill.name}
                  <button
                    onClick={() => removeTag(skill.id)}
                    className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-themeaccent/10 transition-colors"
                    title="删除"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {skills.length === 0 && (
            <div className="text-center py-6 text-ink-tertiary text-sm border border-dashed border-divider-faint rounded-lg">
              暂无技能，在上方输入框添加
            </div>
          )}
        </>
      ) : (
        <div>
          <label className="block text-sm font-medium text-ink-primary mb-2">技能描述（Markdown）</label>
          <textarea
            value={state.data.skillsMarkdown || ''}
            onChange={(e) => updateMarkdown(e.target.value)}
            placeholder={'## 前端开发\n- React — 5年经验，精通 Hooks、性能优化\n- Vue.js — 3年经验，熟悉 Vue3 Composition API\n- TypeScript — 类型安全开发\n\n## 后端开发\n- Node.js — Express/Nest.js 服务端开发\n- Python — 数据分析与脚本开发'}
            rows={16}
            className="w-full px-3.5 py-2.5 bg-surface border border-divider-faint rounded-lg text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-themeaccent focus:shadow-glow transition-all duration-200 resize-y min-h-[300px] font-mono leading-relaxed"
          />
          <p className="text-micro text-ink-tertiary mt-1.5">
            支持 Markdown 格式，简历中将保留换行和格式显示
          </p>
        </div>
      )}
    </div>
  )
}

function AwardsDrawer() {
  const { state, dispatch } = useResume()
  const items = state.data.awards

  const add = () => {
    if (items.length >= 10) return
    dispatch({
      type: 'ADD_AWARD',
      payload: { id: uid('award'), name: '', issuer: '', date: '', description: '' },
    })
  }

  const update = (item: Award) => dispatch({ type: 'UPDATE_AWARD', payload: item })
  const remove = (id: string) => dispatch({ type: 'REMOVE_AWARD', payload: id })

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <EntryCard key={item.id} onRemove={() => remove(item.id)} title={item.name || '新证书'}>
          <TextField label="证书名称" value={item.name} onChange={(v) => update({ ...item, name: v })} placeholder="如：AWS 认证解决方案架构师" />
          <TextField label="颁发机构" value={item.issuer} onChange={(v) => update({ ...item, issuer: v })} placeholder="如：Amazon Web Services" />
          <TextField label="获得时间" value={item.date} onChange={(v) => update({ ...item, date: v })} placeholder="2023-06" />
          <TextField label="证书描述" value={item.description || ''} onChange={(v) => update({ ...item, description: v })} placeholder="简要描述（可选）" />
        </EntryCard>
      ))}
      <button
        onClick={add}
        disabled={items.length >= 10}
        className="w-full h-10 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-themeaccent hover:bg-surface-highlight rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        添加证书
      </button>
    </div>
  )
}

function CustomSectionsDrawer() {
  const { state, dispatch } = useResume()
  const sections = state.data.customSections

  const addSection = () => {
    dispatch({
      type: 'ADD_CUSTOM_SECTION',
      payload: {
        id: uid('custom'),
        title: '新板块',
        items: [],
      },
    })
  }

  const updateSection = (section: CustomSection) => {
    dispatch({ type: 'UPDATE_CUSTOM_SECTION', payload: section })
  }

  const removeSection = (id: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_SECTION', payload: id })
  }

  const addItem = (section: CustomSection) => {
    const newItem: CustomSectionItem = {
      id: uid('item'),
      title: '',
      subtitle: '',
      startDate: '',
      endDate: '',
      description: '',
    }
    updateSection({ ...section, items: [...section.items, newItem] })
  }

  const updateItem = (section: CustomSection, item: CustomSectionItem) => {
    updateSection({
      ...section,
      items: section.items.map((i) => (i.id === item.id ? item : i)),
    })
  }

  const removeItem = (section: CustomSection, itemId: string) => {
    updateSection({
      ...section,
      items: section.items.filter((i) => i.id !== itemId),
    })
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <EntryCard
          key={section.id}
          onRemove={() => removeSection(section.id)}
          title={section.title || '未命名板块'}
        >
          {/* Section title */}
          <TextField
            label="板块标题"
            value={section.title}
            onChange={(v) => updateSection({ ...section, title: v })}
            placeholder="如：语言能力"
          />

          {/* Items */}
          <div className="space-y-3">
            {section.items.map((item) => (
              <div key={item.id} className="bg-surface-highlight/60 border border-divider-faint rounded-lg p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-ink-secondary">项目</span>
                  <button
                    onClick={() => removeItem(section, item.id)}
                    className="flex items-center justify-center w-6 h-6 rounded-md text-ink-tertiary hover:text-danger hover:bg-danger-bg transition-all duration-150"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <TextField
                  label="标题"
                  value={item.title}
                  onChange={(v) => updateItem(section, { ...item, title: v })}
                  placeholder="如：英语 - CET-6"
                />
                <TextField
                  label="副标题"
                  value={item.subtitle}
                  onChange={(v) => updateItem(section, { ...item, subtitle: v })}
                  placeholder="如：熟练"
                />
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="开始时间"
                    value={item.startDate}
                    onChange={(v) => updateItem(section, { ...item, startDate: v })}
                    placeholder="2020.01"
                  />
                  <TextField
                    label="结束时间"
                    value={item.endDate}
                    onChange={(v) => updateItem(section, { ...item, endDate: v })}
                    placeholder="至今"
                  />
                </div>
                <TextareaField
                  label="描述"
                  value={item.description}
                  onChange={(v) => updateItem(section, { ...item, description: v })}
                  placeholder="详细描述..."
                  rows={2}
                />
              </div>
            ))}
          </div>

          {/* Add item button */}
          <button
            onClick={() => addItem(section)}
            className="w-full h-9 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-themeaccent hover:bg-surface-highlight rounded-lg transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            添加项目
          </button>
        </EntryCard>
      ))}

      {/* Add section button */}
      <button
        onClick={addSection}
        className="w-full h-10 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-themeaccent hover:bg-surface-highlight rounded-lg transition-all duration-150"
      >
        <Plus className="w-4 h-4" />
        新建自定义板块
      </button>

      {sections.length === 0 && (
        <div className="text-center py-8 text-ink-tertiary text-sm">
          暂无自定义板块，点击上方按钮创建
        </div>
      )}
    </div>
  )
}

function LayoutDrawer() {
  const { state, dispatch } = useResume()
  const layout = state.data.layout

  const update = (partial: Partial<LayoutSettings>) => {
    dispatch({ type: 'UPDATE_LAYOUT', payload: partial })
  }

  return (
    <div className="space-y-8">
      {/* Section Spacing — Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-ink-primary">模块间距</label>
          <span className="text-micro text-ink-tertiary">{layout.sectionSpacing} mm</span>
        </div>
        <input
          type="range"
          min={4}
          max={16}
          step={1}
          value={layout.sectionSpacing}
          onChange={(e) => update({ sectionSpacing: Number(e.target.value) })}
          className="w-full h-1.5 bg-divider-faint rounded-full appearance-none cursor-pointer accent-themeaccent"
        />
        <div className="flex justify-between mt-1">
          <span className="text-micro text-ink-tertiary">紧凑</span>
          <span className="text-micro text-ink-tertiary">宽松</span>
        </div>
      </div>

      {/* Body Font Size — Slider with pt display */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-ink-primary">正文字号</label>
          <span className="text-micro text-ink-tertiary">{layout.bodyFontSize} pt</span>
        </div>
        <input
          type="range"
          min={8}
          max={13}
          step={0.5}
          value={layout.bodyFontSize}
          onChange={(e) => update({ bodyFontSize: Number(e.target.value) })}
          className="w-full h-1.5 bg-divider-faint rounded-full appearance-none cursor-pointer accent-themeaccent"
        />
        <div className="flex justify-between mt-1">
          <span className="text-micro text-ink-tertiary">8pt</span>
          <span className="text-micro text-ink-tertiary">13pt</span>
        </div>
      </div>

      {/* Heading Font Size — Slider with pt display */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-ink-primary">标题字号</label>
          <span className="text-micro text-ink-tertiary">{layout.headingFontSize} pt</span>
        </div>
        <input
          type="range"
          min={10}
          max={16}
          step={0.5}
          value={layout.headingFontSize}
          onChange={(e) => update({ headingFontSize: Number(e.target.value) })}
          className="w-full h-1.5 bg-divider-faint rounded-full appearance-none cursor-pointer accent-themeaccent"
        />
        <div className="flex justify-between mt-1">
          <span className="text-micro text-ink-tertiary">10pt</span>
          <span className="text-micro text-ink-tertiary">16pt</span>
        </div>
      </div>

      {/* Font Family Selection */}
      <div>
        <label className="block text-sm font-medium text-ink-primary mb-2.5">字体选择</label>
        <div className="flex flex-col gap-2">
          {([
            { value: 'noto-serif', label: '思源宋体 (Noto Serif)', sample: '优雅正式，适合学术/商务' },
            { value: 'noto-sans', label: '思源黑体 (Noto Sans)', sample: '清晰现代，适合科技/互联网' },
            { value: 'system', label: '系统默认', sample: '快速加载，通用兼容' },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ fontFamily: opt.value })}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200',
                layout.fontFamily === opt.value
                  ? 'border-themeaccent bg-themeaccent-light/40'
                  : 'border-divider-faint bg-surface hover:border-divider'
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                layout.fontFamily === opt.value ? 'border-themeaccent' : 'border-ink-tertiary'
              )}>
                {layout.fontFamily === opt.value && (
                  <div className="w-2 h-2 rounded-full bg-themeaccent" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-ink-primary">{opt.label}</p>
                <p className="text-micro text-ink-tertiary">{opt.sample}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="block text-sm font-medium text-ink-primary mb-2.5">快速预设</label>
        <div className="flex gap-2">
          <button
            onClick={() => update({ sectionSpacing: 6, bodyFontSize: 9, headingFontSize: 11, fontFamily: 'noto-sans' })}
            className="flex-1 h-9 rounded-lg text-sm border border-divider-faint text-ink-secondary hover:border-themeaccent hover:text-themeaccent transition-all"
          >
            紧凑
          </button>
          <button
            onClick={() => update({ sectionSpacing: 10, bodyFontSize: 10, headingFontSize: 12, fontFamily: 'noto-serif' })}
            className="flex-1 h-9 rounded-lg text-sm border border-divider-faint text-ink-secondary hover:border-themeaccent hover:text-themeaccent transition-all"
          >
            标准
          </button>
          <button
            onClick={() => update({ sectionSpacing: 14, bodyFontSize: 11.5, headingFontSize: 14, fontFamily: 'noto-serif' })}
            className="flex-1 h-9 rounded-lg text-sm border border-divider-faint text-ink-secondary hover:border-themeaccent hover:text-themeaccent transition-all"
          >
            宽松
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════ SHARED FORM COMPONENTS ═══════════════ */

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-primary mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3.5 bg-surface border border-divider-faint rounded-lg text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-themeaccent focus:shadow-glow transition-all duration-200"
      />
    </div>
  )
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-primary mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3.5 py-2.5 bg-surface border border-divider-faint rounded-lg text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-themeaccent focus:shadow-glow transition-all duration-200 resize-y min-h-[80px]"
      />
      {maxLength && (
        <p className="text-micro text-ink-tertiary mt-1 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  )
}

function EntryCard({
  children,
  onRemove,
  title,
}: {
  children: React.ReactNode
  onRemove: () => void
  title: string
}) {
  return (
    <div className="bg-surface border border-divider-faint rounded-xl p-4 space-y-3 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-ink-tertiary cursor-grab" />
          <span className="text-sm font-medium text-ink-primary">{title}</span>
        </div>
        <button
          onClick={onRemove}
          className="flex items-center justify-center w-7 h-7 rounded-md text-ink-tertiary hover:text-danger hover:bg-danger-bg transition-all duration-150"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {children}
    </div>
  )
}
