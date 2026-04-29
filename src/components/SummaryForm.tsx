import { useResume } from '../context/ResumeContext'

export default function SummaryForm() {
  const { state, dispatch } = useResume()

  return (
    <textarea
      value={state.data.summary}
      onChange={(e) => dispatch({ type: 'UPDATE_SUMMARY', payload: e.target.value })}
      placeholder="简要描述你的职业背景、核心优势和求职意向..."
      rows={5}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
    />
  )
}
