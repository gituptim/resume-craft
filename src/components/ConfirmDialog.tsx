import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  onConfirm: () => void
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  variant = 'danger',
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[400px] rounded-[14px] p-6 bg-surface border border-divider-faint shadow-lg"
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-headline font-semibold text-ink-primary text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-body text-ink-secondary text-center mt-3">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 px-5 rounded-lg border-divider text-ink-primary bg-surface hover:bg-surface-highlight hover:border-ink-tertiary text-sm font-medium transition-all duration-200"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className={`h-9 px-5 rounded-lg text-sm font-medium text-white transition-all duration-200 ${
              variant === 'danger'
                ? 'bg-danger hover:bg-danger/90'
                : 'bg-themeaccent hover:bg-themeaccent-hover'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
