import type { Education, TemplateId } from '../../types/resume'

const styles: Record<TemplateId, {
  heading: string
  itemWrapper: string
  school: string
  degree: string
  date: string
}>
  = {
  minimal: {
    heading: 'text-[12pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3',
    itemWrapper: 'space-y-2',
    school: 'text-[11pt] font-semibold text-gray-800',
    degree: 'text-[10pt] text-gray-600 ml-2',
    date: 'text-[9.5pt] text-gray-500',
  },
  modern: {
    heading: 'text-[11pt] font-bold text-blue-600 uppercase tracking-wider mb-3',
    itemWrapper: 'space-y-2',
    school: 'text-[11pt] font-semibold text-gray-800',
    degree: 'text-[10pt] text-gray-600 ml-2',
    date: 'text-[9pt] text-gray-500',
  },
  classic: {
    heading: 'text-[11pt] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-3 text-center',
    itemWrapper: 'space-y-2',
    school: 'text-[11pt] font-bold text-gray-900',
    degree: 'text-[10pt] text-gray-700 ml-2',
    date: 'text-[9.5pt] text-gray-600 italic',
  },
  creative: {
    heading: 'text-[12pt] font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2',
    itemWrapper: 'space-y-2',
    school: 'text-[11pt] font-semibold text-gray-800',
    degree: 'text-[10pt] text-gray-600 ml-2',
    date: 'text-[9pt] text-pink-600 font-medium',
  },
}

export default function EducationSection({ education, variant, title }: { education: Education[]; variant: TemplateId; title?: string }) {
  if (education.length === 0) return null
  const s = styles[variant]
  return (
    <section className="mb-5">
      <h2 className={s.heading}>
        {variant === 'creative' && <span className="w-1 h-4 bg-orange-500 rounded-full" />}
        {title || '教育背景'}
      </h2>
      <div className={s.itemWrapper}>
        {education.map((edu) => (
          <div key={edu.id} className={variant === 'creative' ? 'flex justify-between items-baseline p-2 bg-pink-50 rounded-lg' : 'flex justify-between items-baseline'}>
            <div>
              <span className={s.school}>{edu.school || '学校'}</span>
              <span className={s.degree}>{edu.degree}</span>
            </div>
            <span className={s.date}>{edu.startDate} - {edu.endDate}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
