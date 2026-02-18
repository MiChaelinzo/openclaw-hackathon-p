import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Gear, 
  Bell, 
  Key, 
  Palette,
  Database,
  Shield
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { APIIntegrations } from '@/components/settings/APIIntegrations'
import type { APIIntegration } from '@/lib/types'

interface Settings {
  notifications: {
    enabled: boolean
    skillExecution: boolean
    marketplace: boolean
    systemUpdates: boolean
  }
  api: {
    githubToken?: string
    openaiKey?: string
  }
  theme: {
    compactMode: boolean
    animationsEnabled: boolean
  }
  advanced: {
    autoExecute: boolean
    debugMode: boolean
    maxConcurrentExecutions: number
  }
}

const defaultSettings: Settings = {
  notifications: {
    enabled: true,
    skillExecution: true,
    marketplace: true,
    systemUpdates: true
  },
  api: {},
  theme: {
    compactMode: false,
    animationsEnabled: true
  },
  advanced: {
    autoExecute: false,
    debugMode: false,
    maxConcurrentExecutions: 5
  }
}

export function SettingsPanel() {
  const [settings, setSettings] = useKV<Settings>('app-settings', defaultSettings)
  const [apiIntegrations, setApiIntegrations] = useKV<APIIntegration[]>('api-integrations', [])
  const [activeTab, setActiveTab] = useState('notifications')
  
  const currentSettings = settings || defaultSettings

  const updateSettings = (section: keyof Settings, key: string, value: unknown) => {
    setSettings(current => {
      const currentSettings = current || defaultSettings
      return {
        ...currentSettings,
        [section]: {
          ...currentSettings[section],
          [key]: value
        }
      }
    })
    toast.success('Settings updated')
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    toast.success('Settings reset to defaults')
  }

  const handleAddIntegration = (integration: APIIntegration) => {
    setApiIntegrations(current => [...(current || []), integration])
  }

  const handleRemoveIntegration = (id: string) => {
    setApiIntegrations(current => (current || []).filter(i => i.id !== id))
  }

  const handleUpdateIntegration = (integration: APIIntegration) => {
    setApiIntegrations(current => 
      (current || []).map(i => i.id === integration.id ? integration : i)
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      <div className="flex-shrink-0 flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em] flex items-center gap-3">
            <Gear size={32} />
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your AgentDev Studio experience
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetSettings}>
          Reset All
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={16} />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key size={16} />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="theme" className="gap-2">
            <Palette size={16} />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Shield size={16} />
            Advanced
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="notifications" className="m-0">
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts and updates
                  </p>
                </div>
                <Switch
                  checked={currentSettings.notifications.enabled}
                  onCheckedChange={(checked) => updateSettings('notifications', 'enabled', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Skill Execution Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when skills complete
                  </p>
                </div>
                <Switch
                  checked={currentSettings.notifications.skillExecution}
                  onCheckedChange={(checked) => updateSettings('notifications', 'skillExecution', checked)}
                  disabled={!currentSettings.notifications.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketplace Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    New skills and updates available
                  </p>
                </div>
                <Switch
                  checked={currentSettings.notifications.marketplace}
                  onCheckedChange={(checked) => updateSettings('notifications', 'marketplace', checked)}
                  disabled={!currentSettings.notifications.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Platform updates and announcements
                  </p>
                </div>
                <Switch
                  checked={currentSettings.notifications.systemUpdates}
                  onCheckedChange={(checked) => updateSettings('notifications', 'systemUpdates', checked)}
                  disabled={!currentSettings.notifications.enabled}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="m-0">
            <APIIntegrations
              integrations={apiIntegrations || []}
              onAdd={handleAddIntegration}
              onRemove={handleRemoveIntegration}
              onUpdate={handleUpdateIntegration}
            />
          </TabsContent>

          <TabsContent value="theme" className="m-0">
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing for more content
                  </p>
                </div>
                <Switch
                  checked={currentSettings.theme.compactMode}
                  onCheckedChange={(checked) => updateSettings('theme', 'compactMode', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Smooth transitions and effects
                  </p>
                </div>
                <Switch
                  checked={currentSettings.theme.animationsEnabled}
                  onCheckedChange={(checked) => updateSettings('theme', 'animationsEnabled', checked)}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="m-0">
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Execute Skills</Label>
                  <p className="text-sm text-muted-foreground">
                    Run skills automatically when conditions are met
                  </p>
                </div>
                <Switch
                  checked={currentSettings.advanced.autoExecute}
                  onCheckedChange={(checked) => updateSettings('advanced', 'autoExecute', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Show detailed logs and error traces
                  </p>
                </div>
                <Switch
                  checked={currentSettings.advanced.debugMode}
                  onCheckedChange={(checked) => updateSettings('advanced', 'debugMode', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="max-executions">Max Concurrent Executions</Label>
                <Input
                  id="max-executions"
                  type="number"
                  min="1"
                  max="20"
                  value={currentSettings.advanced.maxConcurrentExecutions}
                  onChange={(e) => updateSettings('advanced', 'maxConcurrentExecutions', parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of skills that can run simultaneously
                </p>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
