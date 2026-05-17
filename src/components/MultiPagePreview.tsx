import { useRef, useEffect, useState, useCallback } from 'react'

const A4_HEIGHT_MM = 297
const MM_TO_PX = 3.7795275591 // 1mm ≈ 3.78px at 96dpi

interface MultiPagePreviewProps {
  children: React.ReactNode
}

/**
 * MultiPagePreview – renders A4-width content with visual page-break
 * indicators in preview mode and proper CSS pagination for print.
 *
 * Strategy:
 *  - Content flows naturally inside a 210mm-wide white "paper".
 *  - A ResizeObserver watches the content height and computes how many
 *    A4 pages it spans.  Subtle dashed lines + page-number badges are
 *    drawn at every 297mm boundary **only in screen mode**.
 *  - When the user hits Ctrl+P (or chooses Print) the browser paginates
 *    automatically; `page-break-inside: avoid` keeps sections intact.
 */
export default function MultiPagePreview({ children }: MultiPagePreviewProps) {
  const paperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [pageBreaks, setPageBreaks] = useState<number[]>([])

  const recalc = useCallback(() => {
    const el = contentRef.current
    if (!el) return
    const heightPx = el.scrollHeight
    const a4Px = A4_HEIGHT_MM * MM_TO_PX
    const pages = Math.max(1, Math.ceil(heightPx / a4Px))
    const breaks: number[] = []
    for (let i = 1; i < pages; i++) {
      breaks.push(i * a4Px)
    }
    setPageBreaks(breaks)
  }, [])

  useEffect(() => {
    recalc()
    const el = contentRef.current
    if (!el) return

    // Recalculate on resize or when DOM children change
    const ro = new ResizeObserver(recalc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [recalc])

  // Also recalc whenever children change (React re-render)
  useEffect(() => {
    recalc()
  }, [children, recalc])

  return (
    <div className="preview-pane flex-1 bg-paper overflow-y-auto flex flex-col items-center py-8 px-4 lg:px-8">
      {/* A4 paper container */}
      <div
        ref={paperRef}
        className="a4-paper relative w-full max-w-[210mm] bg-white shadow-preview rounded-sm"
      >
        {/* Content area – natural height, no aspect-ratio lock */}
        <div ref={contentRef} className="a4-content">
          {children}
        </div>

        {/* ── Page-break indicators (screen only, hidden when printing) ── */}
        {pageBreaks.map((pos, idx) => (
          <div
            key={idx}
            className="page-break-hint no-print absolute left-0 right-0 pointer-events-none flex items-center"
            style={{ top: pos }}
          >
            <div className="flex-1 border-t border-dashed border-ink-minimal" />
            <span className="text-micro text-ink-tertiary whitespace-nowrap bg-paper px-2 py-0.5 rounded mx-3 shadow-sm">
              第 {idx + 2} 页
            </span>
            <div className="flex-1 border-t border-dashed border-ink-minimal" />
          </div>
        ))}
      </div>
    </div>
  )
}
