import { ResumeProvider, useResume } from './context/ResumeContext'
import Layout from './components/Layout'
import Preview from './components/Preview'
import Sidebar from './components/Sidebar'

function AppContent() {
  const { state } = useResume()

  return (
    <Layout
      sidebar={<Sidebar />}
      preview={<Preview data={state.data} templateId={state.currentTemplate} />}
    />
  )
}

export default function App() {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  )
}
