import { useResume } from '../context/ResumeContext'
import { Plus, Trash2 } from 'lucide-react'

export default function ProjectsForm() {
  const { state, dispatch } = useResume()
  const { projects } = state.data

  return (
    <div className="space-y-4">
      {projects.map((proj) => (
        <div key={proj.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">项目</span>
            <button
              onClick={() => dispatch({ type: 'REMOVE_PROJECT', id: proj.id })}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="删除"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <input
            type="text"
            value={proj.name}
            onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', id: proj.id, payload: { name: e.target.value } })}
            placeholder="项目名称"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={proj.link || ''}
            onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', id: proj.id, payload: { link: e.target.value } })}
            placeholder="项目链接（可选）"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={proj.description}
            onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', id: proj.id, payload: { description: e.target.value } })}
            placeholder="项目描述"
            rows={3}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      ))}
      <button
        onClick={() => dispatch({ type: 'ADD_PROJECT' })}
        className="flex items-center gap-1 w-full justify-center py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
      >
        <Plus size={16} />
        添加项目经验
      </button>
    </div>
  )
}
