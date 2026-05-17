export type PersonalCustomField = {
  id: string
  label: string
  value: string
}

export type PersonalInfo = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website?: string
  customFields: PersonalCustomField[]
}

export type Experience = {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export type Education = {
  id: string
  school: string
  degree: string
  startDate: string
  endDate: string
}

export type Project = {
  id: string
  name: string
  description: string
  link?: string
}

export type Award = {
  id: string
  name: string
  issuer: string
  date: string
  description?: string
}

export type SkillItem = {
  id: string
  name: string
  description: string
  level: number // 1-5
  showLevel: boolean
}

export type CustomSectionItem = {
  id: string
  title: string
  subtitle: string
  startDate: string
  endDate: string
  description: string
}

export type CustomSection = {
  id: string
  title: string
  items: CustomSectionItem[]
}

export type LayoutSettings = {
  sectionSpacing: number // mm, range 4-16
  bodyFontSize: number   // pt, range 8-13
  headingFontSize: number // pt, range 10-16
  fontFamily: 'noto-serif' | 'noto-sans' | 'system'
}

export type BuiltInSectionType = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'awards'

export type SectionOrderItem =
  | { type: 'builtin'; sectionType: BuiltInSectionType }
  | { type: 'custom'; sectionId: string }

export type ResumeData = {
  personal: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: SkillItem[]
  projects: Project[]
  awards: Award[]
  customSections: CustomSection[]
  sectionOrder: SectionOrderItem[]
  layout: LayoutSettings
  color?: string
  skillDisplayMode: 'simple' | 'detailed'
  skillsMarkdown?: string
}

export type TemplateType = 'classic' | 'modern' | 'minimal' | 'creative' | 'elegant' | 'tech' | 'timeline' | 'compact'

export const TEMPLATE_NAMES: Record<TemplateType, string> = {
  classic: '经典商务',
  modern: '现代简约',
  minimal: '极简留白',
  creative: '创意个性',
  elegant: '优雅学术',
  tech: '科技现代',
  timeline: '时间轨迹',
  compact: '紧凑高效',
}
