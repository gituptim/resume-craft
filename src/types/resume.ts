export type PersonalInfo = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website?: string
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

export type BuiltInSectionType = 'summary' | 'experience' | 'education' | 'skills' | 'projects'

export type SectionOrderItem =
  | { type: 'builtin'; sectionType: BuiltInSectionType }
  | { type: 'custom'; sectionId: string }

export type ResumeData = {
  personal: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects: Project[]
  customSections: CustomSection[]
  sectionOrder: SectionOrderItem[]
  sectionTitles: Partial<Record<BuiltInSectionType, string>>
}

export type TemplateId = 'minimal' | 'modern' | 'classic' | 'creative'

export type ResumeAction =
  | { type: 'UPDATE_PERSONAL'; payload: Partial<PersonalInfo> }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'ADD_EXPERIENCE' }
  | { type: 'UPDATE_EXPERIENCE'; id: string; payload: Partial<Experience> }
  | { type: 'REMOVE_EXPERIENCE'; id: string }
  | { type: 'ADD_EDUCATION' }
  | { type: 'UPDATE_EDUCATION'; id: string; payload: Partial<Education> }
  | { type: 'REMOVE_EDUCATION'; id: string }
  | { type: 'ADD_PROJECT' }
  | { type: 'UPDATE_PROJECT'; id: string; payload: Partial<Project> }
  | { type: 'REMOVE_PROJECT'; id: string }
  | { type: 'ADD_SKILL'; payload: string }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: TemplateId }
  | { type: 'UPDATE_SECTION_TITLE'; sectionType: BuiltInSectionType; title: string }
  | { type: 'REORDER_SECTIONS'; payload: SectionOrderItem[] }
  | { type: 'ADD_CUSTOM_SECTION' }
  | { type: 'UPDATE_CUSTOM_SECTION'; id: string; payload: Partial<Pick<CustomSection, 'title'>> }
  | { type: 'REMOVE_CUSTOM_SECTION'; id: string }
  | { type: 'ADD_CUSTOM_ITEM'; sectionId: string }
  | { type: 'UPDATE_CUSTOM_ITEM'; sectionId: string; itemId: string; payload: Partial<CustomSectionItem> }
  | { type: 'REMOVE_CUSTOM_ITEM'; sectionId: string; itemId: string }
  | { type: 'RESET' }
  | { type: 'CLEAR' }
