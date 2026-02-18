import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GithubLogo, Code, Pulse, Sparkle } from '@phosphor-icons/react'

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Code size={32} weight="bold" className="text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2">AgentDev Studio</h1>
          <p className="text-muted-foreground">
            Build, test, and deploy OpenClaw agents
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in with your GitHub account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={onLogin}
              className="w-full gap-2"
              size="lg"
            >
              <GithubLogo size={20} weight="fill" />
              Sign in with GitHub
            </Button>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-2">
                  <Code size={20} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Build Skills</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 mb-2">
                  <Pulse size={20} className="text-accent" />
                </div>
                <p className="text-xs text-muted-foreground">Monitor</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-success/10 mb-2">
                  <Sparkle size={20} weight="fill" className="text-success" />
                </div>
                <p className="text-xs text-muted-foreground">AI Assist</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
