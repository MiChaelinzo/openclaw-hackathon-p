import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Code, 
  MagicWand, 
  Check,
  Warning,
  Lightning,
  ArrowCounterClockwise
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: 'typescript' | 'javascript' | 'python'
  readOnly?: boolean
  className?: string
}

interface ValidationIssue {
  line: number
  message: string
  type: 'error' | 'warning' | 'info'
}

export function CodeEditor({ 
  value, 
  onChange, 
  language = 'typescript',
  readOnly = false,
  className 
}: CodeEditorProps) {
  const [issues, setIssues] = useState<ValidationIssue[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const validateCode = async () => {
    setIsValidating(true)
    
    setTimeout(() => {
      const mockIssues: ValidationIssue[] = []
      
      if (!value.includes('import')) {
        mockIssues.push({
          line: 1,
          message: 'Consider adding import statements',
          type: 'info'
        })
      }
      
      if (!value.includes('export')) {
        mockIssues.push({
          line: 1,
          message: 'No export statement found',
          type: 'warning'
        })
      }

      const lines = value.split('\n')
      lines.forEach((line, index) => {
        if (line.includes('console.log')) {
          mockIssues.push({
            line: index + 1,
            message: 'Avoid using console.log in production code',
            type: 'warning'
          })
        }
      })

      setIssues(mockIssues)
      setIsValidating(false)
    }, 500)
  }

  const formatCode = () => {
    const lines = value.split('\n')
    let indentLevel = 0
    const formatted = lines.map(line => {
      const trimmed = line.trim()
      
      if (trimmed.includes('}') && !trimmed.includes('{')) {
        indentLevel = Math.max(0, indentLevel - 1)
      }
      
      const indented = '  '.repeat(indentLevel) + trimmed
      
      if (trimmed.includes('{') && !trimmed.includes('}')) {
        indentLevel++
      }
      
      return indented
    }).join('\n')
    
    onChange(formatted)
  }

  const insertSnippet = (snippet: string) => {
    onChange(value + '\n' + snippet)
  }

  const lineCount = value.split('\n').length

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code size={20} className="text-primary" />
          <span className="text-sm font-medium">{language.toUpperCase()} Editor</span>
          <Badge variant="secondary" className="text-xs">
            {lineCount} lines
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={formatCode}
            disabled={readOnly}
            className="gap-2"
          >
            <ArrowCounterClockwise size={16} />
            Format
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={validateCode}
            disabled={isValidating}
            className="gap-2"
          >
            <Check size={16} />
            {isValidating ? 'Validating...' : 'Validate'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="gap-2"
          >
            <MagicWand size={16} />
            AI
          </Button>
        </div>
      </div>

      {issues.length > 0 && (
        <Card className="p-3 bg-warning/5 border-warning/20">
          <div className="space-y-2">
            {issues.map((issue, index) => (
              <div key={index} className="flex items-start gap-2">
                <Warning 
                  size={16} 
                  className={cn(
                    "mt-0.5",
                    issue.type === 'error' && "text-error",
                    issue.type === 'warning' && "text-warning",
                    issue.type === 'info' && "text-info"
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Line {issue.line}:</span> {issue.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showSuggestions && (
        <Card className="p-3 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <Lightning size={20} className="text-accent mt-1" weight="fill" />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium">AI Suggestions</p>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => insertSnippet('// TODO: Add error handling\ntry {\n  // Your code here\n} catch (error) {\n  console.error(error)\n}')}
                  className="w-full justify-start text-xs h-auto py-2"
                >
                  Add error handling wrapper
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => insertSnippet('/**\n * Function description\n * @param param Description\n * @returns Description\n */')}
                  className="w-full justify-start text-xs h-auto py-2"
                >
                  Insert JSDoc comment
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => insertSnippet('import { useState, useEffect } from "react"')}
                  className="w-full justify-start text-xs h-auto py-2"
                >
                  Add React imports
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/30 border-r border-border flex flex-col items-center pt-3 text-xs text-muted-foreground font-mono select-none">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="h-[22px] leading-[22px]">
              {i + 1}
            </div>
          ))}
        </div>
        
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className="font-mono text-sm min-h-[400px] pl-14 resize-none"
          spellCheck={false}
          placeholder="// Write your OpenClaw skill code here..."
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>Ln {lineCount}</span>
        </div>
        {issues.length > 0 && (
          <div className="flex items-center gap-2">
            <Warning size={14} className="text-warning" />
            <span>{issues.length} issue{issues.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  )
}
