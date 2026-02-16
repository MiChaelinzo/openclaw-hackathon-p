import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Lightning,
  Clock,
  CheckCircle,
  XCircle,
  ChartBar
} from '@phosphor-icons/react'
import type { Skill, Execution } from '@/lib/types'

interface SkillProfilerProps {
  skill: Skill
  executions: Execution[]
}

export function SkillProfiler({ skill, executions }: SkillProfilerProps) {
  const skillExecutions = executions.filter(e => e.skillId === skill.id)
  
  const totalExecutions = skillExecutions.length
  const successfulExecutions = skillExecutions.filter(e => e.status === 'success').length
  const failedExecutions = skillExecutions.filter(e => e.status === 'error').length
  const successRate = totalExecutions > 0 
    ? Math.round((successfulExecutions / totalExecutions) * 100) 
    : 0

  const avgExecutionTime = skillExecutions
    .filter(e => e.endTime && e.startTime)
    .reduce((acc, e) => acc + (e.endTime! - e.startTime), 0) / 
    (skillExecutions.filter(e => e.endTime).length || 1)

  const avgExecutionSeconds = Math.round(avgExecutionTime / 1000)

  const recentExecutions = [...skillExecutions]
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 5)

  if (totalExecutions === 0) {
    return (
      <Card className="p-6 text-center">
        <ChartBar size={48} className="mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No execution data available yet. Run this skill to see performance metrics.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightning size={20} className="text-primary" weight="fill" />
              <p className="text-sm text-muted-foreground">Total Runs</p>
            </div>
            <p className="text-2xl font-bold">{totalExecutions}</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={20} className="text-success" weight="fill" />
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <p className="text-2xl font-bold">{successRate}%</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={20} className="text-accent" weight="fill" />
              <p className="text-sm text-muted-foreground">Avg Time</p>
            </div>
            <p className="text-2xl font-bold">{avgExecutionSeconds}s</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={20} className="text-error" weight="fill" />
              <p className="text-sm text-muted-foreground">Failures</p>
            </div>
            <p className="text-2xl font-bold">{failedExecutions}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Success Rate</p>
            <p className="text-sm text-muted-foreground">{successRate}%</p>
          </div>
          <Progress value={successRate} className="h-2" />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Executions</h3>
        <div className="space-y-3">
          {recentExecutions.map(execution => (
            <div
              key={execution.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                {execution.status === 'success' && (
                  <CheckCircle size={20} className="text-success" weight="fill" />
                )}
                {execution.status === 'error' && (
                  <XCircle size={20} className="text-error" weight="fill" />
                )}
                {execution.status === 'running' && (
                  <Lightning size={20} className="text-warning animate-pulse" weight="fill" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {new Date(execution.startTime).toLocaleString()}
                  </p>
                  {execution.endTime && (
                    <p className="text-xs text-muted-foreground">
                      Duration: {Math.round((execution.endTime - execution.startTime) / 1000)}s
                    </p>
                  )}
                </div>
              </div>
              <Badge
                variant={
                  execution.status === 'success' ? 'default' :
                  execution.status === 'error' ? 'destructive' :
                  'secondary'
                }
              >
                {execution.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
