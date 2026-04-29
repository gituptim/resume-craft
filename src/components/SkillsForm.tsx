import { useState } from 'react'
import { useResume } from '../context/ResumeContext'
import { Plus, X } from 'lucide-react'

export default function SkillsForm() {
  const { state, dispatch } = useResume()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    if (input.trim()) {
      dispatch({ type: 'ADD_SKILL', payload: input.trim() })
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入技能名称，按回车添加"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {state.data.skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-md"
          >
            {skill}
            <button
              onClick={() => dispatch({ type: 'REMOVE_SKILL', payload: skill })}
              className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
              title="删除"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
