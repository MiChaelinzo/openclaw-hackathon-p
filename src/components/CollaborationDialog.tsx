import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  ShareNetwork, 
  Copy, 
  Check,
  GitFork,
  Users,
  Link as LinkIcon
} from '@phosphor-icons/react'
import type { Skill } from '@/lib/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CollaborationDialogProps {
  skill: Skill | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onFork?: (skill: Skill) => void
}

export function CollaborationDialog({ 
  skill, 
  open, 
  onOpenChange,
  onFork 
}: CollaborationDialogProps) {
  const [copied, setCopied] = useState(false)
  const [shareNote, setShareNote] = useState('')
  const [forkName, setForkName] = useState('')

  if (!skill) return null

  const shareUrl = `${window.location.origin}/skills/${skill.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const handleFork = () => {
    if (!forkName.trim()) {
      toast.error('Please enter a name for the forked skill')
      return
    }

    const forkedSkill: Skill = {
      ...skill,
      id: `fork-${Date.now()}`,
      name: forkName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    onFork?.(forkedSkill)
    setForkName('')
    onOpenChange(false)
    toast.success(`Forked "${skill.name}" as "${forkName}"`)
  }

  const handleShare = () => {
    toast.success('Skill shared successfully')
    setShareNote('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShareNetwork size={24} className="text-primary" weight="fill" />
            Collaborate & Share
          </DialogTitle>
          <DialogDescription>
            Share "{skill.name}" with your team or fork it for customization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon size={20} className="text-primary" />
              <h3 className="font-semibold">Share Link</h3>
            </div>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                onClick={handleCopyLink}
                className="gap-2 shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={16} weight="bold" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </Button>
            </div>
            
            <div>
              <Label htmlFor="share-note">Add a note (optional)</Label>
              <Textarea
                id="share-note"
                value={shareNote}
                onChange={(e) => setShareNote(e.target.value)}
                placeholder="Share context or instructions with collaborators..."
                className="mt-2 min-h-[80px]"
              />
            </div>

            <Button onClick={handleShare} className="w-full gap-2">
              <ShareNetwork size={16} weight="fill" />
              Share with Team
            </Button>
          </div>

          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center gap-2">
              <GitFork size={20} className="text-primary" />
              <h3 className="font-semibold">Fork Skill</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Create your own copy to modify without affecting the original
            </p>
            
            <div>
              <Label htmlFor="fork-name">Forked Skill Name</Label>
              <Input
                id="fork-name"
                value={forkName}
                onChange={(e) => setForkName(e.target.value)}
                placeholder={`${skill.name} (Custom)`}
                className="mt-2"
              />
            </div>

            <Button onClick={handleFork} variant="secondary" className="w-full gap-2">
              <GitFork size={16} />
              Fork This Skill
            </Button>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Users size={20} className="text-primary" />
              <h3 className="font-semibold">Collaboration Info</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Author</p>
                <p className="font-medium">{skill.author || 'Unknown'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Version</p>
                <Badge variant="secondary">{skill.version || '1.0.0'}</Badge>
              </div>
              {skill.dependencies && skill.dependencies.length > 0 && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm text-muted-foreground">Dependencies</p>
                  <div className="flex flex-wrap gap-2">
                    {skill.dependencies.map(dep => (
                      <Badge key={dep} variant="outline" className="text-xs">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
