import type { ResumeData } from '../types/resume'
import SectionRenderer from '../components/template-sections/SectionRenderer'

export default function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder } = data

  return (
    <div className="w-[210mm] min-h-[297mm] p-[18mm] bg-white text-gray-900 text-[11pt] leading-relaxed font-serif">
      <header className="text-center mb-6 pb-4 border-b-2 border-gray-900">
        <h1 className="text-[22pt] font-bold tracking-wide">{personal.name || '姓名'}</h1>
        <p className="text-[12pt] text-gray-700 mt-1 italic">{personal.title || '职位'}</p>
        <div className="flex justify-center flex-wrap gap-x-3 gap-y-1 mt-2 text-[9.5pt] text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </header>

      {sectionOrder.map((section) => (
        <SectionRenderer key={section.type === 'builtin' ? section.sectionType : section.sectionId} section={section} data={data} variant="classic" />
      ))}
    </div>
  )
}
