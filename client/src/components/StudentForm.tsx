import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import type { Student, StudentPayload } from '../types/student'

interface StudentFormProps {
  student: Student | null
  status: { text: string; type: 'success' | 'error' } | null
  onSubmit: (payload: StudentPayload) => Promise<void>
  onCancel: () => void
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  major: string
  enrollmentYear: string
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  major: '',
  enrollmentYear: '',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function toFormState(student: Student | null): FormState {
  if (!student) return EMPTY_FORM
  return {
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    dateOfBirth: student.dateOfBirth ?? '',
    major: student.major ?? '',
    enrollmentYear: student.enrollmentYear?.toString() ?? '',
  }
}

function validate(form: FormState): string | null {
  if (!form.firstName.trim()) return 'First name is required'
  if (form.firstName.trim().length > 50) return 'First name must be 50 characters or fewer'
  if (!form.lastName.trim()) return 'Last name is required'
  if (form.lastName.trim().length > 50) return 'Last name must be 50 characters or fewer'
  if (!form.email.trim()) return 'Email is required'
  if (!EMAIL_REGEX.test(form.email.trim())) return 'Email must be a valid email address'
  if (form.major.trim().length > 100) return 'Major must be 100 characters or fewer'
  if (form.enrollmentYear !== '') {
    const year = Number(form.enrollmentYear)
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      return 'Enrollment year must be a year between 1900 and 2100'
    }
  }
  return null
}

function toPayload(form: FormState): StudentPayload {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    dateOfBirth: form.dateOfBirth || null,
    major: form.major.trim() || null,
    enrollmentYear: form.enrollmentYear === '' ? null : Number(form.enrollmentYear),
  }
}

const inputClass =
  'mt-1.5 w-full rounded-none border-0 border-b border-slate-300 bg-transparent px-0 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-0 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500'

function RequiredMark() {
  return (
    <span className="ml-0.5 text-red-500" aria-hidden="true">
      *
    </span>
  )
}

function StudentForm({ student, status, onSubmit, onCancel }: StudentFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm(toFormState(student))
    setValidationError(null)
  }, [student])

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setValidationError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const error = validate(form)
    if (error) {
      setValidationError(error)
      return
    }
    setValidationError(null)
    setSubmitting(true)
    try {
      await onSubmit(toPayload(form))
      setForm(EMPTY_FORM)
    } catch {
      // error surfaced via status; keep entered values
    } finally {
      setSubmitting(false)
    }
  }

  const errorText = validationError ?? status?.text
  const isError = validationError !== null || status?.type === 'error'

  return (
    <section aria-labelledby="form-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="form-title" className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {student ? 'Update Student' : 'Add Student'}
        </h2>
        {student && (
          <span className="text-xs font-medium text-slate-400 animate-fade-in-up dark:text-slate-500">
            Editing student #{student.id}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            First Name
            <RequiredMark />
            <input
              type="text"
              value={form.firstName}
              maxLength={50}
              autoComplete="off"
              onChange={(e) => updateField('firstName', e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Last Name
            <RequiredMark />
            <input
              type="text"
              value={form.lastName}
              maxLength={50}
              autoComplete="off"
              onChange={(e) => updateField('lastName', e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Email
            <RequiredMark />
            <input
              type="email"
              value={form.email}
              maxLength={100}
              autoComplete="off"
              onChange={(e) => updateField('email', e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Date of Birth
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Major
            <input
              type="text"
              value={form.major}
              maxLength={100}
              autoComplete="off"
              onChange={(e) => updateField('major', e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Enrollment Year
            <input
              type="number"
              value={form.enrollmentYear}
              min={1900}
              max={2100}
              onChange={(e) => updateField('enrollmentYear', e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-slate-950 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:ring-offset-slate-900"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {student ? 'Update Student' : 'Add Student'}
          </button>
          {student && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors duration-150 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
            >
              Cancel
            </button>
          )}
        </div>

        {errorText && (
          <div
            role="status"
            className={`flex items-start gap-2 text-sm animate-slide-in ${
              isError
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }`}
          >
            {isError ? (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{errorText}</span>
          </div>
        )}
      </form>
    </section>
  )
}

export default StudentForm
