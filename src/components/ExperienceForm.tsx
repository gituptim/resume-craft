import { useResume } from '../context/ResumeContext'
import { Plus, Trash2 } from 'lucide-react'

export default function ExperienceForm() {
  const { state, dispatch } = useResume()
  const { experience } = state.data

  return (
    <div className="space-y-4">
      {experience.map((exp) => (
        <div key={exp.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">工作经历</span>
            <button
              onClick={() => dispatch({ type: 'REMOVE_EXPERIENCE', id: exp.id })}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="删除"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <input
            type="text"
            value={exp.company}
            onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { company: e.target.value } })}
            placeholder="公司名称"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={exp.position}
            onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { position: e.target.value } })}
            placeholder="职位"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={exp.startDate}
              onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { startDate: e.target.value } })}
              placeholder="开始时间"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={exp.endDate}
              onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { endDate: e.target.value } })}
              placeholder="结束时间"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            value={exp.description}
            onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { description: e.target.value } })}
            placeholder="工作描述"
            rows={3}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      ))}
      <button
        onClick={() => dispatch({ type: 'ADD_EXPERIENCE' })}
        className="flex items-center gap-1 w-full justify-center py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
      >
        <Plus size={16} />
        添加工作经历
      </button>
    </div>
  )
}
