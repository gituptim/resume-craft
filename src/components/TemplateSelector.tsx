import { useResume } from '../context/ResumeContext'
import type { TemplateId } from '../types/resume'

const templateOptions: { id: TemplateId; label: string }[] = [
  { id: 'minimal', label: '简约商务' },
  { id: 'modern', label: '现代卡片' },
  { id: 'classic', label: '经典学术' },
  { id: 'creative', label: '创意色块' },
]

export default function TemplateSelector() {
  const { state, dispatch } = useResume()

  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <label className="block text-xs text-gray-500 mb-2">选择模板</label>
      <div className="flex gap-2">
        {templateOptions.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => dispatch({ type: 'SET_TEMPLATE', payload: id })}
            className={`flex-1 px-2 py-2 text-xs rounded-md border transition-colors ${
              state.currentTemplate === id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
