import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Flask, 
  Play, 
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Trash
} from '@phosphor-icons/react'
import type { Skill, TestCase } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TestingPlaygroundProps {
  skills: Skill[]
}

export function TestingPlayground({ skills }: TestingPlaygroundProps) {
  const [testCases, setTestCases] = useKV<TestCase[]>('test-cases', [])
  const [selectedSkill, setSelectedSkill] = useState<string>('')
  const [testInput, setTestInput] = useState('')
  const [expectedOutput, setExpectedOutput] = useState('')
  const [testName, setTestName] = useState('')
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set())
  const [testResults, setTestResults] = useState<Map<string, string>>(new Map())

  const handleCreateTest = () => {
    if (!selectedSkill || !testName || !testInput) {
      toast.error('Please fill in all required fields')
      return
    }

    const newTest: TestCase = {
      id: Date.now().toString(),
      skillId: selectedSkill,
      name: testName,
      input: testInput,
      expectedOutput: expectedOutput || undefined,
    }

    setTestCases((current) => [...(current || []), newTest])
    
    setTestName('')
    setTestInput('')
    setExpectedOutput('')
    toast.success('Test case created')
  }

  const handleRunTest = async (testCase: TestCase) => {
    setRunningTests((current) => new Set(current).add(testCase.id))
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const skill = skills.find(s => s.id === testCase.skillId)
    const passed = Math.random() > 0.3
    
    setTestCases((current) =>
      (current || []).map(tc =>
        tc.id === testCase.id
          ? { ...tc, lastRun: Date.now(), lastResult: passed ? 'pass' : 'fail' }
          : tc
      )
    )
    
    setRunningTests((current) => {
      const newSet = new Set(current)
      newSet.delete(testCase.id)
      return newSet
    })

    const mockOutput = passed 
      ? `Execution completed successfully\nOutput: ${JSON.stringify({ result: 'success', data: 'mock data' }, null, 2)}`
      : `Execution failed\nError: Mock error for testing purposes`
    
    setTestResults((current) => new Map(current).set(testCase.id, mockOutput))
    
    toast[passed ? 'success' : 'error'](
      passed ? `Test "${testCase.name}" passed` : `Test "${testCase.name}" failed`
    )
  }

  const handleDeleteTest = (testId: string) => {
    setTestCases((current) => (current || []).filter(tc => tc.id !== testId))
    toast.success('Test case deleted')
  }

  const skillTestCases = (testCases || []).filter(tc => tc.skillId === selectedSkill)

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
          Testing Playground
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create and run test cases for your skills
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        <Card className="p-6 flex flex-col gap-4 overflow-auto">
          <div className="flex items-center gap-2 mb-2">
            <Flask size={24} className="text-primary" weight="fill" />
            <h2 className="text-xl font-semibold">Create Test Case</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="test-skill">Select Skill *</Label>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger id="test-skill" className="mt-2">
                  <SelectValue placeholder="Choose a skill to test" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSkill && (
              <>
                <div>
                  <Label htmlFor="test-name">Test Name *</Label>
                  <Input
                    id="test-name"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="e.g., 'Test basic functionality'"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="test-input">Test Input *</Label>
                  <Textarea
                    id="test-input"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder='{"param": "value"}'
                    className="mt-2 min-h-[120px] font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="expected-output">Expected Output (Optional)</Label>
                  <Textarea
                    id="expected-output"
                    value={expectedOutput}
                    onChange={(e) => setExpectedOutput(e.target.value)}
                    placeholder='{"result": "expected value"}'
                    className="mt-2 min-h-[120px] font-mono text-sm"
                  />
                </div>

                <Button onClick={handleCreateTest} className="w-full gap-2">
                  <Plus weight="bold" />
                  Create Test Case
                </Button>
              </>
            )}

            {!selectedSkill && (
              <Card className="p-8 text-center bg-muted/30">
                <Flask size={48} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Select a skill to create test cases
                </p>
              </Card>
            )}
          </div>
        </Card>

        <Card className="p-6 flex flex-col gap-4 overflow-auto">
          <h2 className="text-xl font-semibold">
            Test Cases {selectedSkill && `(${skillTestCases.length})`}
          </h2>

          {!selectedSkill ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Flask size={48} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Select a skill to view its test cases
                </p>
              </div>
            </div>
          ) : skillTestCases.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Flask size={48} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No test cases yet. Create your first test case above.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-auto">
              {skillTestCases.map(testCase => {
                const isRunning = runningTests.has(testCase.id)
                const result = testResults.get(testCase.id)
                
                return (
                  <Card key={testCase.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{testCase.name}</h3>
                          {testCase.lastResult && (
                            <Badge
                              variant={testCase.lastResult === 'pass' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {testCase.lastResult === 'pass' ? (
                                <CheckCircle size={12} weight="fill" className="mr-1" />
                              ) : (
                                <XCircle size={12} weight="fill" className="mr-1" />
                              )}
                              {testCase.lastResult}
                            </Badge>
                          )}
                        </div>
                        {testCase.lastRun && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} />
                            Last run: {new Date(testCase.lastRun).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRunTest(testCase)}
                          disabled={isRunning}
                          className="gap-1"
                        >
                          <Play size={14} weight="fill" />
                          {isRunning ? 'Running...' : 'Run'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTest(testCase.id)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Input:</p>
                        <pre className="text-xs bg-muted/30 p-2 rounded overflow-auto max-h-20">
                          {testCase.input}
                        </pre>
                      </div>
                      
                      {result && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Output:</p>
                          <pre className={cn(
                            "text-xs p-2 rounded overflow-auto max-h-32",
                            testCase.lastResult === 'pass' ? 'bg-success/10' : 'bg-error/10'
                          )}>
                            {result}
                          </pre>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
