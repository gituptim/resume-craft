import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import type { ResumeData, CustomSection } from '@/types/resume'

const fontFamilyMap = {
  'noto-serif': '"Noto Serif SC", "Noto Serif JP", Georgia, serif',
  'noto-sans': '"Noto Sans SC", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

/* ─── Skill Level Dots ─── */
function SkillLevelDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= level ? 'text-themeaccent' : 'text-ink-minimal'}
        >
          ●
        </span>
      ))}
    </div>
  )
}

/* ─── Custom Section Renderer ─── */
function CustomSectionRenderer({ section, data }: { section: CustomSection; data: ResumeData }) {
  const accentColor = data.color || '#B45309'
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h3
        style={{ fontSize: `${data.layout.headingFontSize}pt`, borderLeftWidth: '3px', borderLeftStyle: 'solid', borderLeftColor: accentColor }}
        className="font-bold text-ink-primary mb-2 pl-3"
      >
        {section.title}
      </h3>
      {section.items.map((item) => (
        <div key={item.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <span style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="font-semibold text-ink-primary">{item.title}</span>
            <span style={{ fontSize: `${data.layout.bodyFontSize * 0.85}pt` }} className="text-ink-tertiary">{item.startDate} — {item.endDate}</span>
          </div>
          {item.subtitle && <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary">{item.subtitle}</p>}
          {item.description && <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary mt-1">{item.description}</p>}
        </div>
      ))}
    </div>
  )
}

/* ─── Section Components ─── */

function SummarySection({ data }: { data: ResumeData }) {
  const accentColor = data.color || '#B45309'
  if (!data.summary) return null
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt`, borderLeftWidth: '3px', borderLeftStyle: 'solid', borderLeftColor: accentColor }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary pl-3 mb-3"
      >
        个人简介
      </h2>
      <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary leading-relaxed whitespace-pre-wrap">{data.summary}</p>
    </div>
  )
}

function ExperienceSection({ data }: { data: ResumeData }) {
  const accentColor = data.color || '#B45309'
  if (data.experience.length === 0) return null
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt`, borderLeftWidth: '3px', borderLeftStyle: 'solid', borderLeftColor: accentColor }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary pl-3 mb-4"
      >
        工作经历
      </h2>
      <div className="space-y-5">
        {data.experience.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-start mb-0.5">
              <h3 style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="font-semibold text-ink-primary">{exp.position}</h3>
              <span style={{ fontSize: `${data.layout.bodyFontSize * 0.9}pt` }} className="text-ink-tertiary shrink-0">
                {exp.startDate} — {exp.endDate}
              </span>
            </div>
            <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary mb-1.5">{exp.company}</p>
            <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary whitespace-pre-wrap leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function EducationSection({ data }: { data: ResumeData }) {
  const accentColor = data.color || '#B45309'
  if (data.education.length === 0) return null
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt`, borderLeftWidth: '3px', borderLeftStyle: 'solid', borderLeftColor: accentColor }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary pl-3 mb-4"
      >
        教育
      </h2>
      <div className="space-y-4">
        {data.education.map((edu) => (
          <div key={edu.id}>
            <h3 style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="font-semibold text-ink-primary">{edu.school}</h3>
            <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary">{edu.degree}</p>
            <p style={{ fontSize: `${data.layout.bodyFontSize * 0.9}pt` }} className="text-ink-tertiary mt-0.5">
              {edu.startDate} — {edu.endDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsSection({ data }: { data: ResumeData }) {
  const accentColor = data.color || '#B45309'
  if (data.projects.length === 0) return null
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt`, borderLeftWidth: '3px', borderLeftStyle: 'solid', borderLeftColor: accentColor }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary pl-3 mb-4"
      >
        项目经历
      </h2>
      <div className="space-y-4">
        {data.projects.map((proj) => (
          <div key={proj.id}>
            <div className="flex justify-between items-start mb-0.5">
              <h3 style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="font-semibold text-ink-primary">{proj.name}</h3>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: `${data.layout.bodyFontSize * 0.9}pt`, color: accentColor }}
                  className="shrink-0"
                >
                  查看
                </a>
              )}
            </div>
            <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary whitespace-pre-wrap leading-relaxed">{proj.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillsSection({ data }: { data: ResumeData }) {
  const accentColor = data.color || '#B45309'
  // Detailed markdown mode
  if (data.skillDisplayMode === 'detailed' && data.skillsMarkdown) {
    return (
      <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
        <h2
          style={{ fontSize: `${data.layout.headingFontSize}pt`, borderLeftWidth: '3px', borderLeftStyle: 'solid', borderLeftColor: accentColor }}
          className="font-bold uppercase tracking-[0.06em] text-ink-primary pl-3 mb-4"
        >
          技能
        </h2>
        <div
          style={{ fontSize: `${data.layout.bodyFontSize}pt` }}
          className="text-ink-secondary whitespace-pre-wrap leading-relaxed"
        >
          {data.skillsMarkdown}
        </div>
      </div>
    )
  }
  if (data.skills.length === 0) return null
  const isSimple = data.skillDisplayMode === 'simple'
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt`, borderLeftWidth: '3px', borderLeftStyle: 'solid', borderLeftColor: accentColor }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary pl-3 mb-4"
      >
        技能
      </h2>
      {isSimple ? (
        <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary">
          {data.skills.map((s) => s.name).join(' · ')}
        </p>
      ) : (
        <div className="space-y-2.5">
          {data.skills.map((skill) => (
            <div key={skill.id}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="font-semibold text-ink-primary">
                  {skill.name}
                </span>
                {skill.showLevel && <SkillLevelDots level={skill.level} />}
              </div>
              {skill.description && (
                <p
                  style={{ fontSize: `${data.layout.bodyFontSize * 0.85}pt` }}
                  className="text-ink-secondary mt-0.5 leading-relaxed whitespace-pre-wrap"
                >
                  {skill.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AwardsSection({ data }: { data: ResumeData }) {
  const accentColor = data.color || '#B45309'
  if (data.awards.length === 0) return null
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt`, borderLeftWidth: '3px', borderLeftStyle: 'solid', borderLeftColor: accentColor }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary pl-3 mb-4"
      >
        荣誉奖项
      </h2>
      <div className="space-y-4">
        {data.awards.map((award) => (
          <div key={award.id}>
            <div className="flex justify-between items-start">
              <h3 style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="font-semibold text-ink-primary">{award.name}</h3>
              <span style={{ fontSize: `${data.layout.bodyFontSize * 0.9}pt` }} className="text-ink-tertiary shrink-0">{award.date}</span>
            </div>
            <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary">{award.issuer}</p>
            {award.description && <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary">{award.description}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

const LEFT_SECTIONS = ['summary', 'experience', 'projects']
const RIGHT_SECTIONS = ['skills', 'education', 'awards']

function renderLeftSections(data: ResumeData) {
  return data.sectionOrder.map((item) => {
    if (item.type !== 'builtin') return null
    if (!LEFT_SECTIONS.includes(item.sectionType)) return null
    switch (item.sectionType) {
      case 'summary': return <SummarySection key="summary" data={data} />
      case 'experience': return <ExperienceSection key="experience" data={data} />
      case 'projects': return <ProjectsSection key="projects" data={data} />
      default: return null
    }
  })
}

function renderRightSections(data: ResumeData) {
  return data.sectionOrder.map((item) => {
    if (item.type !== 'builtin') return null
    if (!RIGHT_SECTIONS.includes(item.sectionType)) return null
    switch (item.sectionType) {
      case 'skills': return <SkillsSection key="skills" data={data} />
      case 'education': return <EducationSection key="education" data={data} />
      case 'awards': return <AwardsSection key="awards" data={data} />
      default: return null
    }
  })
}

function renderCustomSections(data: ResumeData) {
  return data.sectionOrder.map((item) => {
    if (item.type !== 'custom') return null
    const custom = data.customSections.find((s) => s.id === item.sectionId)
    if (!custom) return null
    return <CustomSectionRenderer key={custom.id} section={custom} data={data} />
  })
}

export default function CreativeTemplate({ data }: { data: ResumeData }) {
  const accentColor = data.color || '#B45309'
  return (
    <div
      className="w-full h-full bg-white text-ink-primary"
      style={{
        fontFamily: fontFamilyMap[data.layout.fontFamily],
        fontSize: `${data.layout.bodyFontSize}pt`,
      }}
    >
      {/* Accent Header Band */}
      <div className="px-[20mm] pt-[16mm] pb-6 relative" style={{ backgroundColor: accentColor }}>
        <div className="flex items-end justify-between">
          <div>
            <h1
              style={{ fontSize: `${data.layout.headingFontSize}pt` }}
              className="font-bold text-white tracking-wide mb-1"
            >
              {data.personal.name || '您的姓名'}
            </h1>
            <p className="text-[12pt] text-white/80">{data.personal.title || '目标职位'}</p>
          </div>
          <div className="text-right space-y-1.5">
            {data.personal.email && (
              <div className="flex items-center gap-2 text-[9pt] text-white/80 justify-end">
                <span>{data.personal.email}</span>
                <Mail className="w-3.5 h-3.5 shrink-0" />
              </div>
            )}
            {data.personal.phone && (
              <div className="flex items-center gap-2 text-[9pt] text-white/80 justify-end">
                <span>{data.personal.phone}</span>
                <Phone className="w-3.5 h-3.5 shrink-0" />
              </div>
            )}
            {data.personal.location && (
              <div className="flex items-center gap-2 text-[9pt] text-white/80 justify-end">
                <span>{data.personal.location}</span>
                <MapPin className="w-3.5 h-3.5 shrink-0" />
              </div>
            )}
            {data.personal.website && (
              <div className="flex items-center gap-2 text-[9pt] text-white/80 justify-end">
                <span>{data.personal.website}</span>
                <Globe className="w-3.5 h-3.5 shrink-0" />
              </div>
            )}
            {data.personal.customFields.map((field) => (
              <div key={field.id} className="flex items-center gap-2 text-[9pt] text-white/80 justify-end">
                <span>{field.label}: {field.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body - staggered columns */}
      <div className="px-[20mm] pt-8 pb-[20mm]">
        <div className="flex gap-8">
          {/* Left column - wider */}
          <div className="w-[58%]">
            {renderLeftSections(data)}
          </div>

          {/* Right column - narrower */}
          <div className="w-[42%] pl-6 border-l border-divider-faint">
            {renderRightSections(data)}
          </div>
        </div>

        {/* Custom sections - full width below columns */}
        {renderCustomSections(data)}
      </div>
    </div>
  )
}
