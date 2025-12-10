import { JobInput, JobResult } from './types'
import { calculateDeskJob } from './deskCalculator'

export function calculateJob(input: JobInput): JobResult {
  switch (input.projectType) {
    case 'desk':
      return calculateDeskJob(input)
    case 'cabinet':
    case 'sideboard':
    case 'dresser':
    case 'shelf':
    case 'custom':
    default:
      // כרגע משתמשים באותו מחשבון - בעתיד אפשר להוסיף מחשבונים ספציפיים
      return calculateDeskJob(input)
  }
}

export * from './types'
