import type { ResumeData } from '../types/resume'
import SectionRenderer from '../components/template-sections/SectionRenderer'

export default function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personal, sectionOrder } = data

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-800 text-[11pt] leading-relaxed overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-[15mm] pb-[12mm]">
        <h1 className="text-[28pt] font-bold">{personal.name || '姓名'}</h1>
        <p className="text-[14pt] mt-1 opacity-90">{personal.title || '职位'}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[9.5pt] opacity-80">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>

      <div className="p-[15mm] pt-[10mm]">
        {sectionOrder.map((section) => (
          <SectionRenderer key={section.type === 'builtin' ? section.sectionType : section.sectionId} section={section} data={data} variant="creative" />
        ))}
      </div>
    </div>
  )
}
