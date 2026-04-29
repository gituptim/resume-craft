import { useState, useCallback, type DragEvent } from 'react'
import { useResume } from '../context/ResumeContext'
import type { SectionOrderItem, BuiltInSectionType } from '../types/resume'
import EditorSection from './EditorSection'
import PersonalInfoForm from './PersonalInfoForm'
import SummaryForm from './SummaryForm'
import ExperienceForm from './ExperienceForm'
import EducationForm from './EducationForm'
import ProjectsForm from './ProjectsForm'
import SkillsForm from './SkillsForm'
import CustomSectionForm from './CustomSectionForm'
import TemplateSelector from './TemplateSelector'
import { RotateCcw, Trash2, Plus, X } from 'lucide-react'

const builtInSectionTitles: Record<BuiltInSectionType, string> = {
  summary: '自我评价',
  experience: '工作经历',
  education: '教育背景',
  projects: '项目经验',
  skills: '技能',
}

export default function Sidebar() {
  const { state, dispatch } = useResume()
  const { sectionOrder, customSections } = state.data
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleClear = () => {
    if (window.confirm('确定要清空所有内容吗？此操作不可撤销。')) {
      dispatch({ type: 'CLEAR' })
    }
  }

  const handleDragStart = useCallback((e: DragEvent, index: number) => {
    setDraggingIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }, [])

  const handleDragOver = useCallback((e: DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggingIndex !== null && draggingIndex !== index) {
      setDragOverIndex(index)
    }
  }, [draggingIndex])

  const handleDrop = useCallback((e: DragEvent, dropIndex: number) => {
    e.preventDefault()
    const fromIndex = Number(e.dataTransfer.getData('text/plain'))
    if (fromIndex === dropIndex || isNaN(fromIndex)) {
      setDraggingIndex(null)
      setDragOverIndex(null)
      return
    }

    const newOrder = [...sectionOrder]
    const [moved] = newOrder.splice(fromIndex, 1)
    newOrder.splice(dropIndex, 0, moved)
    dispatch({ type: 'REORDER_SECTIONS', payload: newOrder })
    setDraggingIndex(null)
    setDragOverIndex(null)
  }, [sectionOrder, dispatch])

  const handleDragEnd = useCallback(() => {
    setDraggingIndex(null)
    setDragOverIndex(null)
  }, [])

  const renderSectionEditor = (item: SectionOrderItem, index: number) => {
    const isDragging = draggingIndex === index
    const isDragOver = dragOverIndex === index && draggingIndex !== index

    if (item.type === 'builtin') {
      const sectionType = item.sectionType
      const title = state.data.sectionTitles[sectionType] || builtInSectionTitles[sectionType]
      return (
        <EditorSection
          key={sectionType}
          title={title}
          dragHandle
          draggable
          isDragging={isDragging}
          isDragOver={isDragOver}
          editableTitle
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          onTitleChange={(newTitle) => dispatch({ type: 'UPDATE_SECTION_TITLE', sectionType, title: newTitle })}
        >
          {sectionType === 'summary' && <SummaryForm />}
          {sectionType === 'experience' && <ExperienceForm />}
          {sectionType === 'education' && <EducationForm />}
          {sectionType === 'projects' && <ProjectsForm />}
          {sectionType === 'skills' && <SkillsForm />}
        </EditorSection>
      )
    }

    const customSection = customSections.find((cs) => cs.id === item.sectionId)
    if (!customSection) return null

    return (
      <EditorSection
        key={customSection.id}
        title={customSection.title}
        dragHandle
        draggable
        isDragging={isDragging}
        isDragOver={isDragOver}
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
        onDragEnd={handleDragEnd}
      >
        <CustomSectionForm sectionId={customSection.id} />
        <button
          onClick={() => dispatch({ type: 'REMOVE_CUSTOM_SECTION', id: customSection.id })}
          className="flex items-center gap-1 mt-3 px-3 py-1.5 text-xs text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
        >
          <X size={13} />
          删除此板块
        </button>
      </EditorSection>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="py-3 px-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">编辑简历</h2>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            title="恢复默认数据"
          >
            <RotateCcw size={13} />
            重置
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
            title="清空所有内容"
          >
            <Trash2 size={13} />
            清空
          </button>
        </div>
      </div>
      <TemplateSelector />
      <EditorSection title="个人信息">
        <PersonalInfoForm />
      </EditorSection>
      {sectionOrder.map((item, index) => renderSectionEditor(item, index))}
      <div className="px-4 py-3">
        <button
          onClick={() => dispatch({ type: 'ADD_CUSTOM_SECTION' })}
          className="flex items-center gap-1 w-full justify-center py-2 text-sm text-green-600 border border-dashed border-green-300 rounded-md hover:bg-green-50 transition-colors"
        >
          <Plus size={16} />
          添加自定义板块
        </button>
      </div>
    </div>
  )
}
