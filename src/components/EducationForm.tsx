import { useResume } from '../context/ResumeContext'
import { Plus, Trash2 } from 'lucide-react'

export default function EducationForm() {
  const { state, dispatch } = useResume()
  const { education } = state.data

  return (
    <div className="space-y-4">
      {education.map((edu) => (
        <div key={edu.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">教育背景</span>
            <button
              onClick={() => dispatch({ type: 'REMOVE_EDUCATION', id: edu.id })}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="删除"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <input
            type="text"
            value={edu.school}
            onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { school: e.target.value } })}
            placeholder="学校名称"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={edu.degree}
            onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { degree: e.target.value } })}
            placeholder="学位/专业"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={edu.startDate}
              onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { startDate: e.target.value } })}
              placeholder="开始时间"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={edu.endDate}
              onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { endDate: e.target.value } })}
              placeholder="结束时间"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
      <button
        onClick={() => dispatch({ type: 'ADD_EDUCATION' })}
        className="flex items-center gap-1 w-full justify-center py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
      >
        <Plus size={16} />
        添加教育背景
      </button>
    </div>
  )
}
