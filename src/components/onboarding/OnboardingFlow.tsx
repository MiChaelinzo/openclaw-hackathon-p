import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { 
  Code, 
  Pulse, 
  ChatCircle, 
  Sparkle, 
  GithubLogo, 
  Lightning,
  Check,
  ArrowRight,
  Eye,
  EyeSlash
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { APIIntegration } from '@/lib/types'

interface OnboardingFlowProps {
  onComplete: (integrations: APIIntegration[]) => void
  onSkip: () => void
  userName: string
}

export function OnboardingFlow({ onComplete, onSkip, userName }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [githubToken, setGithubToken] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [showGithubToken, setShowGithubToken] = useState(false)
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const totalSteps = 4
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateAndComplete = async () => {
    setIsValidating(true)
    
    const integrations: APIIntegration[] = []

    if (githubToken.trim()) {
      integrations.push({
        id: `github-${Date.now()}`,
        name: 'GitHub API',
        type: 'github',
        apiKey: githubToken,
        isValid: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
    }

    if (openaiKey.trim()) {
      integrations.push({
        id: `openai-${Date.now()}`,
        name: 'OpenAI API',
        type: 'openai',
        apiKey: openaiKey,
        isValid: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    
    setIsValidating(false)
    toast.success('Setup complete! Welcome to AgentDev Studio')
    onComplete(integrations)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-4">
                <Code size={40} weight="bold" className="text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Welcome, {userName}!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Let's get you set up with AgentDev Studio. We'll walk you through the key features and help you configure your environment.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Code size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Build Skills</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and edit OpenClaw skills with intelligent code completion
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                  <Pulse size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Monitor Execution</h3>
                  <p className="text-sm text-muted-foreground">
                    Watch your agents work in real-time with detailed step tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-success/10">
                  <ChatCircle size={20} className="text-success" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Get intelligent debugging help and code suggestions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Sparkle size={32} weight="fill" className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Key Features</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                AgentDev Studio is packed with tools to accelerate your agent development
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Check size={20} className="text-success" weight="bold" />
                <span className="font-medium">Skill Marketplace</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Check size={20} className="text-success" weight="bold" />
                <span className="font-medium">AI-Powered Code Generation</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Check size={20} className="text-success" weight="bold" />
                <span className="font-medium">Testing Playground</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Check size={20} className="text-success" weight="bold" />
                <span className="font-medium">Analytics Dashboard</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Check size={20} className="text-success" weight="bold" />
                <span className="font-medium">Collaboration & Sharing</span>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
                <Lightning size={32} weight="fill" className="text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">API Configuration</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Connect your API keys to unlock the full power of AgentDev Studio
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="github-token" className="flex items-center gap-2 mb-2">
                  <GithubLogo size={16} weight="fill" />
                  GitHub Personal Access Token (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="github-token"
                    type={showGithubToken ? 'text' : 'password'}
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGithubToken(!showGithubToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showGithubToken ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used for GitHub API calls in your skills
                </p>
              </div>

              <div>
                <Label htmlFor="openai-key" className="flex items-center gap-2 mb-2">
                  <Sparkle size={16} weight="fill" />
                  OpenAI API Key (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="openai-key"
                    type={showOpenaiKey ? 'text' : 'password'}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showOpenaiKey ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Powers AI assistant and skill generation features
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground">
                  <strong>Note:</strong> You can skip this step and add API keys later in Settings. 
                  All keys are stored securely.
                </p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-4">
                <Check size={32} weight="bold" className="text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You're ready to start building OpenClaw agents. Let's create your first skill!
              </p>
            </div>

            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h3 className="font-semibold">Quick Start Tips:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="mt-0.5 shrink-0" />
                  <span>Browse the Marketplace to discover pre-built skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="mt-0.5 shrink-0" />
                  <span>Use the Generator tab to create skills from natural language</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="mt-0.5 shrink-0" />
                  <span>Monitor executions in real-time from the Monitor tab</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="mt-0.5 shrink-0" />
                  <span>Ask the AI Assistant for help anytime</span>
                </li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </CardTitle>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex items-center justify-between pt-4">
            <div>
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isValidating}
                >
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onSkip}
                disabled={isValidating}
              >
                Skip
              </Button>
              {currentStep < totalSteps - 1 ? (
                <Button onClick={handleNext}>
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={validateAndComplete} disabled={isValidating}>
                  {isValidating ? 'Setting up...' : 'Get Started'}
                  <Check size={16} className="ml-2" weight="bold" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
