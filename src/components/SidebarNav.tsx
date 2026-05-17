import { useCallback } from 'react'
import {
  User, Target, GraduationCap, Briefcase, FolderKanban, Wrench, Award,
  ChevronUp, ChevronDown, EyeOff, Plus, MessageSquare,
} from 'lucide-react'
import { useResume } from '@/context/ResumeContext'
import type { BuiltInSectionType } from '@/types/resume'
import { cn } from '@/lib/utils'

const SECTION_META: Record<
  BuiltInSectionType | 'personal',
  { label: string; icon: React.ElementType }
> = {
  personal: { label: '个人信息', icon: User },
  summary: { label: '个人简介', icon: Target },
  experience: { label: '工作经历', icon: Briefcase },
  education: { label: '教育背景', icon: GraduationCap },
  skills: { label: '技能特长', icon: Wrench },
  projects: { label: '项目经历', icon: FolderKanban },
  awards: { label: '荣誉证书', icon: Award },
}

function getSectionPreview(sectionType: BuiltInSectionType, data: ReturnType<typeof useResume>['state']['data']): string {
  switch (sectionType) {
    case 'summary':
      return data.summary ? data.summary.slice(0, 20) + (data.summary.length > 20 ? '…' : '') : ''
    case 'experience': {
      const count = data.experience.length
      if (count === 0) return ''
      const first = data.experience[0].company
      return count > 1 ? `${first} 等${count}段` : first
    }
    case 'education': {
      if (data.education.length === 0) return ''
      return data.education[0].school
    }
    case 'skills': {
      if (data.skills.length === 0) return ''
      const preview = data.skills.slice(0, 3).map(s => s.name).join(' · ')
      return data.skills.length > 3 ? `${preview} 等` : preview
    }
    case 'projects': {
      if (data.projects.length === 0) return ''
      return data.projects[0].name
    }
    case 'awards': {
      if (data.awards.length === 0) return ''
      return data.awards[0].name
    }
    default:
      return ''
  }
}

type SidebarNavProps = {
  activeDrawer: string | null
  onOpenDrawer: (drawer: string) => void
}

