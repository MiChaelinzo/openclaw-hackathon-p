import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code, Pulse, ChatCircle, Sparkle, Storefront, ChartLine, Flask, House, Gear, Package, SignOut, User, UserCircle } from '@phosphor-icons/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SkillLibrary } from '@/components/SkillLibrary'
import { ExecutionMonitor } from '@/components/ExecutionMonitor'
import { AIAssistant } from '@/components/AIAssistant'
import { SkillGenerator } from '@/components/SkillGenerator'
import { SkillMarketplace } from '@/components/SkillMarketplace'
import { SkillDetails } from '@/components/SkillDetails'
import { PaymentDialog } from '@/components/PaymentDialog'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { TestingPlayground } from '@/components/TestingPlayground'
import { SkillExportImport } from '@/components/SkillExportImport'
import { SettingsPanel } from '@/components/SettingsPanel'
import { ProfilePage } from '@/components/ProfilePage'
import { LoginPage } from '@/components/auth/LoginPage'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { CodeEditor } from '@/components/CodeEditor'
import { NotificationCenter } from '@/components/NotificationCenter'
import { QuickActions } from '@/components/QuickActions'
import { useKeyboardShortcuts, showKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import type { Skill, Execution, PaymentTransaction, Review, UserProfile, OnboardingState, APIIntegration } from '@/lib/types'
import { toast } from 'sonner'
import { marketplaceSkills } from '@/lib/marketplaceDataNew'
import { sampleReviews } from '@/lib/sampleReviews'

function App() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [hasLoggedIn, setHasLoggedIn] = useKV<boolean>('has-logged-in', false)
  const [onboardingState, setOnboardingState] = useKV<OnboardingState>('onboarding-state', {
    completed: false,
    currentStep: 0,
    skipped: false
  })
  const [apiIntegrations, setApiIntegrations] = useKV<APIIntegration[]>('api-integrations', [])
  const [skills, setSkills] = useKV<Skill[]>('agentdev-skills', [])
  const [executions, setExecutions] = useKV<Execution[]>('agentdev-executions', [])
  const [transactions, setTransactions] = useKV<PaymentTransaction[]>('agentdev-transactions', [])
  const [reviews, setReviews] = useKV<Review[]>('skill-reviews', [])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showCreateSkill, setShowCreateSkill] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [viewingSkillDetails, setViewingSkillDetails] = useState<Skill | null>(null)
  const [purchasingSkill, setPurchasingSkill] = useState<Skill | null>(null)

  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    code: '',
    category: 'Custom'
  })

  useEffect(() => {
    async function loadUser() {
      try {
        const userInfo = await window.spark.user()
        if (hasLoggedIn) {
          setUser(userInfo)
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        setUser(null)
      } finally {
        setIsAuthenticating(false)
      }
    }
    loadUser()
  }, [hasLoggedIn])

  useEffect(() => {
    if (!reviews || reviews.length === 0) {
      setReviews(sampleReviews)
    }
  }, [])

  const handleLogin = async () => {
    try {
      const userInfo = await window.spark.user()
      if (userInfo) {
        setUser(userInfo)
        setHasLoggedIn(true)
        toast.success(`Welcome, ${userInfo.login}!`)
      }
    } catch (error) {
      toast.error('Authentication failed')
    }
  }

  const handleOnboardingComplete = (integrations: APIIntegration[]) => {
    setApiIntegrations(integrations)
    setOnboardingState({
      completed: true,
      currentStep: 4,
      completedAt: Date.now(),
      skipped: false
    })
  }

  const handleOnboardingSkip = () => {
    setOnboardingState(current => ({
      completed: true,
      currentStep: current?.currentStep || 0,
      completedAt: Date.now(),
      skipped: true
    }))
  }

  const handleLogout = () => {
    setUser(null)
    setHasLoggedIn(false)
    setSkills([])
    setExecutions([])
    setTransactions([])
    setOnboardingState({
      completed: false,
      currentStep: 0,
      skipped: false
    })
    toast.success('Logged out successfully')
  }

  const handleCreateSkill = () => {
    setNewSkill({
      name: '',
      description: '',
      code: '',
      category: 'Custom'
    })
    setShowCreateSkill(true)
  }

  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'n',
        ctrlKey: true,
        action: handleCreateSkill,
        description: 'Create new skill'
      },
      {
        key: 't',
        ctrlKey: true,
        action: () => setActiveTab('testing'),
        description: 'Go to testing'
      },
      {
        key: 'm',
        ctrlKey: true,
        action: () => setActiveTab('monitor'),
        description: 'Go to monitor'
      },
      {
        key: 'k',
        ctrlKey: true,
        action: () => setActiveTab('marketplace'),
        description: 'Go to marketplace'
      },
      {
        key: '/',
        ctrlKey: true,
        action: () => showKeyboardShortcuts([
          { key: 'n', ctrlKey: true, action: () => {}, description: 'Create new skill' },
          { key: 't', ctrlKey: true, action: () => {}, description: 'Go to testing' },
          { key: 'm', ctrlKey: true, action: () => {}, description: 'Go to monitor' },
          { key: 'k', ctrlKey: true, action: () => {}, description: 'Go to marketplace' },
          { key: '/', ctrlKey: true, action: () => {}, description: 'Show shortcuts' },
        ]),
        description: 'Show shortcuts'
      }
    ]
  })

  const handleSaveSkill = () => {
    if (!newSkill.name || !newSkill.code) {
      toast.error('Please fill in all required fields')
      return
    }

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name,
      description: newSkill.description,
      code: newSkill.code,
      category: newSkill.category,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    setSkills(current => [...(current || []), skill])
    setShowCreateSkill(false)
    toast.success('Skill created successfully')
  }

  const handleDeleteSkill = (skillId: string) => {
    setSkills(current => (current || []).filter(s => s.id !== skillId))
  }

  const handleRunSkill = (skill: Skill) => {
    simulateExecution(skill.id, skill.name)
    setActiveTab('monitor')
  }

  const handleForkSkill = (skill: Skill) => {
    setSkills(current => [...(current || []), skill])
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-skill':
        handleCreateSkill()
        break
      case 'run-test':
        setActiveTab('testing')
        break
      case 'generate-skill':
        setActiveTab('generator')
        break
      case 'view-analytics':
        setActiveTab('analytics')
        break
      case 'browse-marketplace':
        setActiveTab('marketplace')
        break
      case 'quick-execute':
        if ((skills || []).length > 0) {
          const firstSkill = (skills || [])[0]
          handleRunSkill(firstSkill)
        } else {
          toast.info('No skills available to execute')
        }
        break
    }
  }

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill)
    setNewSkill({
      name: skill.name,
      description: skill.description,
      code: skill.code,
      category: skill.category
    })
    setShowCreateSkill(true)
  }

  const handleUpdateSkill = () => {
    if (!selectedSkill) return

    setSkills(current =>
      (current || []).map(s =>
        s.id === selectedSkill.id
          ? {
              ...s,
              name: newSkill.name,
              description: newSkill.description,
              code: newSkill.code,
              category: newSkill.category,
              updatedAt: Date.now()
            }
          : s
      )
    )
    setShowCreateSkill(false)
    setSelectedSkill(null)
    toast.success('Skill updated successfully')
  }

  const handleAIAnalyze = async (prompt: string): Promise<string> => {
    const context = window.spark.llmPrompt(['You are an expert OpenClaw developer assistant. Help the user with their question about OpenClaw agents, skills, and debugging.\n\nUser question: ', '\n\nContext:\n- OpenClaw is an open-source agent runtime that connects AI models to local tools\n- Skills are reusable capabilities that agents can execute\n- Agents use tool calls to interact with systems\n- Common issues include configuration errors, API authentication, and tool discovery\n\nProvide a helpful, actionable response that helps them solve their problem or understand the concept.'], prompt)

    const response = await window.spark.llm(context, 'gpt-4o-mini')
    return response
  }

  const handleGenerateSkill = async (
    description: string
  ): Promise<{ name: string; code: string; description: string }> => {
    const prompt = window.spark.llmPrompt(['You are an expert OpenClaw skill generator. Generate a complete, functional OpenClaw skill based on this description:\n\n', '\n\nReturn a JSON object with these fields:\n- name: A concise skill name (e.g., "GitHub Issue Monitor")\n- description: A clear one-sentence description\n- code: Complete skill code following OpenClaw patterns (include imports, tool usage, error handling)\n\nThe code should be production-ready and follow these patterns:\n- Use proper TypeScript syntax\n- Include error handling\n- Use appropriate tool calls\n- Add helpful comments\n- Follow OpenClaw conventions\n\nReturn ONLY valid JSON with no additional text.'], description)

    const response = await window.spark.llm(prompt, 'gpt-4o-mini', true)
    const parsed = JSON.parse(response)
    return parsed
  }

  const handleSaveGeneratedSkill = (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSkill: Skill = {
      ...skill,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    setSkills(current => [...(current || []), newSkill])
    toast.success('Generated skill saved to library')
    setActiveTab('library')
  }

  const handleInstallSkill = (skill: Skill) => {
    const isAlreadyInstalled = (skills || []).some(s => s.id === skill.id)
    
    if (isAlreadyInstalled) {
      toast.info('Skill is already installed')
      return
    }

    if (skill.isPremium && skill.price && skill.price > 0) {
      setPurchasingSkill(skill)
      return
    }

    const installedSkill: Skill = {
      ...skill,
      id: `installed-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    setSkills(current => [...(current || []), installedSkill])
    toast.success(`${skill.name} installed successfully`)
  }

  const handlePaymentSuccess = () => {
    if (purchasingSkill) {
      const installedSkill: Skill = {
        ...purchasingSkill,
        id: `installed-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }

      setSkills(current => [...(current || []), installedSkill])
      toast.success(`${purchasingSkill.name} installed successfully!`)
      setPurchasingSkill(null)
    }
  }

  const handleViewMarketplaceDetails = (skill: Skill) => {
    setViewingSkillDetails(skill)
  }

  const handleCloseSkillDetails = () => {
    setViewingSkillDetails(null)
  }

  const handleImportSkills = (importedSkills: Skill[]) => {
    setSkills(current => [...(current || []), ...importedSkills])
  }

  const simulateExecution = (skillId: string, skillName: string) => {
    const execution: Execution = {
      id: Date.now().toString(),
      skillId,
      skillName,
      status: 'running',
      steps: [
        {
          id: '1',
          type: 'reasoning',
          content: 'Analyzing task requirements...',
          timestamp: Date.now()
        },
        {
          id: '2',
          type: 'tool_call',
          content: 'Calling GitHub API to fetch issues',
          timestamp: Date.now() + 100,
          toolName: 'github_fetch'
        },
        {
          id: '3',
          type: 'result',
          content: 'Successfully retrieved 5 issues',
          timestamp: Date.now() + 200
        }
      ],
      startTime: Date.now()
    }

    setExecutions(current => [...(current || []), execution])

    setTimeout(() => {
      setExecutions(current =>
        (current || []).map(e =>
          e.id === execution.id
            ? { ...e, status: 'success', endTime: Date.now() + 300 }
            : e
        )
      )
    }, 3000)
  }

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-pulse">
            <Code size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Toaster />
        <LoginPage onLogin={handleLogin} />
      </>
    )
  }

  if (!onboardingState?.completed && !onboardingState?.skipped) {
    return (
      <>
        <Toaster />
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
          userName={user.login}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AgentDev Studio</h1>
              <p className="text-sm text-muted-foreground">
                OpenClaw Development Environment
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">Connected</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.login} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.login.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.login}</p>
                      {user.email && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                    <UserCircle className="mr-2" size={16} />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('settings')}>
                    <Gear className="mr-2" size={16} />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} variant="destructive">
                    <SignOut className="mr-2" size={16} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 h-[calc(100vh-88px)]">
        {viewingSkillDetails ? (
          <SkillDetails
            skill={viewingSkillDetails}
            isInstalled={(skills || []).some(s => s.id === viewingSkillDetails.id || s.name === viewingSkillDetails.name)}
            onInstall={() => handleInstallSkill(viewingSkillDetails)}
            onBack={handleCloseSkillDetails}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="dashboard" className="gap-2">
                <House size={20} weight="fill" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="library" className="gap-2">
                <Code size={20} />
                Skills
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="gap-2">
                <Storefront size={20} />
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="monitor" className="gap-2">
                <Pulse size={20} />
                Monitor
              </TabsTrigger>
              <TabsTrigger value="testing" className="gap-2">
                <Flask size={20} />
                Testing
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <ChartLine size={20} />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="assistant" className="gap-2">
                <ChatCircle size={20} />
                Assistant
              </TabsTrigger>
              <TabsTrigger value="generator" className="gap-2">
                <Sparkle size={20} weight="fill" />
                Generator
              </TabsTrigger>
              <TabsTrigger value="export" className="gap-2">
                <Package size={20} />
                Export/Import
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <UserCircle size={20} />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Gear size={20} />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="dashboard" className="h-full m-0">
                <div className="flex flex-col gap-6 h-full overflow-auto">
                  <div>
                    <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
                      Welcome to AgentDev Studio
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your OpenClaw development command center
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <AnalyticsDashboard 
                        skills={[...(skills || []), ...marketplaceSkills]} 
                        executions={executions || []} 
                      />
                    </div>
                    <div>
                      <QuickActions onAction={handleQuickAction} />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="library" className="h-full m-0">
                <SkillLibrary
                  skills={skills || []}
                  onSelectSkill={handleSelectSkill}
                  onCreateSkill={handleCreateSkill}
                  onDeleteSkill={handleDeleteSkill}
                  onRunSkill={handleRunSkill}
                  onForkSkill={handleForkSkill}
                />
              </TabsContent>

              <TabsContent value="marketplace" className="h-full m-0">
                <SkillMarketplace
                  skills={marketplaceSkills}
                  installedSkills={skills || []}
                  onInstallSkill={handleInstallSkill}
                  onViewDetails={handleViewMarketplaceDetails}
                />
              </TabsContent>

              <TabsContent value="monitor" className="h-full m-0">
                <ExecutionMonitor executions={executions || []} />
              </TabsContent>

              <TabsContent value="testing" className="h-full m-0">
                <TestingPlayground skills={skills || []} />
              </TabsContent>

              <TabsContent value="analytics" className="h-full m-0">
                <AnalyticsDashboard 
                  skills={[...(skills || []), ...marketplaceSkills]} 
                  executions={executions || []} 
                />
              </TabsContent>

              <TabsContent value="assistant" className="h-full m-0">
                <AIAssistant onAnalyze={handleAIAnalyze} />
              </TabsContent>

              <TabsContent value="generator" className="h-full m-0">
                <SkillGenerator
                  onGenerate={handleGenerateSkill}
                  onSave={handleSaveGeneratedSkill}
                />
              </TabsContent>

              <TabsContent value="export" className="h-full m-0">
                <div className="h-full overflow-y-auto">
                  <SkillExportImport
                    skills={skills || []}
                    onImportSkills={handleImportSkills}
                  />
                </div>
              </TabsContent>

              <TabsContent value="profile" className="h-full m-0">
                <ProfilePage 
                  user={user}
                  skills={skills || []}
                  executions={executions || []}
                />
              </TabsContent>

              <TabsContent value="settings" className="h-full m-0">
                <SettingsPanel />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>

      <Dialog open={showCreateSkill} onOpenChange={setShowCreateSkill}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedSkill ? 'Edit Skill' : 'Create New Skill'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Skill Name *</Label>
                <Input
                  id="name"
                  value={newSkill.name}
                  onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="GitHub Issue Monitor"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newSkill.category}
                  onValueChange={category => setNewSkill({ ...newSkill, category })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Custom">Custom</SelectItem>
                    <SelectItem value="Generated">Generated</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                    <SelectItem value="Automation">Automation</SelectItem>
                    <SelectItem value="Integration">Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newSkill.description}
                onChange={e => setNewSkill({ ...newSkill, description: e.target.value })}
                placeholder="Monitors GitHub repositories for new issues..."
                className="mt-2 min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="code">Skill Code *</Label>
              <div className="mt-2">
                <CodeEditor
                  value={newSkill.code}
                  onChange={(code) => setNewSkill({ ...newSkill, code })}
                  language="typescript"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={selectedSkill ? handleUpdateSkill : handleSaveSkill}>
                {selectedSkill ? 'Update Skill' : 'Create Skill'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateSkill(false)
                  setSelectedSkill(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentDialog
        skill={purchasingSkill}
        open={purchasingSkill !== null}
        onOpenChange={(open) => {
          if (!open) setPurchasingSkill(null)
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}

export default App