import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Download, 
  Upload, 
  FileCode, 
  Copy,
  Check,
  Package
} from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Skill } from '@/lib/types'

interface SkillExportImportProps {
  skills: Skill[]
  onImportSkills: (skills: Skill[]) => void
}

export function SkillExportImport({ skills, onImportSkills }: SkillExportImportProps) {
  const [copied, setCopied] = useState(false)

  const handleExport = () => {
    const exportData = {
      version: '1.0',
      exportedAt: Date.now(),
      skills: skills.map(skill => ({
        ...skill,
        id: undefined
      }))
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `agentdev-skills-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success(`Exported ${skills.length} skills`)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.skills && Array.isArray(data.skills)) {
          const importedSkills = data.skills.map((skill: Skill) => ({
            ...skill,
            id: `imported-${Date.now()}-${Math.random()}`,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }))
          onImportSkills(importedSkills)
          toast.success(`Imported ${importedSkills.length} skills`)
        } else {
          toast.error('Invalid skill file format')
        }
      } catch (error) {
        toast.error('Failed to parse skill file')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const copyToClipboard = () => {
    const exportData = {
      version: '1.0',
      exportedAt: Date.now(),
      skills: skills
    }
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2))
    setCopied(true)
    toast.success('Skills copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package size={20} />
            Export & Import
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Share your skills or import from others
          </p>
        </div>
        <Badge variant="outline">{skills.length} skills</Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Download size={20} className="text-accent" />
            </div>
            <div>
              <h4 className="font-medium">Export Skills</h4>
              <p className="text-xs text-muted-foreground">
                Download as JSON file
              </p>
            </div>
          </div>

          <Button 
            onClick={handleExport} 
            disabled={skills.length === 0}
            className="w-full gap-2"
          >
            <FileCode size={16} />
            Export All ({skills.length})
          </Button>

          <Button 
            onClick={copyToClipboard} 
            disabled={skills.length === 0}
            variant="outline"
            className="w-full gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Upload size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Import Skills</h4>
              <p className="text-xs text-muted-foreground">
                Load from JSON file
              </p>
            </div>
          </div>

          <label htmlFor="import-skills" className="cursor-pointer">
            <input
              id="import-skills"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button className="w-full gap-2" asChild>
              <span>
                <Upload size={16} />
                Select File
              </span>
            </Button>
          </label>

          <p className="text-xs text-muted-foreground">
            Imported skills will be added to your library without replacing existing ones.
          </p>
        </Card>
      </div>
    </div>
  )
}
