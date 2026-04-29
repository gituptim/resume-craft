import { useResume } from '../context/ResumeContext'

export default function PersonalInfoForm() {
  const { state, dispatch } = useResume()
  const { personal } = state.data

  const fields = [
    { key: 'name' as const, label: '姓名', placeholder: '请输入姓名' },
    { key: 'title' as const, label: '职位', placeholder: '请输入职位' },
    { key: 'email' as const, label: '邮箱', placeholder: 'example@email.com' },
    { key: 'phone' as const, label: '电话', placeholder: '138-0000-0000' },
    { key: 'location' as const, label: '地址', placeholder: '城市' },
    { key: 'website' as const, label: '网站', placeholder: 'https://...' },
  ]

  return (
    <div className="space-y-3">
      {fields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <input
            type="text"
            value={personal[key] || ''}
            onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL', payload: { [key]: e.target.value } })}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ))}
    </div>
  )
}
