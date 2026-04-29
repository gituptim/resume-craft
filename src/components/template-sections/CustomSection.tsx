import type { CustomSection as CustomSectionType, TemplateId } from '../../types/resume'

const styles: Record<TemplateId, {
  heading: string
  itemWrapper: string
  title: string
  subtitle: string
  date: string
  desc: string
}> = {
  minimal: {
    heading: 'text-[12pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3',
    itemWrapper: 'space-y-3',
    title: 'text-[11pt] font-semibold text-gray-800',
    subtitle: 'text-[10pt] text-gray-600 italic',
    date: 'text-[9.5pt] text-gray-500',
    desc: 'text-[10pt] text-gray-700 mt-1',
  },
  modern: {
    heading: 'text-[11pt] font-bold text-blue-600 uppercase tracking-wider mb-3',
    itemWrapper: 'space-y-4',
    title: 'text-[11pt] font-semibold text-gray-800',
    subtitle: 'text-[10pt] text-blue-600 font-medium',
    date: 'text-[9pt] text-gray-500',
    desc: 'text-[10pt] text-gray-700 mt-1',
  },
  classic: {
    heading: 'text-[11pt] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-3 text-center',
    itemWrapper: 'space-y-3',
    title: 'text-[11pt] font-bold text-gray-900',
    subtitle: 'text-[10pt] text-gray-700 italic',
    date: 'text-[9.5pt] text-gray-600 italic',
    desc: 'text-[10pt] text-gray-800 mt-1 text-justify',
  },
  creative: {
    heading: 'text-[12pt] font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2',
    itemWrapper: 'space-y-3',
    title: 'text-[11pt] font-semibold text-gray-800',
    subtitle: 'text-[10pt] text-orange-700 font-medium',
    date: 'text-[9pt] text-orange-600 font-medium',
    desc: 'text-[10pt] text-gray-700 mt-1',
  },
}

export default function CustomSection({ section, variant }: { section: CustomSectionType; variant: TemplateId }) {
  if (section.items.length === 0) return null
  const s = styles[variant]
  return (
    <section className="mb-5">
      <h2 className={s.heading}>
        {variant === 'creative' && <span className="w-1 h-4 bg-orange-500 rounded-full" />}
        {section.title}
      </h2>
      <div className={s.itemWrapper}>
        {section.items.map((item) => (
          <div key={item.id} className={variant === 'creative' ? 'p-3 bg-orange-50 rounded-lg' : ''}>
            <div className="flex justify-between items-baseline">
              <h3 className={s.title}>{item.title || '标题'}</h3>
              <span className={s.date}>{item.startDate} - {item.endDate}</span>
            </div>
            <p className={s.subtitle}>{item.subtitle}</p>
            {item.description && <p className={s.desc}>{item.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
