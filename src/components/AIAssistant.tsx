import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatCircle, PaperPlaneRight, Trash, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'

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
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isProcessing])

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

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard')
  }

  const handleClearHistory = () => {
    setMessages([])
    toast.success('Chat history cleared')
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      <div className="flex-shrink-0 flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.02em]">
            AI Debug Assistant
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Get intelligent help debugging your agents
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="gap-2"
          >
            <Trash size={16} />
            Clear
          </Button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 overflow-hidden">
          <Card className="h-full flex flex-col items-center justify-center gap-4 p-12 text-center">
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
        </div>
      ) : (
        <Card className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 group relative ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <p className="text-xs opacity-70">
                        {formatTimestamp(message.timestamp)}
                      </p>
                      <button
                        onClick={() => handleCopy(message.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy size={14} className="opacity-70 hover:opacity-100" />
                      </button>
                    </div>
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
          </div>
        </Card>
      )}

      <div className="flex gap-2 flex-shrink-0">
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
          className="min-h-[60px] max-h-[120px] resize-none"
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
