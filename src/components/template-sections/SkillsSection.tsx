import type { TemplateId } from '../../types/resume'

const styles: Record<TemplateId, { heading: string; tag: string; wrapper: string }> = {
  minimal: {
    heading: 'text-[12pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2',
    tag: 'px-2 py-0.5 bg-gray-100 text-gray-700 text-[9.5pt] rounded',
    wrapper: 'flex flex-wrap gap-2',
  },
  modern: {
    heading: 'text-[11pt] font-bold text-blue-600 uppercase tracking-wider mb-2',
    tag: 'px-3 py-1 bg-blue-50 text-blue-700 text-[9.5pt] rounded-full font-medium',
    wrapper: 'flex flex-wrap gap-2',
  },
  classic: {
    heading: 'text-[11pt] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 text-center',
    tag: '',
    wrapper: 'text-[10.5pt] text-gray-800 text-center',
  },
  creative: {
    heading: 'text-[12pt] font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center gap-2',
    tag: 'px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 text-[9.5pt] rounded-full font-medium',
    wrapper: 'flex flex-wrap gap-2',
  },
}

export default function SkillsSection({ skills, variant, title }: { skills: string[]; variant: TemplateId; title?: string }) {
  if (skills.length === 0) return null
  const s = styles[variant]
  return (
    <section className="mb-5">
      <h2 className={s.heading}>
        {variant === 'creative' && <span className="w-1 h-4 bg-orange-500 rounded-full" />}
        {title || '技能'}
      </h2>
      <div className={s.wrapper}>
        {variant === 'classic' ? (
          <p>{skills.join(' · ')}</p>
        ) : (
          skills.map((skill) => (
            <span key={skill} className={s.tag}>
              {skill}
            </span>
          ))
        )}
      </div>
    </section>
  )
}
