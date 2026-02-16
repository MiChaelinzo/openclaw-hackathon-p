export interface Skill {
  id: string
  name: string
  description: string
  code: string
  category: string
  createdAt: number
  updatedAt: number
  tags?: string[]
  author?: string
  version?: string
  downloads?: number
  rating?: number
  reviews?: number
  price?: number
  isPremium?: boolean
  isVerified?: boolean
  dependencies?: string[]
  documentation?: string
}

export interface ExecutionStep {
  id: string
  type: 'reasoning' | 'tool_call' | 'result' | 'error'
  content: string
  timestamp: number
  toolName?: string
  duration?: number
}

export interface Execution {
  id: string
  skillId: string
  skillName: string
  status: 'running' | 'success' | 'error' | 'idle'
  steps: ExecutionStep[]
  startTime: number
  endTime?: number
  error?: string
}

export interface TestCase {
  id: string
  skillId: string
  name: string
  input: string
  expectedOutput?: string
  lastRun?: number
  lastResult?: 'pass' | 'fail'
}
