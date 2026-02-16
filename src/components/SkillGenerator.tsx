import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Flask, Play, Sparkle } from '@phosphor-icons/react'
import type { Skill } from '@/lib/types'

interface SkillGeneratorProps {
  onGenerate: (description: string) => Promise<{ name: string; code: string; description: string }>
  onSave: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function SkillGenerator({ onGenerate, onSave }: SkillGeneratorProps) {
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSkill, setGeneratedSkill] = useState<{
    name: string
    code: string
    description: string
  } | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerate = async () => {
    if (!description.trim() || isGenerating) return

    setIsGenerating(true)
    try {
      const skill = await onGenerate(description)
      setGeneratedSkill(skill)
      setShowPreview(true)
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    if (!generatedSkill) return

    onSave({
      name: generatedSkill.name,
      description: generatedSkill.description,
      code: generatedSkill.code,
      category: 'Generated'
    })

    setGeneratedSkill(null)
    setShowPreview(false)
    setDescription('')
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
          Skill Generator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate OpenClaw skills from natural language
        </p>
      </div>

      <Card className="flex-1 flex flex-col gap-6 p-6">
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <Label htmlFor="description" className="text-base font-medium">
              Describe your skill
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              Explain what you want the agent to do, what tools it should use, and when it
              should execute
            </p>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Example: Create a skill that monitors my GitHub repositories for new issues and sends me a summary every morning at 9 AM. It should use the GitHub API to fetch issues and format them nicely."
              className="min-h-[200px] resize-none font-mono text-sm"
              disabled={isGenerating}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={!description.trim() || isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-shimmer">
                    <Sparkle size={20} weight="fill" />
                  </div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkle size={20} weight="fill" />
                  Generate Skill
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Example prompts</h3>
          <div className="space-y-2">
            <button
              onClick={() =>
                setDescription(
                  'Create a skill that checks my Stripe account balance every hour and alerts me if it drops below $1000'
                )
              }
              className="w-full text-left p-3 rounded bg-secondary hover:bg-secondary/80 transition-colors text-sm"
              disabled={isGenerating}
            >
              Monitor Stripe balance and send alerts
            </button>
            <button
              onClick={() =>
                setDescription(
                  'Build a skill that summarizes my Slack messages from the #engineering channel and creates a daily digest'
                )
              }
              className="w-full text-left p-3 rounded bg-secondary hover:bg-secondary/80 transition-colors text-sm"
              disabled={isGenerating}
            >
              Daily Slack digest from engineering channel
            </button>
            <button
              onClick={() =>
                setDescription(
                  'Create a skill that watches for new pull requests in my GitHub repos and runs code quality checks automatically'
                )
              }
              className="w-full text-left p-3 rounded bg-secondary hover:bg-secondary/80 transition-colors text-sm"
              disabled={isGenerating}
            >
              Automated PR code quality checker
            </button>
          </div>
        </div>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">Generated Skill Preview</DialogTitle>
          </DialogHeader>

          {generatedSkill && (
            <div className="flex-1 overflow-auto space-y-4">
              <div>
                <Label className="text-base font-medium">Skill Name</Label>
                <Input
                  value={generatedSkill.name}
                  onChange={e =>
                    setGeneratedSkill({ ...generatedSkill, name: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-base font-medium">Description</Label>
                <Textarea
                  value={generatedSkill.description}
                  onChange={e =>
                    setGeneratedSkill({ ...generatedSkill, description: e.target.value })
                  }
                  className="mt-2 min-h-[80px]"
                />
              </div>

              <div>
                <Label className="text-base font-medium">Generated Code</Label>
                <pre className="mt-2 p-4 bg-secondary rounded-lg overflow-x-auto text-sm font-mono">
                  {generatedSkill.code}
                </pre>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="gap-2">
                  Save to Library
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