export default function SidebarNav({ activeDrawer, onOpenDrawer }: SidebarNavProps) {
  const { state, dispatch } = useResume()
  const data = state.data

  const handleMoveUp = useCallback((index: number) => {
    dispatch({ type: 'MOVE_SECTION_UP', payload: index })
  }, [dispatch])

  const handleMoveDown = useCallback((index: number) => {
    dispatch({ type: 'MOVE_SECTION_DOWN', payload: index })
  }, [dispatch])

  const handleToggle = useCallback((sectionType: string, sectionId?: string) => {
    dispatch({ type: 'TOGGLE_SECTION', payload: { sectionType, sectionId } })
  }, [dispatch])

  // Determine hidden built-in sections
  const visibleBuiltins = new Set<BuiltInSectionType>()
  data.sectionOrder.forEach((item) => {
    if (item.type === 'builtin') {
      visibleBuiltins.add(item.sectionType)
    }
  })

  const hiddenBuiltins = (['summary', 'experience', 'education', 'skills', 'projects', 'awards'] as BuiltInSectionType[]).filter(
    (s) => !visibleBuiltins.has(s)
  )

  // Determine hidden custom sections
  const visibleCustomIds = new Set<string>()
  data.sectionOrder.forEach((item) => {
    if (item.type === 'custom') {
      visibleCustomIds.add(item.sectionId)
    }
  })
  const hiddenCustomSections = data.customSections.filter((s) => !visibleCustomIds.has(s.id))

  const hasHidden = hiddenBuiltins.length > 0 || hiddenCustomSections.length > 0

  return (
    <aside className="editor-sidebar no-print hidden md:flex md:w-[240px] lg:w-[240px] flex-col bg-surface border-r border-divider-faint overflow-y-auto">
      <nav className="flex flex-col py-4">
        {/* Fixed: Personal Info */}
        <NavItem
          sectionType="personal"
          isActive={activeDrawer === 'personal'}
          onClick={() => onOpenDrawer('personal')}
          preview=""
          sortable={false}
          onMoveUp={undefined}
          onMoveDown={undefined}
          onHide={undefined}
        />

        {/* Dynamic: sectionOrder items */}
        {data.sectionOrder.map((item, index) => {
          if (item.type === 'builtin') {
            const st = item.sectionType
            return (
              <NavItem
                key={`builtin-${st}`}
                sectionType={st}
                isActive={activeDrawer === st}
                onClick={() => onOpenDrawer(st)}
                preview={getSectionPreview(st, data)}
                sortable
                isFirst={index === 0}
                isLast={index === data.sectionOrder.length - 1}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                onHide={() => handleToggle(st)}
              />
            )
          }
          // Custom section
          const custom = data.customSections.find((s) => s.id === item.sectionId)
          if (!custom) return null
          return (
            <NavItem
              key={`custom-${custom.id}`}
              sectionType="custom"
              label={custom.title}
              icon={MessageSquare}
              isActive={activeDrawer === 'custom'}
              onClick={() => onOpenDrawer('custom')}
              preview={custom.items[0]?.title || ''}
              sortable
              isFirst={index === 0}
              isLast={index === data.sectionOrder.length - 1}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onHide={() => handleToggle('custom', custom.id)}
            />
          )
        })}
      </nav>

      {/* Add Section Area */}
      {hasHidden && (
        <div className="mt-auto px-5 py-4 border-t border-divider">
          <p className="text-micro text-ink-tertiary mb-2">添加模块</p>
          <div className="flex flex-col gap-1">
            {hiddenBuiltins.map((st) => {
              const meta = SECTION_META[st]
              return (
                <button
                  key={`add-${st}`}
                  onClick={() => handleToggle(st)}
                  className="flex items-center gap-2 h-8 px-2 rounded-md text-sm text-ink-secondary hover:text-themeaccent hover:bg-surface-highlight transition-all duration-150"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>{meta.label}</span>
                </button>
              )
            })}
            {hiddenCustomSections.map((cs) => (
              <button
                key={`add-custom-${cs.id}`}
                onClick={() => handleToggle('custom', cs.id)}
                className="flex items-center gap-2 h-8 px-2 rounded-md text-sm text-ink-secondary hover:text-themeaccent hover:bg-surface-highlight transition-all duration-150"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>{cs.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

/* ─────────── Nav Item ─────────── */
function NavItem({
  sectionType,
  label,
  icon: CustomIcon,
  isActive,
  onClick,
  preview,
  sortable,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onHide,
}: {
  sectionType: BuiltInSectionType | 'custom' | 'personal'
  label?: string
  icon?: React.ElementType
  isActive: boolean
  onClick: () => void
  preview: string
  sortable: boolean
  isFirst?: boolean
  isLast?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  onHide?: () => void
}) {
  const meta = sectionType !== 'custom' ? SECTION_META[sectionType as keyof typeof SECTION_META] : undefined
  const displayLabel = label || meta?.label || ''
  const Icon = CustomIcon || meta?.icon || User

  return (
    <div
      className={cn(
        'group relative flex flex-col px-5 py-3 transition-all duration-150 ease-in-out cursor-pointer',
        isActive
          ? 'bg-themeaccent-light/60 text-themeaccent font-medium'
          : 'text-ink-secondary hover:bg-surface-highlight hover:text-ink-primary'
      )}
      onClick={onClick}
    >
      {/* Active indicator */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-themeaccent rounded-r-full" />
      )}

      <div className="flex items-center gap-2.5">
        <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-themeaccent' : 'text-ink-tertiary')} />
        <span className="text-[0.9375rem]">{displayLabel}</span>

        {/* Sort & hide controls — visible on hover */}
        {sortable && (
          <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {onMoveUp !== undefined && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveUp()
                }}
                disabled={isFirst}
                className="flex items-center justify-center w-6 h-6 rounded-md text-ink-tertiary hover:bg-surface-highlight hover:text-ink-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            )}
            {onMoveDown !== undefined && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveDown()
                }
                }
                disabled={isLast}
                className="flex items-center justify-center w-6 h-6 rounded-md text-ink-tertiary hover:bg-surface-highlight hover:text-ink-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
            {onHide !== undefined && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onHide()
                }}
                className="flex items-center justify-center w-6 h-6 rounded-md text-ink-tertiary hover:bg-surface-highlight hover:text-ink-primary transition-all duration-150"
                title="隐藏模块"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preview text */}
      {preview && (
        <p className="mt-1 text-micro text-ink-tertiary truncate pl-8">
          {preview}
        </p>
      )}
    </div>
  )
}
