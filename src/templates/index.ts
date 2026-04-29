import type { ComponentType } from 'react'
import type { ResumeData } from '../types/resume'
import MinimalTemplate from './MinimalTemplate'
import ModernTemplate from './ModernTemplate'
import ClassicTemplate from './ClassicTemplate'
import CreativeTemplate from './CreativeTemplate'

export const templates: Record<string, ComponentType<{ data: ResumeData }>> = {
  minimal: MinimalTemplate,
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
}
