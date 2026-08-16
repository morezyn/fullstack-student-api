import { useCallback, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from './api/students'
import ConfirmDialog from './components/ConfirmDialog'
import LogoMark from './components/LogoMark'
import StudentForm from './components/StudentForm'
import StudentTable from './components/StudentTable'
import StudentTableSkeleton from './components/StudentTableSkeleton'
import type { Student, StudentPayload } from './types/student'

type Status = { text: string; type: 'success' | 'error' }

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

function App() {
  const [students, setStudents] = useState<Student[]>([])
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [status, setStatus] = useState<Status | null>(null)
  const [tableMessage, setTableMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  const loadStudents = useCallback(async () => {
    try {
      const data = await getStudents()
      setStudents(data)
      setTableMessage(null)
    } catch (err) {
      setTableMessage(errorMessage(err, 'Failed to load students'))
    }
  }, [])

  useEffect(() => {
    loadStudents().finally(() => setLoading(false))
  }, [loadStudents])

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  async function handleSubmit(payload: StudentPayload): Promise<void> {
    const isEditing = editingStudent !== null
    try {
      if (isEditing) {
        await updateStudent(editingStudent.id, payload)
      } else {
        await createStudent(payload)
      }
      await loadStudents()
      setStatus({
        text: isEditing ? 'Student updated successfully.' : 'Student created successfully.',
        type: 'success',
      })
      setEditingStudent(null)
    } catch (err) {
      setStatus({ text: errorMessage(err, 'Request failed'), type: 'error' })
      throw err
    }
  }

  function handleEdit(student: Student) {
    setStatus(null)
    setEditingStudent(student)
  }

  function handleCancel() {
    setStatus(null)
    setEditingStudent(null)
  }

  function handleDeleteRequest(student: Student) {
    setStudentToDelete(student)
  }

  async function handleConfirmDelete(): Promise<void> {
    if (!studentToDelete) return
    try {
      await deleteStudent(studentToDelete.id)
      await loadStudents()
    } catch (err) {
      setTableMessage(errorMessage(err, 'Delete failed'))
    } finally {
      setStudentToDelete(null)
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-0 animate-gradient bg-[length:200%_200%] bg-[linear-gradient(115deg,#f8fafc,#e0e7ff,#cbd5e1,#ddd6fe,#f8fafc)] dark:bg-[linear-gradient(115deg,#020617,#0f172a,#312e81,#1e293b,#020617)]" />
        <div className="absolute inset-0 animate-gradient bg-[length:200%_200%] [animation-delay:5s] [animation-direction:reverse] bg-[linear-gradient(245deg,#f8fafc,#ddd6fe,#e2e8f0,#e0e7ff,#f8fafc)] dark:bg-[linear-gradient(245deg,#020617,#1e293b,#312e81,#0f172a,#020617)]" />
        <div className="absolute -top-32 -left-32 h-96 w-96 animate-blob rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-900/40" />
        <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] animate-blob rounded-full bg-violet-400/35 blur-3xl [animation-delay:4s] dark:bg-violet-900/35" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 animate-blob rounded-full bg-slate-400/30 blur-3xl [animation-delay:8s] dark:bg-slate-900/50" />
        <div className="absolute top-24 left-1/2 h-56 w-56 animate-blob rounded-full bg-indigo-400/25 blur-3xl [animation-delay:2s] dark:bg-indigo-950/40" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-slate-50/60 backdrop-blur-xl animate-slide-down dark:border-white/10 dark:bg-slate-950/60">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-sm">
                <LogoMark className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Student Management
                </p>
                <h1 className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  SMS
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleDark}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-200/60 hover:text-slate-900 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
          <section className="animate-fade-in-up rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-slate-900/60">
            <StudentForm
              student={editingStudent}
              status={status}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </section>

          <section className="animate-fade-in-up rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl [animation-delay:80ms] sm:p-8 dark:border-white/10 dark:bg-slate-900/60">
            {loading ? (
              <StudentTableSkeleton />
            ) : (
              <StudentTable
                students={students}
                message={tableMessage}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            )}
          </section>
        </main>
      </div>

      {studentToDelete && (
        <ConfirmDialog
          student={studentToDelete}
          onCancel={() => setStudentToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

export default App
