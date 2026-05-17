import { Toaster as Sonner } from 'sonner'

export default function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      toastOptions={{
        style: {
          background: '#1C1917',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '10px',
          padding: '12px 20px',
          fontSize: '0.9375rem',
          fontWeight: 500,
          boxShadow: '0 12px 40px rgba(28,25,23,0.08)',
        },
        duration: 3000,
      }}
    />
  )
}
