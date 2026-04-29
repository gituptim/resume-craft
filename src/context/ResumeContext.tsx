import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { ResumeData, TemplateId, ResumeAction } from '../types/resume'

const STORAGE_KEY = 'resume-craft-data'
const TEMPLATE_KEY = 'resume-craft-template'

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const defaultSectionOrder = [
  { type: 'builtin' as const, sectionType: 'summary' as const },
  { type: 'builtin' as const, sectionType: 'experience' as const },
  { type: 'builtin' as const, sectionType: 'education' as const },
  { type: 'builtin' as const, sectionType: 'skills' as const },
  { type: 'builtin' as const, sectionType: 'projects' as const },
]

export const defaultResumeData: ResumeData = {
  personal: {
    name: '张三',
    title: '高级前端工程师',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    location: '北京市',
    website: 'https://github.com/zhangsan',
  },
  summary: '5年前端开发经验，精通 React 生态，擅长性能优化与工程化建设。具备良好的团队协作能力和技术领导力，曾主导多个大型项目从0到1的架构设计与落地。',
  experience: [
    {
      id: generateId(),
      company: '某互联网大厂',
      position: '高级前端工程师',
      startDate: '2021-03',
      endDate: '至今',
      description: '负责公司核心产品前端架构设计与开发，主导微前端改造，将构建时间缩短60%。带领5人前端团队，建立代码规范与CI/CD流程。',
    },
    {
      id: generateId(),
      company: '某科技企业',
      position: '前端工程师',
      startDate: '2019-07',
      endDate: '2021-02',
      description: '参与电商平台前后端分离重构，负责商品详情页、购物车等核心模块开发。引入 TypeScript 提升代码质量，减少线上BUG 40%。',
    },
  ],
  education: [
    {
      id: generateId(),
      school: '某某大学',
      degree: '计算机科学与技术 本科',
      startDate: '2015-09',
      endDate: '2019-06',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Vite', 'Tailwind CSS', 'Git', 'Webpack', '性能优化'],
  projects: [
    {
      id: generateId(),
      name: '开源组件库',
      description: '基于 React + TypeScript 的轻量级 UI 组件库，提供20+常用组件，GitHub Stars 1.2k。',
      link: 'https://github.com/zhangsan/ui-lib',
    },
  ],
  customSections: [],
  sectionOrder: defaultSectionOrder,
  sectionTitles: {},
}

export const defaultTemplate: TemplateId = 'minimal'

function migrateResumeData(raw: unknown): ResumeData {
  if (!raw || typeof raw !== 'object') return defaultResumeData

  const d = raw as Record<string, unknown>

  // Check if already has new fields — still need to patch missing ones
  if (Array.isArray(d.sectionOrder) && Array.isArray(d.customSections)) {
    const data = d as ResumeData
    if (!data.sectionTitles) {
      data.sectionTitles = {}
    }
    return data
  }

  // Legacy migration
  return {
    personal: (d.personal as ResumeData['personal']) ?? defaultResumeData.personal,
    summary: (d.summary as string) ?? '',
    experience: Array.isArray(d.experience) ? (d.experience as ResumeData['experience']) : [],
    education: Array.isArray(d.education) ? (d.education as ResumeData['education']) : [],
    skills: Array.isArray(d.skills) ? (d.skills as string[]) : [],
    projects: Array.isArray(d.projects) ? (d.projects as ResumeData['projects']) : [],
    customSections: [],
    sectionOrder: [...defaultSectionOrder],
    sectionTitles: {},
  }
}

type ResumeState = {
  data: ResumeData
  currentTemplate: TemplateId
}

function getInitialState(): ResumeState {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    const savedTemplate = localStorage.getItem(TEMPLATE_KEY)
    return {
      data: savedData ? migrateResumeData(JSON.parse(savedData)) : defaultResumeData,
      currentTemplate: savedTemplate ? (JSON.parse(savedTemplate) as TemplateId) : defaultTemplate,
    }
  } catch {
    return { data: defaultResumeData, currentTemplate: defaultTemplate }
  }
}

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'UPDATE_PERSONAL':
      return {
        ...state,
        data: { ...state.data, personal: { ...state.data.personal, ...action.payload } },
      }
    case 'UPDATE_SUMMARY':
      return { ...state, data: { ...state.data, summary: action.payload } }

    case 'ADD_EXPERIENCE':
      return {
        ...state,
        data: {
          ...state.data,
          experience: [
            ...state.data.experience,
            { id: generateId(), company: '', position: '', startDate: '', endDate: '', description: '' },
          ],
        },
      }
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        data: {
          ...state.data,
          experience: state.data.experience.map((item) =>
            item.id === action.id ? { ...item, ...action.payload } : item
          ),
        },
      }
    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        data: { ...state.data, experience: state.data.experience.filter((item) => item.id !== action.id) },
      }

    case 'ADD_EDUCATION':
      return {
        ...state,
        data: {
          ...state.data,
          education: [
            ...state.data.education,
            { id: generateId(), school: '', degree: '', startDate: '', endDate: '' },
          ],
        },
      }
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        data: {
          ...state.data,
          education: state.data.education.map((item) =>
            item.id === action.id ? { ...item, ...action.payload } : item
          ),
        },
      }
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        data: { ...state.data, education: state.data.education.filter((item) => item.id !== action.id) },
      }

    case 'ADD_PROJECT':
      return {
        ...state,
        data: {
          ...state.data,
          projects: [
            ...state.data.projects,
            { id: generateId(), name: '', description: '', link: '' },
          ],
        },
      }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        data: {
          ...state.data,
          projects: state.data.projects.map((item) =>
            item.id === action.id ? { ...item, ...action.payload } : item
          ),
        },
      }
    case 'REMOVE_PROJECT':
      return {
        ...state,
        data: { ...state.data, projects: state.data.projects.filter((item) => item.id !== action.id) },
      }

    case 'ADD_SKILL':
      if (state.data.skills.includes(action.payload) || !action.payload.trim()) return state
      return { ...state, data: { ...state.data, skills: [...state.data.skills, action.payload] } }
    case 'REMOVE_SKILL':
      return { ...state, data: { ...state.data, skills: state.data.skills.filter((s) => s !== action.payload) } }

    case 'SET_TEMPLATE':
      return { ...state, currentTemplate: action.payload }

    case 'REORDER_SECTIONS':
      return { ...state, data: { ...state.data, sectionOrder: action.payload } }

    case 'UPDATE_SECTION_TITLE':
      return {
        ...state,
        data: {
          ...state.data,
          sectionTitles: { ...state.data.sectionTitles, [action.sectionType]: action.title },
        },
      }

    case 'ADD_CUSTOM_SECTION': {
      const newSection = {
        id: generateId(),
        title: '自定义板块',
        items: [{ id: generateId(), title: '', subtitle: '', startDate: '', endDate: '', description: '' }],
      }
      return {
        ...state,
        data: {
          ...state.data,
          customSections: [...state.data.customSections, newSection],
          sectionOrder: [...state.data.sectionOrder, { type: 'custom' as const, sectionId: newSection.id }],
        },
      }
    }
    case 'UPDATE_CUSTOM_SECTION':
      return {
        ...state,
        data: {
          ...state.data,
          customSections: state.data.customSections.map((cs) =>
            cs.id === action.id ? { ...cs, ...action.payload } : cs
          ),
        },
      }
    case 'REMOVE_CUSTOM_SECTION':
      return {
        ...state,
        data: {
          ...state.data,
          customSections: state.data.customSections.filter((cs) => cs.id !== action.id),
          sectionOrder: state.data.sectionOrder.filter(
            (item) => !(item.type === 'custom' && item.sectionId === action.id)
          ),
        },
      }
    case 'ADD_CUSTOM_ITEM':
      return {
        ...state,
        data: {
          ...state.data,
          customSections: state.data.customSections.map((cs) =>
            cs.id === action.sectionId
              ? {
                  ...cs,
                  items: [
                    ...cs.items,
                    { id: generateId(), title: '', subtitle: '', startDate: '', endDate: '', description: '' },
                  ],
                }
              : cs
          ),
        },
      }
    case 'UPDATE_CUSTOM_ITEM':
      return {
        ...state,
        data: {
          ...state.data,
          customSections: state.data.customSections.map((cs) =>
            cs.id === action.sectionId
              ? {
                  ...cs,
                  items: cs.items.map((item) =>
                    item.id === action.itemId ? { ...item, ...action.payload } : item
                  ),
                }
              : cs
          ),
        },
      }
    case 'REMOVE_CUSTOM_ITEM':
      return {
        ...state,
        data: {
          ...state.data,
          customSections: state.data.customSections.map((cs) =>
            cs.id === action.sectionId
              ? { ...cs, items: cs.items.filter((item) => item.id !== action.itemId) }
              : cs
          ),
        },
      }

    case 'RESET':
      return { data: defaultResumeData, currentTemplate: state.currentTemplate }
    case 'CLEAR':
      return {
        data: {
          personal: { name: '', title: '', email: '', phone: '', location: '', website: '' },
          summary: '',
          experience: [],
          education: [],
          skills: [],
          projects: [],
          customSections: [],
          sectionOrder: [...defaultSectionOrder],
          sectionTitles: {},
        },
        currentTemplate: state.currentTemplate,
      }
    default:
      return state
  }
}

type ResumeContextType = {
  state: ResumeState
  dispatch: React.Dispatch<ResumeAction>
}

const ResumeContext = createContext<ResumeContextType | null>(null)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, getInitialState())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data))
      localStorage.setItem(TEMPLATE_KEY, JSON.stringify(state.currentTemplate))
    } catch {
      // ignore quota errors
    }
  }, [state.data, state.currentTemplate])

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
}
