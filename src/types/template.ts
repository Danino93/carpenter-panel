import { JobInput } from '../calculators/types'

export interface JobTemplate {
  id: string
  name: string
  description?: string
  jobInput: JobInput
  createdAt: number
  updatedAt: number
  usageCount: number // כמה פעמים השתמשו בתבנית
}

