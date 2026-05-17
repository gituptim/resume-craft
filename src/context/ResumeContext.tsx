import type { ReactNode } from 'react'
import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react'
import type { ResumeData, PersonalInfo, Experience, Education, Project, Award, CustomSection, SectionOrderItem, TemplateType, SkillItem, LayoutSettings, PersonalCustomField } from '@/types/resume'

const STORAGE_KEY = 'resume-data-v2'
const STORAGE_LEGACY_KEY = 'resume-data-v1'

function migrateLegacyData(parsed: any): ResumeData {
  // Migrate skills from string[] to SkillItem[]
  let skills: SkillItem[] = []
  if (Array.isArray(parsed.skills)) {
    if (parsed.skills.length > 0 && typeof parsed.skills[0] === 'string') {
      skills = parsed.skills.map((name: string, i: number) => ({
        id: `skill-${i}-${Date.now()}`,
        name,
        description: '',
        level: 3,
      }))
    } else {
      skills = parsed.skills
    }
  }

  // Migrate personal customFields
  const personal: PersonalInfo = {
    name: parsed.personal?.name || '',
    title: parsed.personal?.title || '',
    email: parsed.personal?.email || '',
    phone: parsed.personal?.phone || '',
    location: parsed.personal?.location || '',
    website: parsed.personal?.website || '',
    customFields: parsed.personal?.customFields || [],
  }

  // Migrate layout settings
  const legacyLayout = parsed.layout
  let layout: LayoutSettings
  if (legacyLayout && typeof legacyLayout.sectionSpacing === 'number') {
    // New numeric format
    layout = legacyLayout as LayoutSettings
  } else if (legacyLayout && typeof legacyLayout.sectionSpacing === 'string') {
    // Old enum format — convert to numeric
    const spacingMap = { compact: 6, normal: 10, loose: 14 } as const
    const fontMap = { small: 9, normal: 10, large: 12 } as const
    const headingMap = { small: 11, normal: 12, large: 14 } as const
    layout = {
      sectionSpacing: spacingMap[legacyLayout.sectionSpacing as keyof typeof spacingMap] ?? 10,
      bodyFontSize: fontMap[legacyLayout.fontSize as keyof typeof fontMap] ?? 10,
      headingFontSize: headingMap[legacyLayout.headingSize as keyof typeof headingMap] ?? 12,
      fontFamily: 'noto-serif',
    }
  } else {
    layout = {
      sectionSpacing: 10,
      bodyFontSize: 10,
      headingFontSize: 12,
      fontFamily: 'noto-serif',
    }
  }

  // Ensure awards
  const awards = Array.isArray(parsed.awards) ? parsed.awards : []

  // Ensure sectionOrder
  const sectionOrder: SectionOrderItem[] = Array.isArray(parsed.sectionOrder)
    ? parsed.sectionOrder
    : [
        { type: 'builtin', sectionType: 'summary' },
        { type: 'builtin', sectionType: 'experience' },
        { type: 'builtin', sectionType: 'education' },
        { type: 'builtin', sectionType: 'projects' },
        { type: 'builtin', sectionType: 'skills' },
        { type: 'builtin', sectionType: 'awards' },
      ]

  return {
    personal,
    summary: parsed.summary || '',
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    skills,
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    awards,
    customSections: Array.isArray(parsed.customSections) ? parsed.customSections : [],
    sectionOrder,
    layout,
    color: parsed.color || '#B45309',
    skillDisplayMode: parsed.skillDisplayMode || 'simple',
    skillsMarkdown: parsed.skillsMarkdown || '',
  }
}

