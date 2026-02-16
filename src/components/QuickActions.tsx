import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  Play,
  Flask,
  Sparkle,
  ChartLine,
  Storefront,
  Lightning
} from '@phosphor-icons/react'

interface QuickActionsProps {
  onAction: (action: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    {
      id: 'create-skill',
      icon: <Plus size={20} weight="bold" />,
      label: 'Create Skill',
      description: 'Build a new skill',
      color: 'text-primary'
    },
    {
      id: 'run-test',
      icon: <Flask size={20} weight="fill" />,
      label: 'Run Tests',
      description: 'Execute test suite',
      color: 'text-accent'
    },
    {
      id: 'generate-skill',
      icon: <Sparkle size={20} weight="fill" />,
      label: 'AI Generate',
      description: 'Generate with AI',
      color: 'text-warning'
    },
    {
      id: 'view-analytics',
      icon: <ChartLine size={20} weight="bold" />,
      label: 'Analytics',
      description: 'View insights',
      color: 'text-success'
    },
    {
      id: 'browse-marketplace',
      icon: <Storefront size={20} />,
      label: 'Marketplace',
      description: 'Discover skills',
      color: 'text-info'
    },
    {
      id: 'quick-execute',
      icon: <Lightning size={20} weight="fill" />,
      label: 'Quick Run',
      description: 'Execute a skill',
      color: 'text-primary'
    }
  ]

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 text-sm">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(action => (
          <Button
            key={action.id}
            variant="ghost"
            onClick={() => onAction(action.id)}
            className="h-auto flex-col items-start p-3 gap-1"
          >
            <div className={`${action.color} mb-1`}>
              {action.icon}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  )
}
