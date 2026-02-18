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
  paymentAddress?: string
  x402Enabled?: boolean
}

export interface PaymentTransaction {
  id: string
  skillId: string
  skillName: string
  amount: number
  currency: 'USDC'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  timestamp: number
  txHash?: string
  fromAddress?: string
  toAddress?: string
  error?: string
  retryCount?: number
  completedAt?: number
}

export interface WalletState {
  address: string | null
  balance: number
  isConnected: boolean
  network?: string
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

export interface Review {
  id: string
  skillId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  helpful: number
  notHelpful: number
  verified: boolean
  timestamp: number
  updatedAt?: number
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface UserProfile {
  login: string
  email: string
  avatarUrl: string
  id: number
  isOwner: boolean
}

export interface OnboardingState {
  completed: boolean
  currentStep: number
  completedAt?: number
  skipped: boolean
}

export interface APIIntegration {
  id: string
  name: string
  type: 'github' | 'openai' | 'anthropic' | 'custom'
  apiKey: string
  isValid?: boolean
  lastValidated?: number
  createdAt: number
  updatedAt: number
  metadata?: {
    baseUrl?: string
    organizationId?: string
    customHeaders?: Record<string, string>
  }
}

export interface AppSettings {
  theme: 'light' | 'dark'
  notifications: boolean
  autoSave: boolean
  codeEditorTheme: string
}
