import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  Download, 
  SealCheck, 
  Crown,
  Calendar,
  User,
  Package,
  Code,
  FileText,
  ArrowLeft,
  Tag
} from '@phosphor-icons/react'
import type { Skill } from '@/lib/types'

interface SkillDetailsProps {
  skill: Skill
  isInstalled: boolean
  onInstall: () => void
  onBack: () => void
}

export function SkillDetails({ skill, isInstalled, onInstall, onBack }: SkillDetailsProps) {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft size={18} />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
              {skill.name}
            </h1>
            {skill.isVerified && (
              <SealCheck size={28} weight="fill" className="text-accent" />
            )}
            {skill.isPremium && (
              <Crown size={28} weight="fill" className="text-warning" />
            )}
          </div>
          {skill.author && (
            <p className="text-sm text-muted-foreground">by {skill.author}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-auto">
          <Card className="p-6">
            <h2 className="text-[20px] font-semibold leading-[26px] mb-4">Description</h2>
            <p className="text-sm text-foreground leading-relaxed">
              {skill.description}
            </p>
          </Card>

          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <TabsList className="w-fit">
              <TabsTrigger value="code" className="gap-2">
                <Code size={18} />
                Code
              </TabsTrigger>
              <TabsTrigger value="documentation" className="gap-2">
                <FileText size={18} />
                Documentation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="flex-1 mt-4">
              <Card className="p-0 overflow-hidden h-full">
                <div className="bg-secondary/50 px-4 py-2 border-b border-border">
                  <p className="text-xs text-muted-foreground font-mono">skill.ts</p>
                </div>
                <ScrollArea className="h-[400px]">
                  <pre className="p-4 text-xs font-mono leading-relaxed">
                    <code>{skill.code}</code>
                  </pre>
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="documentation" className="flex-1 mt-4">
              <Card className="p-6">
                {skill.documentation ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {skill.documentation}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No documentation available for this skill
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4 overflow-auto">
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              {skill.price !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Price</p>
                  <p className="text-[24px] font-bold">
                    {skill.price === 0 ? 'Free' : `$${skill.price}`}
                  </p>
                </div>
              )}

              <Button
                variant={isInstalled ? 'outline' : 'default'}
                onClick={onInstall}
                disabled={isInstalled}
                className="w-full"
                size="lg"
              >
                <Download size={20} className="mr-2" />
                {isInstalled ? 'Installed' : 'Install Skill'}
              </Button>

              <Separator />

              <div className="space-y-3">
                {skill.rating !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-2">
                      <Star size={16} weight="fill" className="text-warning" />
                      <span className="font-medium">{skill.rating.toFixed(1)}</span>
                      {skill.reviews !== undefined && (
                        <span className="text-sm text-muted-foreground">
                          ({skill.reviews})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {skill.downloads !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Downloads</span>
                    <div className="flex items-center gap-2">
                      <Download size={16} className="text-muted-foreground" />
                      <span className="font-medium">{skill.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="secondary">{skill.category}</Badge>
                </div>

                {skill.version && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="font-medium text-sm">{skill.version}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <span className="text-sm">
                    {new Date(skill.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {new Date(skill.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {skill.tags && skill.tags.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-muted-foreground" />
                <h3 className="font-medium text-sm">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {skill.dependencies && skill.dependencies.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package size={16} className="text-muted-foreground" />
                <h3 className="font-medium text-sm">Dependencies</h3>
              </div>
              <div className="space-y-2">
                {skill.dependencies.map(dep => (
                  <div key={dep} className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                    {dep}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {skill.author && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-muted-foreground" />
                <h3 className="font-medium text-sm">Author</h3>
              </div>
              <p className="text-sm">{skill.author}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
