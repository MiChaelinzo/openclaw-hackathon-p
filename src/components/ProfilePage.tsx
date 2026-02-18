import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Gear, Bell, Shield, ChartBar, Crown, Clock, PencilSimple, Check, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { UserProfile, Skill, Execution } from '@/lib/types'

interface UserPreferences {
  executionAlerts: boolean
  autoSave: boolean
  showExecutionDetails: boolean
  emailNotifications: boolean
}

interface ProfileStats {
  totalExecutions: number
  averageExecutionTime: number
  lastActive: number
}

interface ProfilePageProps {
  user: UserProfile
  skills: Skill[]
  executions: Execution[]
}

export function ProfilePage({ user, skills, executions }: ProfilePageProps) {
  const [editingProfile, setEditingProfile] = useState(false)
  
  // Profile State
  const [displayName, setDisplayName] = useState(user?.name || 'User')
  const [bio, setBio] = useState(user?.bio || 'No bio provided.')
  
  // Edit Mode State
  const [tempDisplayName, setTempDisplayName] = useState(displayName)
  const [tempBio, setTempBio] = useState(bio)

  // Preferences State
  const [preferences, setPreferences] = useState<UserPreferences>({
    executionAlerts: true,
    autoSave: true,
    showExecutionDetails: true,
    emailNotifications: true,
  })

  // Statistics Calculation
  const stats: ProfileStats = {
    totalExecutions: executions?.length || 0,
    averageExecutionTime: executions?.length > 0
      ? executions.reduce((acc, curr) => acc + (curr.duration || 0), 0) / executions.length
      : 0,
    lastActive: executions?.length > 0
      ? Math.max(...executions.map(e => new Date(e.createdAt).getTime()))
      : 0
  }

  const handleSaveProfile = () => {
    setDisplayName(tempDisplayName)
    setBio(tempBio)
    setEditingProfile(false)
    toast.success('Profile updated successfully')
  }

  const handleCancelEdit = () => {
    setTempDisplayName(displayName)
    setTempBio(bio)
    setEditingProfile(false)
  }

  const togglePreference = (key: keyof UserPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms/1000).toFixed(1)}s`
    return `${(ms/60000).toFixed(1)}m`
  }

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Main Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {editingProfile ? (
                    <div className="space-y-2 max-w-sm">
                      <Label>Display Name</Label>
                      <Input 
                        value={tempDisplayName}
                        onChange={(e) => setTempDisplayName(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{displayName}</h2>
                      <Badge variant="secondary" className="gap-1">
                        <Crown size={12} weight="fill" className="text-yellow-500" />
                        Owner
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {editingProfile ? (
                    <>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveProfile}>
                        <Check className="mr-2 h-4 w-4" /> Save
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setEditingProfile(true)}>
                      <PencilSimple className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {editingProfile ? (
                <div className="space-y-2 max-w-lg">
                  <Label>Bio</Label>
                  <Input 
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    maxLength={160}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground max-w-lg">{bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <ChartBar size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Skills</p>
              <p className="text-2xl font-bold">{skills?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
              <Gear size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Executions</p>
              <p className="text-2xl font-bold">{stats.totalExecutions}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
              <Clock size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Time</p>
              <p className="text-2xl font-bold">{formatTime(stats.averageExecutionTime)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
              <User size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Active</p>
              <p className="text-lg font-bold">{formatDate(stats.lastActive)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="preferences" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4 gap-2">
            <Gear size={16} /> Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4 gap-2">
            <Bell size={16} /> Notifications
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4 gap-2">
            <ChartBar size={16} /> Activity
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-4 gap-2">
            <Shield size={16} /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Interface Settings</CardTitle>
              <CardDescription>Customize how the dashboard behaves.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Auto-Save Changes</Label>
                  <p className="text-xs text-muted-foreground">Automatically save changes to skills as you type.</p>
                </div>
                <Switch 
                  checked={preferences.autoSave}
                  onCheckedChange={() => togglePreference('autoSave')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Show Execution Details</Label>
                  <p className="text-xs text-muted-foreground">Expand execution logs by default.</p>
                </div>
                <Switch 
                  checked={preferences.showExecutionDetails}
                  onCheckedChange={() => togglePreference('showExecutionDetails')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive weekly summary emails.</p>
                </div>
                <Switch 
                  checked={preferences.emailNotifications}
                  onCheckedChange={() => togglePreference('emailNotifications')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Execution Alerts</Label>
                  <p className="text-xs text-muted-foreground">Notify when a skill execution fails.</p>
                </div>
                <Switch 
                  checked={preferences.executionAlerts}
                  onCheckedChange={() => togglePreference('executionAlerts')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions with the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {executions.slice(0, 3).map((exec, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-4 ${exec.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Executed {exec.skillId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(exec.createdAt).getTime())}
                      </p>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatTime(exec.duration || 0)}
                    </div>
                  </div>
                ))}
                {executions.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent activity found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your data and privacy settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Data Usage</h3>
                <p className="text-sm text-muted-foreground">
                  No data is transmitted to external servers except when using AI features.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">Export Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download a copy of your skills and execution history.
                </p>
                <Button variant="outline" size="sm">
                  Export Personal Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}