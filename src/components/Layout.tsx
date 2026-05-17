import type { ReactNode } from 'react'
import TopBar from './TopBar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-paper overflow-hidden">
      <TopBar />
      <main className="flex-1 flex overflow-hidden relative">
        {children}
      </main>
    </div>
  )
}
