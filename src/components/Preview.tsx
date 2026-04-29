import { useState } from 'react'
import type { ResumeData, TemplateId } from '../types/resume'
import { templates } from '../templates'
import { ZoomIn, ZoomOut, Printer } from 'lucide-react'
import { handlePrint } from '../utils/print'

type ZoomLevel = 'fit' | 'actual'

export default function Preview({ data, templateId }: { data: ResumeData; templateId: TemplateId }) {
  const [zoom, setZoom] = useState<ZoomLevel>('fit')
  const Template = templates[templateId]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="preview-controls flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <span className="text-sm text-gray-500">实时预览</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(zoom === 'fit' ? 'actual' : 'fit')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            title={zoom === 'fit' ? '切换到实际大小' : '切换到适应屏幕'}
          >
            {zoom === 'fit' ? <ZoomIn size={16} /> : <ZoomOut size={16} />}
            {zoom === 'fit' ? '适应屏幕' : '实际大小'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Printer size={16} />
            打印 / 导出 PDF
          </button>
        </div>
      </div>

      <div className="preview-container flex-1 overflow-auto p-6 flex justify-center">
        <div
          className="preview-inner origin-top transition-transform duration-200"
          style={{
            transform: zoom === 'fit' ? 'scale(var(--preview-scale, 1))' : 'none',
          }}
        >
          <div className="resume-page bg-white shadow-lg">
            <Template data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
