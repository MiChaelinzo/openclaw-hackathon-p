import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Code, MagnifyingGlass, ShareNetwork, GitFork, Play, Trash } from '@phosphor-icons/react'
import type { Skill } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CollaborationDialog } from './CollaborationDialog'
import { toast } from 'sonner'

interface SkillLibraryProps {
  skills: Skill[]
  onSelectSkill: (skill: Skill) => void
  onCreateSkill: () => void
  onDeleteSkill?: (skillId: string) => void
  onRunSkill?: (skill: Skill) => void
  onForkSkill?: (skill: Skill) => void
}

export function SkillLibrary({ 
  skills, 
  onSelectSkill, 
  onCreateSkill,
  onDeleteSkill,
  onRunSkill,
  onForkSkill
}: SkillLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sharingSkill, setSharingSkill] = useState<Skill | null>(null)

  const categories = ['all', ...Array.from(new Set(skills.map(s => s.category)))]
  
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleShare = (e: React.MouseEvent, skill: Skill) => {
    e.stopPropagation()
    setSharingSkill(skill)
  }

  const handleFork = (skill: Skill) => {
    onForkSkill?.(skill)
  }

  const handleRun = (e: React.MouseEvent, skill: Skill) => {
    e.stopPropagation()
    onRunSkill?.(skill)
    toast.success(`Running "${skill.name}"...`)
  }

  const handleDelete = (e: React.MouseEvent, skillId: string, skillName: string) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${skillName}"?`)) {
      onDeleteSkill?.(skillId)
      toast.success('Skill deleted')
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
            Skill Library
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and create OpenClaw skills
          </p>
        </div>
        <Button onClick={onCreateSkill} className="gap-2">
          <Plus weight="bold" />
          New Skill
        </Button>
      </div>

      {skills.length > 0 && (
        <div className="flex gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {skills.length === 0 ? (
        <Card className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Code size={32} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">No skills yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Create your first OpenClaw skill to get started building autonomous agents
            </p>
          </div>
          <Button onClick={onCreateSkill} className="gap-2 mt-2">
            <Plus weight="bold" />
            Create First Skill
          </Button>
        </Card>
      ) : filteredSkills.length === 0 ? (
        <Card className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <MagnifyingGlass size={48} className="text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">No skills found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        </Card>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map(skill => (
              <Card
                key={skill.id}
                className="p-4 hover:border-primary transition-all group relative"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => onSelectSkill(skill)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[18px] font-medium leading-[24px] group-hover:text-primary transition-colors">
                      {skill.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {skill.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {skill.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date(skill.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleRun(e, skill)}
                    className="gap-1 flex-1"
                  >
                    <Play size={14} weight="fill" />
                    Run
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleShare(e, skill)}
                    className="gap-1"
                  >
                    <ShareNetwork size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDelete(e, skill.id, skill.name)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <CollaborationDialog
        skill={sharingSkill}
        open={sharingSkill !== null}
        onOpenChange={(open) => !open && setSharingSkill(null)}
        onFork={handleFork}
      />
    </div>
  )
}
