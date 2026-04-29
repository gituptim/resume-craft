import type { ResumeData } from '../types/resume'
import SectionRenderer from '../components/template-sections/SectionRenderer'

export default function ModernTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder } = data

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-800 text-[11pt] leading-relaxed">
      <div className="flex">
        <div className="w-3 bg-blue-600 shrink-0" />
        <div className="flex-1 p-[15mm] pl-[12mm]">
          <header className="mb-6">
            <h1 className="text-[26pt] font-bold text-gray-900">{personal.name || '姓名'}</h1>
            <p className="text-[14pt] text-blue-600 mt-1 font-medium">{personal.title || '职位'}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[9.5pt] text-gray-500">
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>{personal.phone}</span>}
              {personal.location && <span>{personal.location}</span>}
              {personal.website && <span>{personal.website}</span>}
            </div>
          </header>

          {sectionOrder.map((section) => (
            <SectionRenderer key={section.type === 'builtin' ? section.sectionType : section.sectionId} section={section} data={data} variant="modern" />
          ))}
        </div>
      </div>
    </div>
  )
}
