import type { ResumeData } from '../types/resume'
import SectionRenderer from '../components/template-sections/SectionRenderer'

export default function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder } = data

  return (
    <div className="w-[210mm] min-h-[297mm] p-[15mm] bg-white text-gray-800 text-[11pt] leading-relaxed">
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-4 mb-5">
        <h1 className="text-[24pt] font-bold text-gray-900 tracking-wide">{personal.name || '姓名'}</h1>
        <p className="text-[13pt] text-gray-600 mt-1">{personal.title || '职位'}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[9.5pt] text-gray-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </header>

      {/* Sections in custom order */}
      {sectionOrder.map((section) => (
        <SectionRenderer key={section.type === 'builtin' ? section.sectionType : section.sectionId} section={section} data={data} variant="minimal" />
      ))}
    </div>
  )
}