const defaultResumeData: ResumeData = {
  personal: {
    name: '张三',
    title: '前端开发工程师',
    email: 'zhangsan@example.com',
    phone: '138-0000-0001',
    location: '上海',
    website: 'https://zhangsan.dev',
    customFields: [
      { id: 'cf-1', label: '微信', value: 'zhangsan_dev' },
      { id: 'cf-2', label: 'GitHub', value: 'github.com/zhangsan' },
    ],
  },
  summary: '热爱前端开发，3年Web开发经验。熟悉React和Vue生态，注重代码质量和用户体验。善于团队协作，持续学习新技术。',
  experience: [
    {
      id: 'exp-1',
      company: '字节跳动',
      position: '前端开发工程师',
      startDate: '2021.03',
      endDate: '至今',
      description: '负责前端页面开发与维护，使用React和TypeScript进行组件开发，优化页面性能，提升用户体验。参与前端技术选型与架构设计。',
    },
    {
      id: 'exp-2',
      company: '阿里巴巴',
      position: 'Web开发工程师',
      startDate: '2019.07',
      endDate: '2021.02',
      description: '参与Web应用前端开发，实现响应式页面和交互功能，与后端团队协作完成接口对接，编写前端单元测试保证代码质量。',
    },
    {
      id: 'exp-3',
      company: '美团',
      position: '前端实习生',
      startDate: '2018.06',
      endDate: '2019.06',
      description: '协助完成前端页面开发，学习并实践Vue.js框架，参与移动端H5页面适配，修复浏览器兼容性问题。',
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: '上海交通大学',
      degree: '计算机科学与技术 本科',
      startDate: '2014.09',
      endDate: '2018.06',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'React', description: '熟练使用React进行组件化开发', level: 4, showLevel: true },
    { id: 'sk-2', name: 'Vue.js', description: '熟悉Vue.js及Vue生态工具', level: 4, showLevel: true },
    { id: 'sk-3', name: 'TypeScript', description: '使用TypeScript进行类型安全的开发', level: 4, showLevel: true },
    { id: 'sk-4', name: 'Node.js', description: '具备Node.js后端开发基础', level: 3, showLevel: true },
    { id: 'sk-5', name: 'Webpack', description: '熟悉前端构建工具配置', level: 3, showLevel: true },
    { id: 'sk-6', name: 'Git', description: '熟练使用Git进行版本控制', level: 4, showLevel: true },
    { id: 'sk-7', name: 'CSS3', description: '掌握CSS3新特性及预处理器', level: 4, showLevel: true },
    { id: 'sk-8', name: 'HTML5', description: '熟悉HTML5语义化及新API', level: 4, showLevel: true },
    { id: 'sk-9', name: 'JavaScript', description: '扎实的JavaScript基础与ES6+语法', level: 4, showLevel: true },
  ],
  projects: [
    {
      id: 'proj-1',
      name: '个人博客系统',
      description: '基于React和Node.js开发的个人博客，支持Markdown编辑、文章分类、评论功能，实现了服务端渲染优化SEO。',
      link: 'https://github.com/zhangsan/blog',
    },
    {
      id: 'proj-2',
      name: '电商平台前端',
      description: '参与电商平台前端开发，实现商品列表、购物车、订单管理等模块，使用Vue.js和Element UI组件库，完成了移动端适配。',
    },
  ],
  awards: [],
  customSections: [],
  sectionOrder: [
    { type: 'builtin', sectionType: 'summary' },
    { type: 'builtin', sectionType: 'experience' },
    { type: 'builtin', sectionType: 'education' },
    { type: 'builtin', sectionType: 'projects' },
    { type: 'builtin', sectionType: 'skills' },
    { type: 'builtin', sectionType: 'awards' },
  ],
  layout: {
    sectionSpacing: 10,
    bodyFontSize: 10,
    headingFontSize: 12,
    fontFamily: 'noto-serif',
  },
  color: '#B45309',
  skillDisplayMode: 'simple',
  skillsMarkdown: '',
}

type State = {
  data: ResumeData
  currentTemplate: TemplateType
}

type Action =
  | { type: 'UPDATE_PERSONAL'; payload: Partial<PersonalInfo> }
  | { type: 'ADD_PERSONAL_FIELD'; payload: PersonalCustomField }
  | { type: 'UPDATE_PERSONAL_FIELD'; payload: PersonalCustomField }
  | { type: 'REMOVE_PERSONAL_FIELD'; payload: string }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: Experience }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: Education }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'UPDATE_SKILLS'; payload: SkillItem[] }
  | { type: 'ADD_SKILL'; payload: SkillItem }
  | { type: 'UPDATE_SKILL'; payload: SkillItem }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'REORDER_SKILLS'; payload: SkillItem[] }
  | { type: 'SET_SKILL_DISPLAY_MODE'; payload: 'simple' | 'detailed' }
  | { type: 'UPDATE_SKILLS_MARKDOWN'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'ADD_AWARD'; payload: Award }
  | { type: 'UPDATE_AWARD'; payload: Award }
  | { type: 'REMOVE_AWARD'; payload: string }
  | { type: 'ADD_CUSTOM_SECTION'; payload: CustomSection }
  | { type: 'REMOVE_CUSTOM_SECTION'; payload: string }
  | { type: 'UPDATE_CUSTOM_SECTION'; payload: CustomSection }
  | { type: 'UPDATE_SECTION_ORDER'; payload: SectionOrderItem[] }
  | { type: 'TOGGLE_SECTION'; payload: { sectionType: string; sectionId?: string } }
  | { type: 'MOVE_SECTION_UP'; payload: number }
  | { type: 'MOVE_SECTION_DOWN'; payload: number }
  | { type: 'SET_TEMPLATE'; payload: TemplateType }
  | { type: 'UPDATE_LAYOUT'; payload: Partial<LayoutSettings> }
  | { type: 'RESET_DATA' }
  | { type: 'LOAD_DATA'; payload: ResumeData }

function resumeReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_PERSONAL':
      return { ...state, data: { ...state.data, personal: { ...state.data.personal, ...action.payload } } }

    case 'ADD_PERSONAL_FIELD':
      return {
        ...state,
        data: { ...state.data, personal: { ...state.data.personal, customFields: [...state.data.personal.customFields, action.payload] } },
      }
    case 'UPDATE_PERSONAL_FIELD':
      return {
        ...state,
        data: {
          ...state.data,
          personal: {
            ...state.data.personal,
            customFields: state.data.personal.customFields.map((f) => (f.id === action.payload.id ? action.payload : f)),
          },
        },
      }
    case 'REMOVE_PERSONAL_FIELD':
      return {
        ...state,
        data: {
          ...state.data,
          personal: {
            ...state.data.personal,
            customFields: state.data.personal.customFields.filter((f) => f.id !== action.payload),
          },
        },
      }

    case 'UPDATE_SUMMARY':
      return { ...state, data: { ...state.data, summary: action.payload } }

    case 'ADD_EXPERIENCE':
      return { ...state, data: { ...state.data, experience: [...state.data.experience, action.payload] } }
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        data: { ...state.data, experience: state.data.experience.map((e) => (e.id === action.payload.id ? action.payload : e)) },
      }
    case 'REMOVE_EXPERIENCE':
      return { ...state, data: { ...state.data, experience: state.data.experience.filter((e) => e.id !== action.payload) } }

    case 'ADD_EDUCATION':
      return { ...state, data: { ...state.data, education: [...state.data.education, action.payload] } }
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        data: { ...state.data, education: state.data.education.map((e) => (e.id === action.payload.id ? action.payload : e)) },
      }
    case 'REMOVE_EDUCATION':
      return { ...state, data: { ...state.data, education: state.data.education.filter((e) => e.id !== action.payload) } }

    case 'UPDATE_SKILLS':
      return { ...state, data: { ...state.data, skills: action.payload } }
    case 'ADD_SKILL':
      return { ...state, data: { ...state.data, skills: [...state.data.skills, action.payload] } }
    case 'UPDATE_SKILL':
      return {
        ...state,
        data: { ...state.data, skills: state.data.skills.map((s) => (s.id === action.payload.id ? action.payload : s)) },
      }
    case 'REMOVE_SKILL':
      return { ...state, data: { ...state.data, skills: state.data.skills.filter((s) => s.id !== action.payload) } }
    case 'REORDER_SKILLS':
      return { ...state, data: { ...state.data, skills: action.payload } }
    case 'SET_SKILL_DISPLAY_MODE':
      return { ...state, data: { ...state.data, skillDisplayMode: action.payload } }
    case 'UPDATE_SKILLS_MARKDOWN':
      return { ...state, data: { ...state.data, skillsMarkdown: action.payload } }

    case 'ADD_PROJECT':
      return { ...state, data: { ...state.data, projects: [...state.data.projects, action.payload] } }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        data: { ...state.data, projects: state.data.projects.map((p) => (p.id === action.payload.id ? action.payload : p)) },
      }
    case 'REMOVE_PROJECT':
      return { ...state, data: { ...state.data, projects: state.data.projects.filter((p) => p.id !== action.payload) } }

    case 'ADD_AWARD':
      return { ...state, data: { ...state.data, awards: [...state.data.awards, action.payload] } }
    case 'UPDATE_AWARD':
      return {
        ...state,
        data: { ...state.data, awards: state.data.awards.map((a) => (a.id === action.payload.id ? action.payload : a)) },
      }
    case 'REMOVE_AWARD':
      return { ...state, data: { ...state.data, awards: state.data.awards.filter((a) => a.id !== action.payload) } }

    case 'ADD_CUSTOM_SECTION':
      return {
        ...state,
        data: {
          ...state.data,
          customSections: [...state.data.customSections, action.payload],
          sectionOrder: [...state.data.sectionOrder, { type: 'custom', sectionId: action.payload.id }],
        },
      }
    case 'REMOVE_CUSTOM_SECTION': {
      const sectionId = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          customSections: state.data.customSections.filter((s) => s.id !== sectionId),
          sectionOrder: state.data.sectionOrder.filter((item) => !(item.type === 'custom' && item.sectionId === sectionId)),
        },
      }
    }
    case 'UPDATE_CUSTOM_SECTION':
      return {
        ...state,
        data: {
          ...state.data,
          customSections: state.data.customSections.map((s) => (s.id === action.payload.id ? action.payload : s)),
        },
      }

    case 'UPDATE_SECTION_ORDER':
      return { ...state, data: { ...state.data, sectionOrder: action.payload } }

    case 'TOGGLE_SECTION': {
      const { sectionType, sectionId } = action.payload
      const exists = state.data.sectionOrder.some((item) =>
        item.type === 'builtin' && item.sectionType === sectionType
          ? true
          : item.type === 'custom' && item.sectionId === sectionId
      )
      if (exists) {
        return {
          ...state,
          data: {
            ...state.data,
            sectionOrder: state.data.sectionOrder.filter((item) =>
              item.type === 'builtin' && item.sectionType === sectionType
                ? false
                : item.type === 'custom' && item.sectionId === sectionId
                  ? false
                  : true
            ),
          },
        }
      } else {
        if (sectionId) {
          return {
            ...state,
            data: {
              ...state.data,
              sectionOrder: [...state.data.sectionOrder, { type: 'custom', sectionId }],
            },
          }
        }
        return {
          ...state,
          data: {
            ...state.data,
            sectionOrder: [...state.data.sectionOrder, { type: 'builtin', sectionType: sectionType as any }],
          },
        }
      }
    }

    case 'MOVE_SECTION_UP': {
      const index = action.payload
      if (index <= 0) return state
      const order = [...state.data.sectionOrder]
      const [item] = order.splice(index, 1)
      order.splice(index - 1, 0, item)
      return { ...state, data: { ...state.data, sectionOrder: order } }
    }
    case 'MOVE_SECTION_DOWN': {
      const index = action.payload
      if (index >= state.data.sectionOrder.length - 1) return state
      const order = [...state.data.sectionOrder]
      const [item] = order.splice(index, 1)
      order.splice(index + 1, 0, item)
      return { ...state, data: { ...state.data, sectionOrder: order } }
    }

    case 'UPDATE_LAYOUT':
      return {
        ...state,
        data: { ...state.data, layout: { ...state.data.layout, ...action.payload } },
      }

    case 'SET_TEMPLATE':
      return { ...state, currentTemplate: action.payload }
    case 'RESET_DATA':
      return { ...state, data: { ...defaultResumeData } }
    case 'LOAD_DATA':
      return { ...state, data: action.payload }
    default:
      return state
  }
}

const ResumeContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | null>(null)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, {
    data: defaultResumeData,
    currentTemplate: 'classic',
  })

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const persistState = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data))
      } catch {
        // silently fail
      }
    }, 500)
  }, [state.data])

  useEffect(() => {
    persistState()
  }, [persistState])

  useEffect(() => {
    try {
      // Try new storage key first
      let saved = localStorage.getItem(STORAGE_KEY)
      // Fall back to legacy key
      if (!saved) {
        saved = localStorage.getItem(STORAGE_LEGACY_KEY)
      }
      if (saved) {
        const parsed = JSON.parse(saved)
        const migrated = migrateLegacyData(parsed)
        dispatch({ type: 'LOAD_DATA', payload: migrated })
      }
    } catch {
      // ignore corrupted storage
    }
  }, [])

  return <ResumeContext.Provider value={{ state, dispatch }}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}

export type { Action, State }
