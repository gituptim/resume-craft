import type { Experience, TemplateId } from '../../types/resume'

const styles: Record<TemplateId, {
  heading: string
  itemWrapper: string
  itemTitle: string
  itemSubtitle: string
  itemDate: string
  itemDesc: string
  timelineDot?: string
  timelineLine?: string
}> = {
  minimal: {
    heading: 'text-[12pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3',
    itemWrapper: 'space-y-3',
    itemTitle: 'text-[11pt] font-semibold text-gray-800',
    itemSubtitle: 'text-[10pt] text-gray-600 italic',
    itemDate: 'text-[9.5pt] text-gray-500',
    itemDesc: 'text-[10pt] text-gray-700 mt-1',
  },
  modern: {
    heading: 'text-[11pt] font-bold text-blue-600 uppercase tracking-wider mb-3',
    itemWrapper: 'space-y-4',
    itemTitle: 'text-[11pt] font-semibold text-gray-800',
    itemSubtitle: 'text-[10pt] text-blue-600 font-medium',
    itemDate: 'text-[9pt] text-gray-500',
    itemDesc: 'text-[10pt] text-gray-700 mt-1',
    timelineDot: 'absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-600',
    timelineLine: 'relative pl-4 border-l-2 border-blue-200',
  },
  classic: {
    heading: 'text-[11pt] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-3 text-center',
    itemWrapper: 'space-y-3',
    itemTitle: 'text-[11pt] font-bold text-gray-900',
    itemSubtitle: 'text-[10pt] text-gray-700 italic',
    itemDate: 'text-[9.5pt] text-gray-600 italic',
    itemDesc: 'text-[10pt] text-gray-800 mt-1 text-justify',
  },
  creative: {
    heading: 'text-[12pt] font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2',
    itemWrapper: 'space-y-3',
    itemTitle: 'text-[11pt] font-semibold text-gray-800',
    itemSubtitle: 'text-[10pt] text-orange-700 font-medium',
    itemDate: 'text-[9pt] text-orange-600 font-medium',
    itemDesc: 'text-[10pt] text-gray-700 mt-1',
  },
}

export default function ExperienceSection({ experience, variant, title }: { experience: Experience[]; variant: TemplateId; title?: string }) {
  if (experience.length === 0) return null
  const s = styles[variant]
  return (
    <section className="mb-5">
      <h2 className={s.heading}>
        {variant === 'creative' && <span className="w-1 h-4 bg-orange-500 rounded-full" />}
        {title || '工作经历'}
      </h2>
      <div className={s.itemWrapper}>
        {experience.map((exp) => (
          <div key={exp.id} className={s.timelineLine || ''}>
            {s.timelineDot && <div className={s.timelineDot} />}
            <div className={variant === 'creative' ? 'p-3 bg-orange-50 rounded-lg' : ''}>
              <div className="flex justify-between items-baseline">
                <h3 className={s.itemTitle}>{exp.company || '公司'}</h3>
                <span className={s.itemDate}>{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className={s.itemSubtitle}>{exp.position}</p>
              {exp.description && <p className={s.itemDesc}>{exp.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
