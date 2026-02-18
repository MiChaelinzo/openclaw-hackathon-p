import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Gear, Bell, Shield, ChartBar, Crown, Code, Download, Star } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { UserProfile, Skill, Execution } from '@/lib/types'

interface UserPreferences {
  emailNotifications: boolean
  executionAlerts: boolean
  marketplaceUpdates: boolean
  autoSave: boolean
  compactMode: boolean
  showExecutionDetails: boolean
  defaultSkillCategory: string
}

interface ProfileStats {
  totalSkills: number
  totalExecutions: number
  successRate: number
  averageExecutionTime: number
  lastActive: number
}

interface ProfilePageProps {
  user: UserProfile
  skills: Skill[]
  executions: Execution[]
}

export function ProfilePage({ user, skills, executions }: ProfilePageProps) {
  const [preferences, setPreferences] = useKV<UserPreferences>('user-preferences', {
    emailNotifications: true,
    executionAlerts: true,
    marketplaceUpdates: false,
    autoSave: true,
    compactMode: false,
    showExecutionDetails: true,
    defaultSkillCategory: 'Custom'
  })

  const [displayName, setDisplayName] = useKV<string>('user-display-name', user.login)
  const [bio, setBio] = useKV<string>('user-bio', '')
  const [editingProfile, setEditingProfile] = useState(false)
  const [tempDisplayName, setTempDisplayName] = useState(displayName || user.login)
  const [tempBio, setTempBio] = useState(bio || '')

  const stats: ProfileStats = {
    totalSkills: skills.length,
    totalExecutions: executions.length,
    successRate: executions.length > 0 
      ? (executions.filter(e => e.status === 'success').length / executions.length) * 100 
      : 0,
    averageExecutionTime: executions.length > 0
      ? executions
          .filter(e => e.endTime)
          .reduce((sum, e) => sum + ((e.endTime || 0) - e.startTime), 0) / 
        executions.filter(e => e.endTime).length
      : 0,
    lastActive: executions.length > 0 
      ? Math.max(...executions.map(e => e.startTime))
      : Date.now()
  }

  const recentSkills = skills
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)

  const handleSaveProfile = () => {
    setDisplayName(tempDisplayName)
    setBio(tempBio)
    setEditingProfile(false)
    toast.success('Profile updated successfully')
  }

  const handleCancelEdit = () => {
    setTempDisplayName(displayName || user.login)
    setTempBio(bio || '')
    setEditingProfile(false)
  }

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(current => ({
      ...(current || {
        emailNotifications: true,
        executionAlerts: true,
        marketplaceUpdates: false,
        autoSave: true,
        compactMode: false,
        showExecutionDetails: true,
        defaultSkillCategory: 'Custom'
      }),
      [key]: value
    }))
    toast.success('Preference updated')
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
            Profile & Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account details and preferences
          </p>
        </div>

        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary/20">
                <AvatarImage src={user.avatarUrl} alt={user.login} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.login.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input
                        id="display-name"
                        value={tempDisplayName}
                        onChange={(e) => setTempDisplayName(e.target.value)}
                        className="mt-2"
                        placeholder="Your display name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={tempBio}
                        onChange={(e) => setTempBio(e.target.value)}
                        className="mt-2"
                        placeholder="Tell us about yourself..."
                        maxLength={160}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {tempBio.length}/160 characters
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} size="sm">
                        Save Changes
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold">{displayName || user.login}</h2>
                      {user.isOwner && (
                        <Badge variant="secondary" className="gap-1">
                          <Crown size={14} weight="fill" />
                          Owner
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">@{user.login}</p>
                    {user.email && (
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    )}
                    {bio && (
                      <p className="text-sm text-foreground mt-2">{bio}</p>
                    )}
                    <Button 
                      onClick={() => setEditingProfile(true)} 
                      variant="outline" 
                      size="sm"
                      className="mt-3"
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Code size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalSkills}</p>
                  <p className="text-xs text-muted-foreground">Total Skills</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <ChartBar size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalExecutions}</p>
                  <p className="text-xs text-muted-foreground">Executions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Star size={20} weight="fill" className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.successRate.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Download size={20} className="text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatTime(stats.averageExecutionTime)}</p>
                  <p className="text-xs text-muted-foreground">Avg. Runtime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="preferences" className="gap-2">
              <Gear size={18} />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell size={18} />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <ChartBar size={18} />
              Activity
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield size={18} />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Editor Preferences</CardTitle>
                <CardDescription>
                  Customize your development environment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Auto-save Skills</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically save changes as you type
                    </p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={preferences?.autoSave ?? true}
                    onCheckedChange={(checked) => updatePreference('autoSave', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Reduce spacing and padding for more content
                    </p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={preferences?.compactMode ?? false}
                    onCheckedChange={(checked) => updatePreference('compactMode', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="execution-details">Show Execution Details</Label>
                    <p className="text-xs text-muted-foreground">
                      Display detailed execution steps in monitor
                    </p>
                  </div>
                  <Switch
                    id="execution-details"
                    checked={preferences?.showExecutionDetails ?? true}
                    onCheckedChange={(checked) => updatePreference('showExecutionDetails', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Choose what updates you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive email updates about your account
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences?.emailNotifications ?? true}
                    onCheckedChange={(checked) => updatePreference('emailNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="execution-alerts">Execution Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when executions complete or fail
                    </p>
                  </div>
                  <Switch
                    id="execution-alerts"
                    checked={preferences?.executionAlerts ?? true}
                    onCheckedChange={(checked) => updatePreference('executionAlerts', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketplace-updates">Marketplace Updates</Label>
                    <p className="text-xs text-muted-foreground">
                      Be informed about new skills and updates
                    </p>
                  </div>
                  <Switch
                    id="marketplace-updates"
                    checked={preferences?.marketplaceUpdates ?? false}
                    onCheckedChange={(checked) => updatePreference('marketplaceUpdates', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest skills and executions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Recent Skills</h4>
                  {recentSkills.length > 0 ? (
                    <div className="space-y-2">
                      {recentSkills.map((skill) => (
                        <div 
                          key={skill.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-primary/10">
                              <Code size={16} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{skill.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(skill.updatedAt)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">{skill.category}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills created yet</p>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last active</span>
                      <span className="font-medium">{formatDate(stats.lastActive)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Account type</span>
                      <Badge variant={user.isOwner ? "default" : "secondary"}>
                        {user.isOwner ? 'Owner' : 'User'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">GitHub Account</span>
                      <span className="font-medium">@{user.login}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">User ID</span>
                      <span className="font-mono text-xs">{user.id}</span>
                    </div>
                    {user.email && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{user.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Data & Privacy</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Your data is stored locally in your browser using the Spark KV store. 
                    No data is transmitted to external servers except when using AI features.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download size={16} className="mr-2" />
                    Export My Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
