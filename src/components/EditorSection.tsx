import { useState, type ReactNode, type DragEvent, type ChangeEvent, type KeyboardEvent } from 'react'
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react'

export default function EditorSection({
  title,
  children,
  dragHandle = false,
  draggable = false,
  isDragging = false,
  isDragOver = false,
  editableTitle = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onTitleChange,
}: {
  title: string
  children: ReactNode
  dragHandle?: boolean
  draggable?: boolean
  isDragging?: boolean
  isDragOver?: boolean
  editableTitle?: boolean
  onDragStart?: (e: DragEvent) => void
  onDragOver?: (e: DragEvent) => void
  onDrop?: (e: DragEvent) => void
  onDragEnd?: (e: DragEvent) => void
  onTitleChange?: (title: string) => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)

  const handleBlur = () => {
    setIsEditing(false)
    if (onTitleChange && editValue.trim() !== title) {
      onTitleChange(editValue.trim())
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      if (onTitleChange && editValue.trim() !== title) {
        onTitleChange(editValue.trim())
      }
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setEditValue(title)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  return (
    <div
      className={`border-b border-gray-100 transition-all ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-t-2 border-t-blue-500' : ''}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          {dragHandle && (
            <span
              className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500"
              draggable={draggable}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={16} />
            </span>
          )}
          {isEditing && editableTitle ? (
            <input
              type="text"
              value={editValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="text-sm font-medium text-gray-800 px-1 py-0.5 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className={`text-sm font-medium text-gray-800 ${editableTitle ? 'cursor-text hover:text-blue-600' : ''}`}
              onClick={(e) => {
                if (editableTitle) {
                  e.stopPropagation()
                  setIsEditing(true)
                  setEditValue(title)
                }
              }}
            >
              {title}
            </span>
          )}
        </span>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {isOpen && !isDragging && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}
