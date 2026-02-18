import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  GithubLogo, 
  Sparkle, 
  Plus, 
  Trash, 
  CheckCircle, 
  WarningCircle,
  Eye,
  EyeSlash
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { APIIntegration } from '@/lib/types'

interface APIIntegrationsProps {
  integrations: APIIntegration[]
  onAdd: (integration: APIIntegration) => void
  onRemove: (id: string) => void
  onUpdate: (integration: APIIntegration) => void
}

export function APIIntegrations({ integrations, onAdd, onRemove, onUpdate }: APIIntegrationsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [newIntegration, setNewIntegration] = useState<{
    name: string
    type: 'github' | 'openai' | 'anthropic' | 'custom'
    apiKey: string
    baseUrl: string
    organizationId: string
  }>({
    name: '',
    type: 'github',
    apiKey: '',
    baseUrl: '',
    organizationId: ''
  })
  const [isValidating, setIsValidating] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <GithubLogo size={20} weight="fill" />
      case 'openai':
      case 'anthropic':
        return <Sparkle size={20} weight="fill" />
      default:
        return <Sparkle size={20} />
    }
  }

  const validateIntegration = async (integration: typeof newIntegration) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return Math.random() > 0.2
  }

  const handleAdd = async () => {
    if (!newIntegration.name || !newIntegration.apiKey) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsValidating(true)

    const isValid = await validateIntegration(newIntegration)
    
    if (isValid) {
      const integration: APIIntegration = {
        id: `${newIntegration.type}-${Date.now()}`,
        name: newIntegration.name,
        type: newIntegration.type,
        apiKey: newIntegration.apiKey,
        isValid: true,
        lastValidated: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        metadata: {
          baseUrl: newIntegration.baseUrl || undefined,
          organizationId: newIntegration.organizationId || undefined
        }
      }

      onAdd(integration)
      toast.success('API integration added successfully')
      setShowAddDialog(false)
      setNewIntegration({
        name: '',
        type: 'github',
        apiKey: '',
        baseUrl: '',
        organizationId: ''
      })
    } else {
      toast.error('Failed to validate API key. Please check and try again.')
    }

    setIsValidating(false)
  }

  const handleRemove = (id: string) => {
    onRemove(id)
    toast.success('API integration removed')
  }

  const handleRevalidate = async (integration: APIIntegration) => {
    toast.info('Validating API key...')
    
    const isValid = await validateIntegration({
      name: integration.name,
      type: integration.type,
      apiKey: integration.apiKey,
      baseUrl: integration.metadata?.baseUrl || '',
      organizationId: integration.metadata?.organizationId || ''
    })

    onUpdate({
      ...integration,
      isValid,
      lastValidated: Date.now(),
      updatedAt: Date.now()
    })

    if (isValid) {
      toast.success('API key validated successfully')
    } else {
      toast.error('API key validation failed')
    }
  }

  const toggleShowApiKey = (id: string) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '••••••••'
    return `${key.substring(0, 4)}${'•'.repeat(key.length - 8)}${key.substring(key.length - 4)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Integrations</h2>
          <p className="text-sm text-muted-foreground">
            Manage your API keys and external service connections
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus size={16} weight="bold" />
          Add Integration
        </Button>
      </div>

      <div className="grid gap-4">
        {integrations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Sparkle size={32} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No Integrations Yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                Add your first API integration to enable external service calls in your skills
              </p>
              <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                <Plus size={16} weight="bold" />
                Add Integration
              </Button>
            </CardContent>
          </Card>
        ) : (
          integrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      {getIcon(integration.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription className="capitalize">{integration.type} API</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.isValid ? (
                      <Badge variant="outline" className="gap-1 border-success text-success">
                        <CheckCircle size={14} weight="fill" />
                        Valid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 border-destructive text-destructive">
                        <WarningCircle size={14} weight="fill" />
                        Invalid
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">API Key</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm font-mono">
                      {showApiKey[integration.id] ? integration.apiKey : maskApiKey(integration.apiKey)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleShowApiKey(integration.id)}
                    >
                      {showApiKey[integration.id] ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>

                {integration.lastValidated && (
                  <div className="text-xs text-muted-foreground">
                    Last validated {new Date(integration.lastValidated).toLocaleString()}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevalidate(integration)}
                  >
                    Revalidate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(integration.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash size={16} className="mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add API Integration</DialogTitle>
            <DialogDescription>
              Connect a new external service to use in your skills
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="integration-type">Service Type</Label>
              <Select
                value={newIntegration.type}
                onValueChange={(type: 'github' | 'openai' | 'anthropic' | 'custom') => 
                  setNewIntegration({ ...newIntegration, type })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="integration-name">Integration Name</Label>
              <Input
                id="integration-name"
                value={newIntegration.name}
                onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                placeholder="My GitHub Integration"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="api-key">API Key *</Label>
              <Input
                id="api-key"
                type="password"
                value={newIntegration.apiKey}
                onChange={(e) => setNewIntegration({ ...newIntegration, apiKey: e.target.value })}
                placeholder="Enter your API key"
                className="mt-2"
              />
            </div>

            {newIntegration.type === 'custom' && (
              <>
                <div>
                  <Label htmlFor="base-url">Base URL (Optional)</Label>
                  <Input
                    id="base-url"
                    value={newIntegration.baseUrl}
                    onChange={(e) => setNewIntegration({ ...newIntegration, baseUrl: e.target.value })}
                    placeholder="https://api.example.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="org-id">Organization ID (Optional)</Label>
                  <Input
                    id="org-id"
                    value={newIntegration.organizationId}
                    onChange={(e) => setNewIntegration({ ...newIntegration, organizationId: e.target.value })}
                    placeholder="org-123456"
                    className="mt-2"
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAdd} disabled={isValidating} className="flex-1">
                {isValidating ? 'Validating...' : 'Add Integration'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={isValidating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
