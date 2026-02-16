import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatCircle, PaperPlaneRight } from '@phosphor-icons/react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AIAssistantProps {
  onAnalyze: (prompt: string) => Promise<string>
}

export function AIAssistant({ onAnalyze }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    try {
      const response = await onAnalyze(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
          AI Debug Assistant
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Get intelligent help debugging your agents
        </p>
      </div>

      {messages.length === 0 ? (
        <Card className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <ChatCircle size={32} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Assistant Ready</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ask me to analyze errors, suggest improvements, or explain agent behavior
            </p>
          </div>
          <div className="flex flex-col gap-2 text-left w-full max-w-md mt-4">
            <button
              onClick={() =>
                setInput('How do I create a skill that monitors GitHub issues?')
              }
              className="text-sm p-3 rounded bg-secondary hover:bg-secondary/80 transition-colors text-left"
            >
              "How do I create a skill that monitors GitHub issues?"
            </button>
            <button
              onClick={() => setInput('Explain what tool calls are in OpenClaw')}
              className="text-sm p-3 rounded bg-secondary hover:bg-secondary/80 transition-colors text-left"
            >
              "Explain what tool calls are in OpenClaw"
            </button>
            <button
              onClick={() => setInput('Help me debug why my agent isn\'t responding')}
              className="text-sm p-3 rounded bg-secondary hover:bg-secondary/80 transition-colors text-left"
            >
              "Help me debug why my agent isn't responding"
            </button>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-lg p-3 max-w-[80%]">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
                      <div
                        className="w-2 h-2 rounded-full bg-foreground animate-pulse"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-foreground animate-pulse"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      )}

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Ask about debugging, best practices, or OpenClaw features..."
          className="min-h-[60px] resize-none"
          disabled={isProcessing}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isProcessing}
          className="px-4"
        >
          <PaperPlaneRight size={20} weight="bold" />
        </Button>
      </div>
    </div>
  )
}
