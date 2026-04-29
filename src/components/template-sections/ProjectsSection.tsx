import type { Project, TemplateId } from '../../types/resume'

const styles: Record<TemplateId, {
  heading: string
  itemWrapper: string
  name: string
  link: string
  desc: string
}>
  = {
  minimal: {
    heading: 'text-[12pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3',
    itemWrapper: 'space-y-2',
    name: 'text-[11pt] font-semibold text-gray-800',
    link: 'text-[9pt] text-gray-500',
    desc: 'text-[10pt] text-gray-700 mt-0.5',
  },
  modern: {
    heading: 'text-[11pt] font-bold text-blue-600 uppercase tracking-wider mb-3',
    itemWrapper: 'space-y-3',
    name: 'text-[11pt] font-semibold text-gray-800',
    link: 'text-[9pt] text-blue-600',
    desc: 'text-[10pt] text-gray-700 mt-0.5',
  },
  classic: {
    heading: 'text-[11pt] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-3 text-center',
    itemWrapper: 'space-y-2',
    name: 'text-[11pt] font-bold text-gray-900',
    link: 'text-[9pt] text-gray-600',
    desc: 'text-[10pt] text-gray-800 mt-0.5 text-justify',
  },
  creative: {
    heading: 'text-[12pt] font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2',
    itemWrapper: 'space-y-3',
    name: 'text-[11pt] font-semibold text-gray-800',
    link: 'text-[9pt] text-orange-600',
    desc: 'text-[10pt] text-gray-700 mt-1',
  },
}

export default function ProjectsSection({ projects, variant, title }: { projects: Project[]; variant: TemplateId; title?: string }) {
  if (projects.length === 0) return null
  const s = styles[variant]
  return (
    <section className="mb-5">
      <h2 className={s.heading}>
        {variant === 'creative' && <span className="w-1 h-4 bg-orange-500 rounded-full" />}
        {title || '项目经验'}
      </h2>
      <div className={s.itemWrapper}>
        {projects.map((proj) => (
          <div key={proj.id} className={variant === 'creative' ? 'p-3 bg-gray-50 rounded-lg' : ''}>
            <div className="flex justify-between items-baseline">
              <h3 className={s.name}>{proj.name || '项目'}</h3>
              {proj.link && <span className={s.link}>{proj.link}</span>}
            </div>
            {proj.description && <p className={s.desc}>{proj.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
