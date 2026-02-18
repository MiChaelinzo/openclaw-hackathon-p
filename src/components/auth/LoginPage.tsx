import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GithubLogo, Code, Pulse, Sparkle } from '@phosphor-icons/react'

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg shadow-primary/20">
            <Code size={32} weight="bold" className="text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">AgentDev Studio</h1>
          <p className="text-muted-foreground text-lg">
            Build, test, and deploy OpenClaw agents
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in with your GitHub account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <Button 
              size="lg" 
              className="w-full font-semibold" 
              onClick={onLogin}
            >
              <GithubLogo className="mr-2 h-5 w-5" weight="fill" />
              Sign in with GitHub
            </Button>

            {/* Feature Highlights (Reconstructed from fragments) */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Code size={20} weight="duotone" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Develop</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Pulse size={20} weight="duotone" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Monitor</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Sparkle size={20} weight="duotone" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Deploy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8 px-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}