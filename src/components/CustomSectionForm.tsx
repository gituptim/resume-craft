import { useResume } from '../context/ResumeContext'
import { Plus, Trash2 } from 'lucide-react'

export default function CustomSectionForm({ sectionId }: { sectionId: string }) {
  const { state, dispatch } = useResume()
  const section = state.data.customSections.find((cs) => cs.id === sectionId)
  if (!section) return null

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">板块名称</label>
        <input
          type="text"
          value={section.title}
          onChange={(e) => dispatch({ type: 'UPDATE_CUSTOM_SECTION', id: sectionId, payload: { title: e.target.value } })}
          placeholder="例如：获奖经历、证书资质"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {section.items.map((item) => (
        <div key={item.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">条目</span>
            <button
              onClick={() => dispatch({ type: 'REMOVE_CUSTOM_ITEM', sectionId, itemId: item.id })}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="删除"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <input
            type="text"
            value={item.title}
            onChange={(e) => dispatch({ type: 'UPDATE_CUSTOM_ITEM', sectionId, itemId: item.id, payload: { title: e.target.value } })}
            placeholder="标题"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={item.subtitle}
            onChange={(e) => dispatch({ type: 'UPDATE_CUSTOM_ITEM', sectionId, itemId: item.id, payload: { subtitle: e.target.value } })}
            placeholder="副标题"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={item.startDate}
              onChange={(e) => dispatch({ type: 'UPDATE_CUSTOM_ITEM', sectionId, itemId: item.id, payload: { startDate: e.target.value } })}
              placeholder="开始时间"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={item.endDate}
              onChange={(e) => dispatch({ type: 'UPDATE_CUSTOM_ITEM', sectionId, itemId: item.id, payload: { endDate: e.target.value } })}
              placeholder="结束时间"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            value={item.description}
            onChange={(e) => dispatch({ type: 'UPDATE_CUSTOM_ITEM', sectionId, itemId: item.id, payload: { description: e.target.value } })}
            placeholder="描述"
            rows={3}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      ))}
      <button
        onClick={() => dispatch({ type: 'ADD_CUSTOM_ITEM', sectionId })}
        className="flex items-center gap-1 w-full justify-center py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
      >
        <Plus size={16} />
        添加条目
      </button>
    </div>
  )
}
