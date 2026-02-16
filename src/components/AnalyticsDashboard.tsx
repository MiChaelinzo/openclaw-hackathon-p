import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ChartLine, 
  TrendUp, 
  TrendDown, 
  Lightning,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Download
} from '@phosphor-icons/react'
import type { Skill, Execution } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AnalyticsDashboardProps {
  skills: Skill[]
  executions: Execution[]
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

function MetricCard({ title, value, change, icon, trend = 'neutral' }: MetricCardProps) {
  return (
    <Card className="p-6 hover:bg-accent/5 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend === 'up' && "text-success",
            trend === 'down' && "text-error",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {trend === 'up' && <TrendUp size={16} weight="bold" />}
            {trend === 'down' && <TrendDown size={16} weight="bold" />}
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </Card>
  )
}

export function AnalyticsDashboard({ skills, executions }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const totalExecutions = executions.length
    const successfulExecutions = executions.filter(e => e.status === 'success').length
    const failedExecutions = executions.filter(e => e.status === 'error').length
    const runningExecutions = executions.filter(e => e.status === 'running').length
    
    const successRate = totalExecutions > 0 
      ? Math.round((successfulExecutions / totalExecutions) * 100) 
      : 0

    const avgExecutionTime = executions
      .filter(e => e.endTime && e.startTime)
      .reduce((acc, e) => acc + (e.endTime! - e.startTime), 0) / 
      (executions.filter(e => e.endTime).length || 1)

    const avgExecutionSeconds = Math.round(avgExecutionTime / 1000)

    const skillUsage = skills.map(skill => {
      const skillExecutions = executions.filter(e => e.skillId === skill.id)
      return {
        skill,
        executions: skillExecutions.length,
        successRate: skillExecutions.length > 0
          ? (skillExecutions.filter(e => e.status === 'success').length / skillExecutions.length) * 100
          : 0
      }
    }).sort((a, b) => b.executions - a.executions)

    const topSkills = skillUsage.slice(0, 5)

    const recentExecutions = [...executions]
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, 10)

    const totalDownloads = skills.reduce((sum, s) => sum + (s.downloads || 0), 0)
    const avgRating = skills.filter(s => s.rating).length > 0
      ? (skills.reduce((sum, s) => sum + (s.rating || 0), 0) / skills.filter(s => s.rating).length).toFixed(1)
      : '0.0'

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      runningExecutions,
      successRate,
      avgExecutionSeconds,
      topSkills,
      recentExecutions,
      totalDownloads,
      avgRating
    }
  }, [skills, executions])

  return (
    <div className="flex flex-col gap-6 h-full overflow-auto">
      <div>
        <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
          Analytics Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Performance insights and usage metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Executions"
          value={analytics.totalExecutions}
          change={12}
          trend="up"
          icon={<Lightning size={24} className="text-primary" weight="fill" />}
        />
        <MetricCard
          title="Success Rate"
          value={`${analytics.successRate}%`}
          change={5}
          trend="up"
          icon={<CheckCircle size={24} className="text-success" weight="fill" />}
        />
        <MetricCard
          title="Avg Execution Time"
          value={`${analytics.avgExecutionSeconds}s`}
          change={-8}
          trend="up"
          icon={<Clock size={24} className="text-accent" weight="fill" />}
        />
        <MetricCard
          title="Active Skills"
          value={skills.length}
          icon={<ChartLine size={24} className="text-primary" weight="bold" />}
        />
      </div>

      <Tabs defaultValue="overview" className="flex-1">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Performance</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 col-span-2">
              <h3 className="text-lg font-semibold mb-4">Execution Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-sm">Successful</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{analytics.successfulExecutions}</span>
                    <Badge variant="secondary">{analytics.successRate}%</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-error" />
                    <span className="text-sm">Failed</span>
                  </div>
                  <span className="text-2xl font-bold">{analytics.failedExecutions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-warning animate-pulse" />
                    <span className="text-sm">Running</span>
                  </div>
                  <span className="text-2xl font-bold">{analytics.runningExecutions}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
                  <p className="text-xl font-bold">{analytics.totalDownloads.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
                  <div className="flex items-center gap-2">
                    <Star size={20} weight="fill" className="text-warning" />
                    <p className="text-xl font-bold">{analytics.avgRating}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Executions</h3>
            <div className="space-y-2">
              {analytics.recentExecutions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No executions yet. Run a skill to see execution history.
                </p>
              ) : (
                analytics.recentExecutions.map(execution => (
                  <div
                    key={execution.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        execution.status === 'success' && "bg-success",
                        execution.status === 'error' && "bg-error",
                        execution.status === 'running' && "bg-warning animate-pulse"
                      )} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{execution.skillName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(execution.startTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      execution.status === 'success' ? 'default' :
                      execution.status === 'error' ? 'destructive' : 
                      'secondary'
                    }>
                      {execution.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4 mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Skills</h3>
            <div className="space-y-3">
              {analytics.topSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No skill execution data available yet.
                </p>
              ) : (
                analytics.topSkills.map((item, index) => (
                  <div
                    key={item.skill.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.skill.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.executions} executions • {Math.round(item.successRate)}% success rate
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{item.skill.category}</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Most Downloaded Skills</h3>
              <div className="space-y-3">
                {skills
                  .filter(s => s.downloads)
                  .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
                  .slice(0, 5)
                  .map(skill => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/5 transition-colors"
                    >
                      <p className="font-medium text-sm">{skill.name}</p>
                      <div className="flex items-center gap-2">
                        <Download size={16} className="text-muted-foreground" />
                        <span className="text-sm font-bold">{skill.downloads?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                {skills.filter(s => s.downloads).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No marketplace skills with download data.
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Highest Rated Skills</h3>
              <div className="space-y-3">
                {skills
                  .filter(s => s.rating)
                  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                  .slice(0, 5)
                  .map(skill => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/5 transition-colors"
                    >
                      <p className="font-medium text-sm">{skill.name}</p>
                      <div className="flex items-center gap-2">
                        <Star size={16} weight="fill" className="text-warning" />
                        <span className="text-sm font-bold">{skill.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                {skills.filter(s => s.rating).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No marketplace skills with ratings.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
