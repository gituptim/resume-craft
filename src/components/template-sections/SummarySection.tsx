import type { TemplateId } from '../../types/resume'

const styles: Record<TemplateId, { heading: string; paragraph: string }> = {
  minimal: {
    heading: 'text-[12pt] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2',
    paragraph: 'text-[10.5pt] text-gray-700',
  },
  modern: {
    heading: 'text-[11pt] font-bold text-blue-600 uppercase tracking-wider mb-2',
    paragraph: 'text-[10.5pt] text-gray-700',
  },
  classic: {
    heading: 'text-[11pt] font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-2 text-center',
    paragraph: 'text-[10.5pt] text-gray-800 text-justify',
  },
  creative: {
    heading: 'text-[12pt] font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center gap-2',
    paragraph: 'text-[10.5pt] text-gray-700',
  },
}

export default function SummarySection({ summary, variant, title }: { summary: string; variant: TemplateId; title?: string }) {
  if (!summary) return null
  const s = styles[variant]
  return (
    <section className="mb-5">
      <h2 className={s.heading}>
        {variant === 'creative' && <span className="w-1 h-4 bg-orange-500 rounded-full" />}
        {title || '自我评价'}
      </h2>
      <p className={s.paragraph}>{summary}</p>
    </section>
  )
}
