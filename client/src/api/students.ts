import type { Student, StudentPayload } from '../types/student'

const API_BASE = '/api/students'

interface ErrorBody {
  error?: string
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ErrorBody
    throw new Error(body.error || `Request failed with status ${res.status}`)
  }
  return (await res.json()) as T
}

export function getStudents(): Promise<Student[]> {
  return request<Student[]>(API_BASE)
}

export function createStudent(payload: StudentPayload): Promise<Student> {
  return request<Student>(API_BASE, { method: 'POST', body: JSON.stringify(payload) })
}

export function updateStudent(id: number, payload: StudentPayload): Promise<Student> {
  return request<Student>(`${API_BASE}/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteStudent(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`${API_BASE}/${id}`, { method: 'DELETE' })
}
