import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Code, MagnifyingGlass } from '@phosphor-icons/react'
import type { Skill } from '@/lib/types'

interface SkillLibraryProps {
  skills: Skill[]
  onSelectSkill: (skill: Skill) => void
  onCreateSkill: () => void
}

export function SkillLibrary({ skills, onSelectSkill, onCreateSkill }: SkillLibraryProps) {
  const categories = Array.from(new Set(skills.map(s => s.category)))

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
      ) : (
        <div className="flex-1 overflow-auto">
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h2 className="text-[24px] font-semibold leading-[30px] tracking-[-0.01em] mb-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills
                  .filter(s => s.category === category)
                  .map(skill => (
                    <Card
                      key={skill.id}
                      className="p-4 cursor-pointer hover:border-primary transition-colors group"
                      onClick={() => onSelectSkill(skill)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-[18px] font-medium leading-[24px] group-hover:text-primary transition-colors">
                          {skill.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {new Date(skill.updatedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {skill.description}
                      </p>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
