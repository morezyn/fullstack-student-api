export interface Student {
  id: number
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string | null
  major: string | null
  enrollmentYear: number | null
  createdAt: string
  updatedAt: string
}

export interface StudentPayload {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string | null
  major: string | null
  enrollmentYear: number | null
}
