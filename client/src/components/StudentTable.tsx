import { AlertCircle, Pencil, Trash2, Users } from 'lucide-react'
import type { Student } from '../types/student'

interface StudentTableProps {
  students: Student[]
  message: string | null
  onEdit: (student: Student) => void
  onDelete: (student: Student) => void
}

const MAJOR_STYLES = [
  'bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700',
  'bg-zinc-200 text-zinc-800 ring-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:ring-zinc-600',
  'bg-zinc-100 text-zinc-600 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700',
  'bg-zinc-50 text-zinc-700 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700',
  'bg-zinc-200 text-zinc-700 ring-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-600',
  'bg-zinc-100 text-zinc-700 ring-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:ring-zinc-600',
]

function displayValue(value: string | number | null): string {
  return value === null || value === undefined || value === '' ? '—' : String(value)
}

function initials(student: Student): string {
  return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase()
}

function majorStyle(major: string): string {
  let hash = 0
  for (let i = 0; i < major.length; i += 1) {
    hash = (hash + major.charCodeAt(i)) % MAJOR_STYLES.length
  }
  return MAJOR_STYLES[hash]
}

function StudentTable({ students, message, onEdit, onDelete }: StudentTableProps) {
  return (
    <section aria-labelledby="list-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="list-title" className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Students
        </h2>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          {students.length} {students.length === 1 ? 'student' : 'students'}
        </span>
      </div>

      {message && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2 text-sm text-red-600 animate-slide-in dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/70 dark:border-white/10">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                ID
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Name
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Email
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Date of Birth
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Major
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Enrollment Year
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
            {students.length === 0 ? (
              <tr className="animate-fade-in-up">
                <td colSpan={7} className="px-4 py-16 text-center">
                  <Users className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                  <p className="mt-3 font-display text-base font-medium text-slate-700 dark:text-slate-200">
                    No students found yet
                  </p>
                  <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                    Add your first student using the form above.
                  </p>
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr
                  key={student.id}
                  className="animate-fade-in-up transition-colors hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03]"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-400 dark:text-slate-500">
                    #{student.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                        {initials(student)}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{student.email}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {displayValue(student.dateOfBirth)}
                  </td>
                  <td className="px-4 py-3">
                    {student.major ? (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${majorStyle(student.major)}`}
                      >
                        {student.major}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {displayValue(student.enrollmentYear)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => onEdit(student)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-slate-400 dark:hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(student)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 transition-colors hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default StudentTable
