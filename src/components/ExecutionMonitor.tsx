import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Pulse } from '@phosphor-icons/react'
import type { Execution } from '@/lib/types'

interface ExecutionMonitorProps {
  executions: Execution[]
}

export function ExecutionMonitor({ executions }: ExecutionMonitorProps) {
  const statusColors = {
    running: 'bg-info',
    success: 'bg-success',
    error: 'bg-error',
    idle: 'bg-muted-foreground'
  }

  const statusLabels = {
    running: 'Running',
    success: 'Success',
    error: 'Error',
    idle: 'Idle'
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
          Execution Monitor
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time agent execution tracking
        </p>
      </div>

      {executions.length === 0 ? (
        <Card className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-info/10 flex items-center justify-center">
            <Pulse size={32} className="text-info" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">No executions yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Agent executions will appear here in real-time as they run
            </p>
          </div>
        </Card>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {executions.map(execution => (
            <Card key={execution.id} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-[18px] font-medium leading-[24px] mb-1">
                    {execution.skillName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Started {new Date(execution.startTime).toLocaleTimeString()}
                    {execution.endTime && ` • ${execution.endTime - execution.startTime}ms`}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={`${statusColors[execution.status]} text-white`}
                >
                  {execution.status === 'running' && (
                    <span className="inline-block w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
                  )}
                  {statusLabels[execution.status]}
                </Badge>
              </div>

              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {execution.steps.map((step, idx) => (
                    <div key={step.id}>
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            step.type === 'error'
                              ? 'bg-error'
                              : step.type === 'result'
                              ? 'bg-success'
                              : 'bg-info'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium capitalize">
                              {step.type.replace('_', ' ')}
                            </span>
                            {step.toolName && (
                              <Badge variant="outline" className="text-xs">
                                {step.toolName}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(step.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <pre className="text-sm font-mono bg-secondary p-2 rounded overflow-x-auto">
                            {step.content}
                          </pre>
                        </div>
                      </div>
                      {idx < execution.steps.length - 1 && (
                        <Separator className="my-3 ml-4" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {execution.error && (
                <div className="mt-4 p-3 bg-error/10 border border-error rounded">
                  <p className="text-sm text-error font-medium">Error: {execution.error}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
