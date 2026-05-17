import { toast as sonnerToast } from 'sonner'

type ToastType = 'success' | 'error' | 'info'

interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
}

export function useToast() {
  const showToast = ({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    const baseStyle = {
      background: '#1C1917',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '10px',
      padding: '12px 20px',
      fontSize: '0.9375rem',
      fontWeight: 500,
      boxShadow: '0 12px 40px rgba(28,25,23,0.08)',
    }

    switch (type) {
      case 'success':
        sonnerToast.success(message, {
          style: baseStyle,
          duration,
        })
        break
      case 'error':
        sonnerToast.error(message, {
          style: baseStyle,
          duration,
        })
        break
      default:
        sonnerToast(message, {
          style: baseStyle,
          duration,
        })
    }
  }

  return { showToast }
}

export { sonnerToast as toast }
