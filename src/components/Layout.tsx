import type { ReactNode } from 'react'

export default function Layout({ sidebar, preview }: { sidebar: ReactNode; preview: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-[40%] min-w-[360px] max-w-[520px] flex flex-col bg-white border-r border-gray-200 overflow-hidden">
        {sidebar}
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        {preview}
      </main>
    </div>
  )
}
