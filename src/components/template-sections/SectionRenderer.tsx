import type { ResumeData, SectionOrderItem, TemplateId } from '../../types/resume'
import SummarySection from './SummarySection'
import ExperienceSection from './ExperienceSection'
import EducationSection from './EducationSection'
import SkillsSection from './SkillsSection'
import ProjectsSection from './ProjectsSection'
import CustomSection from './CustomSection'

export default function SectionRenderer({
  section,
  data,
  variant,
}: {
  section: SectionOrderItem
  data: ResumeData
  variant: TemplateId
}) {
  if (section.type === 'builtin') {
    const title = data.sectionTitles[section.sectionType]
    switch (section.sectionType) {
      case 'summary':
        return <SummarySection summary={data.summary} variant={variant} title={title} />
      case 'experience':
        return <ExperienceSection experience={data.experience} variant={variant} title={title} />
      case 'education':
        return <EducationSection education={data.education} variant={variant} title={title} />
      case 'skills':
        return <SkillsSection skills={data.skills} variant={variant} title={title} />
      case 'projects':
        return <ProjectsSection projects={data.projects} variant={variant} title={title} />
    }
  }

  const customSection = data.customSections.find((cs) => cs.id === section.sectionId)
  if (!customSection) return null
  return <CustomSection section={customSection} variant={variant} />
}
