import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import type { Student } from '../types/student'

interface ConfirmDialogProps {
  student: Student
  onCancel: () => void
  onConfirm: () => Promise<void>
}

function ConfirmDialog({ student, onCancel, onConfirm }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [busy, onCancel])

  async function handleConfirm() {
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md animate-fade-in"
      onClick={() => !busy && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="w-full max-w-md rounded-2xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-xl animate-dialog-in dark:border-white/10 dark:bg-slate-900/90"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100 dark:bg-red-950/40 dark:ring-red-900/50">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 id="confirm-title" className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Delete student #{student.id}?
            </h2>
            <p id="confirm-description" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              This will permanently remove {student.firstName} {student.lastName}. This action
              cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            ref={cancelRef}
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors duration-150 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-400 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-red-500 hover:shadow active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-900"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
