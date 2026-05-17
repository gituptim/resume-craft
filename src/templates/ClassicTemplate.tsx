import type { ResumeData, CustomSection } from '@/types/resume'

const fontFamilyMap = {
  'noto-serif': '"Noto Serif SC", "Noto Serif JP", Georgia, serif',
  'noto-sans': '"Noto Sans SC", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

/* ─── Skill Level Dots ─── */
function SkillLevelDots({ level, color }: { level: number; color?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{ color: i <= level ? (color || '#B45309') : '#D6D3D1' }}
        >
          ●
        </span>
      ))}
    </div>
  )
}

/* ─── Custom Section Renderer ─── */
function CustomSectionRenderer({ section, data }: { section: CustomSection; data: ResumeData }) {
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h3
        style={{ fontSize: `${data.layout.headingFontSize}pt` }}
        className="font-bold text-ink-primary mb-2"
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
  if (!data.summary) return null
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt` }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary mb-3"
      >
        个人简介
      </h2>
      <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary leading-relaxed whitespace-pre-wrap">{data.summary}</p>
    </div>
  )
}

function ExperienceSection({ data }: { data: ResumeData }) {
  if (data.experience.length === 0) return null
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt` }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary mb-4"
      >
        工作经历
      </h2>
      <div className="space-y-4">
        {data.experience.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-start mb-1">
              <h3 style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="font-semibold text-ink-primary">{exp.position}</h3>
              <span style={{ fontSize: `${data.layout.bodyFontSize * 0.9}pt` }} className="text-ink-tertiary shrink-0">
                {exp.startDate} — {exp.endDate}
              </span>
            </div>
            <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary mb-1">{exp.company}</p>
            <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary whitespace-pre-wrap leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function EducationSection({ data }: { data: ResumeData }) {
  if (data.education.length === 0) return null
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt` }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary mb-4"
      >
        教育背景
      </h2>
      <div className="space-y-3">
        {data.education.map((edu) => (
          <div key={edu.id} className="flex justify-between items-start">
            <div>
              <h3 style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="font-semibold text-ink-primary">{edu.school}</h3>
              <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary">{edu.degree}</p>
            </div>
            <span style={{ fontSize: `${data.layout.bodyFontSize * 0.9}pt` }} className="text-ink-tertiary shrink-0">
              {edu.startDate} — {edu.endDate}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsSection({ data }: { data: ResumeData }) {
  if (data.projects.length === 0) return null
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt` }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary mb-4"
      >
        项目经历
      </h2>
      <div className="space-y-4">
        {data.projects.map((proj) => (
          <div key={proj.id}>
            <div className="flex justify-between items-start mb-1">
              <h3 style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="font-semibold text-ink-primary">{proj.name}</h3>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: `${data.layout.bodyFontSize * 0.85}pt` }}
                  className="text-themeaccent shrink-0"
                >
                  查看项目
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
  // Detailed markdown mode
  if (data.skillDisplayMode === 'detailed' && data.skillsMarkdown) {
    return (
      <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
        <h2
          style={{ fontSize: `${data.layout.headingFontSize}pt` }}
          className="font-bold uppercase tracking-[0.06em] text-ink-primary mb-4"
        >
          技能特长
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
        style={{ fontSize: `${data.layout.headingFontSize}pt` }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary mb-4"
      >
        技能特长
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
                {skill.showLevel && <SkillLevelDots level={skill.level} color={data.color} />}
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
  if (data.awards.length === 0) return null
  return (
    <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }}>
      <h2
        style={{ fontSize: `${data.layout.headingFontSize}pt` }}
        className="font-bold uppercase tracking-[0.06em] text-ink-primary mb-4"
      >
        荣誉奖项
      </h2>
      <div className="space-y-3">
        {data.awards.map((award) => (
          <div key={award.id} className="flex justify-between items-start">
            <div>
              <h3 style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="font-semibold text-ink-primary">{award.name}</h3>
              <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary">{award.issuer}</p>
              {award.description && <p style={{ fontSize: `${data.layout.bodyFontSize}pt` }} className="text-ink-secondary">{award.description}</p>}
            </div>
            <span style={{ fontSize: `${data.layout.bodyFontSize * 0.9}pt` }} className="text-ink-tertiary shrink-0">{award.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function renderOrderedSections(data: ResumeData) {
  return data.sectionOrder.map((item) => {
    if (item.type === 'builtin') {
      switch (item.sectionType) {
        case 'summary': return <SummarySection key="summary" data={data} />
        case 'experience': return <ExperienceSection key="experience" data={data} />
        case 'education': return <EducationSection key="education" data={data} />
        case 'skills': return <SkillsSection key="skills" data={data} />
        case 'projects': return <ProjectsSection key="projects" data={data} />
        case 'awards': return <AwardsSection key="awards" data={data} />
        default: return null
      }
    }
    const custom = data.customSections.find((s) => s.id === item.sectionId)
    if (!custom) return null
    return <CustomSectionRenderer key={custom.id} section={custom} data={data} />
  })
}

export default function ClassicTemplate({ data }: { data: ResumeData }) {
  return (
    <div
      className="w-full h-full bg-white text-ink-primary p-[20mm] leading-relaxed"
      style={{
        fontFamily: fontFamilyMap[data.layout.fontFamily],
        fontSize: `${data.layout.bodyFontSize}pt`,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: `${data.layout.sectionSpacing}mm` }} className="pb-4">
        <h1
          style={{ fontSize: `${data.layout.headingFontSize}pt` }}
          className="font-bold text-ink-primary tracking-wide mb-2"
        >
          {data.personal.name || '您的姓名'}
        </h1>
        <p className="text-[12pt] text-ink-secondary mb-3">{data.personal.title || '目标职位'}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9.5pt] text-ink-secondary">
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.website && <span className="text-themeaccent">{data.personal.website}</span>}
          {data.personal.customFields.map((field) => (
            <span key={field.id} className="text-ink-secondary">{field.label}: {field.value}</span>
          ))}
        </div>
      </div>

      {renderOrderedSections(data)}
    </div>
  )
}
