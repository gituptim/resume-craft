import type { ResumeData, TemplateType } from '@/types/resume'
import { TEMPLATE_NAMES } from '@/types/resume'
import type { FC } from 'react'

import ClassicTemplate from './ClassicTemplate'
import ModernTemplate from './ModernTemplate'
import MinimalTemplate from './MinimalTemplate'
import CreativeTemplate from './CreativeTemplate'
import ElegantTemplate from './ElegantTemplate'
import TechTemplate from './TechTemplate'
import TimelineTemplate from './TimelineTemplate'
import CompactTemplate from './CompactTemplate'

export const templates: Record<TemplateType, FC<{ data: ResumeData }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  elegant: ElegantTemplate,
  tech: TechTemplate,
  timeline: TimelineTemplate,
  compact: CompactTemplate,
}

export const templateList: { id: TemplateType; name: string; description: string; thumbnail: string }[] = [
  {
    id: 'classic',
    name: TEMPLATE_NAMES.classic,
    description: '传统单栏排版，稳重大气',
    thumbnail: './template-classic-thumb.png',
  },
  {
    id: 'modern',
    name: TEMPLATE_NAMES.modern,
    description: '双栏布局，信息密度高',
    thumbnail: './template-modern-thumb.png',
  },
  {
    id: 'minimal',
    name: TEMPLATE_NAMES.minimal,
    description: '极致简约，大量留白',
    thumbnail: './template-minimal-thumb.png',
  },
  {
    id: 'creative',
    name: TEMPLATE_NAMES.creative,
    description: '非对称设计，视觉冲击',
    thumbnail: './template-creative-thumb.png',
  },
  {
    id: 'elegant',
    name: TEMPLATE_NAMES.elegant,
    description: '优雅学术风，双栏温暖色调',
    thumbnail: './template-elegant-thumb.png',
  },
  {
    id: 'tech',
    name: TEMPLATE_NAMES.tech,
    description: '科技现代风，深色顶部栏',
    thumbnail: './template-tech-thumb.png',
  },
  {
    id: 'timeline',
    name: TEMPLATE_NAMES.timeline,
    description: '时间线设计，职业发展轨迹',
    thumbnail: './template-timeline-thumb.png',
  },
  {
    id: 'compact',
    name: TEMPLATE_NAMES.compact,
    description: '紧凑高效，内容极多首选',
    thumbnail: './template-compact-thumb.png',
  },
]

export { ClassicTemplate, ModernTemplate, MinimalTemplate, CreativeTemplate, ElegantTemplate, TechTemplate, TimelineTemplate, CompactTemplate, TEMPLATE_NAMES }
export type { TemplateType }
