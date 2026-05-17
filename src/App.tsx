import { Routes, Route } from 'react-router-dom'
import { ResumeProvider } from '@/context/ResumeContext'
import Layout from '@/components/Layout'
import Editor from '@/pages/Editor'
import Landing from '@/pages/Landing'
import Templates from '@/pages/Templates'
import Settings from '@/pages/Settings'
import Toaster from '@/components/Toaster'

export default function App() {
  return (
    <ResumeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Editor />} />
          <Route path="/welcome" element={<Landing />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <Toaster />
    </ResumeProvider>
  )
}
