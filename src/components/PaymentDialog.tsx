import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Wallet, 
  CurrencyCircleDollar, 
  CheckCircle, 
  WarningCircle, 
  ArrowsClockwise,
  Lightning,
  Clock,
  ShieldCheck
} from '@phosphor-icons/react'
import type { Skill, PaymentTransaction } from '@/lib/types'
import { x402Service } from '@/lib/x402Payment'
import { useWallet } from '@/hooks/use-wallet'
import { toast } from 'sonner'

interface PaymentDialogProps {
  skill: Skill | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PaymentDialog({ skill, open, onOpenChange, onSuccess }: PaymentDialogProps) {
  const { wallet, isConnecting, connectWallet } = useWallet()
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!open) {
      setTransaction(null)
      setIsProcessing(false)
      setProgress(0)
    }
  }, [open])

  const handleConnectWallet = async () => {
    await connectWallet()
    toast.success('Wallet connected successfully')
  }

  const handlePurchase = async () => {
    if (!skill || !wallet.address) return

    setIsProcessing(true)
    setProgress(10)

    try {
      const paymentAddress = skill.paymentAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'
      
      const tx = await x402Service.initializePayment(
        { ...skill, paymentAddress },
        wallet.address
      )
      setTransaction(tx)
      setProgress(30)

      await new Promise(resolve => setTimeout(resolve, 500))
      setProgress(50)

      const result = await x402Service.executePayment(tx)
      setTransaction(result)
      setProgress(100)

      if (result.status === 'completed') {
        toast.success(`Successfully purchased ${skill.name}!`)
        setTimeout(() => {
          onSuccess()
          onOpenChange(false)
        }, 1500)
      } else {
        toast.error('Payment failed. Please try again.')
      }
    } catch (error) {
      toast.error('Payment failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
      setTransaction(prev => prev ? { ...prev, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' } : null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRetry = async () => {
    if (!transaction) return
    
    setIsProcessing(true)
    try {
      const result = await x402Service.retryPayment(transaction)
      setTransaction(result)
      
      if (result.status === 'completed') {
        toast.success('Payment completed successfully!')
        setTimeout(() => {
          onSuccess()
          onOpenChange(false)
        }, 1500)
      } else {
        toast.error('Payment retry failed')
      }
    } catch (error) {
      toast.error('Retry failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsProcessing(false)
    }
  }

  if (!skill) return null

  const estimatedGas = 0.01
  const totalCost = (skill.price || 0) + estimatedGas

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <CurrencyCircleDollar size={28} className="text-primary" />
            Purchase Skill
          </DialogTitle>
          <DialogDescription>
            Secure micropayment powered by x402 and USDC on Base
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{skill.name}</h3>
                <p className="text-sm text-muted-foreground">by {skill.author || 'Anonymous'}</p>
              </div>
              {skill.isVerified && (
                <ShieldCheck size={20} weight="fill" className="text-accent flex-shrink-0 ml-2" />
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skill Price</span>
                <span className="font-medium">{x402Service.formatAmount(skill.price || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network Fee (est.)</span>
                <span className="font-medium">{x402Service.formatAmount(estimatedGas)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-primary">{x402Service.formatAmount(totalCost)}</span>
              </div>
            </div>
          </div>

          {!wallet.isConnected ? (
            <Alert>
              <Wallet size={18} />
              <AlertDescription className="ml-2">
                Connect your wallet to purchase this premium skill
              </AlertDescription>
            </Alert>
          ) : (
            <div className="bg-secondary/30 border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Connected Wallet</span>
                <Badge variant="outline" className="gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  {wallet.network}
                </Badge>
              </div>
              <div className="font-mono text-xs text-muted-foreground truncate">
                {wallet.address}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Balance</span>
                <span className="font-medium">{wallet.balance.toFixed(2)} USDC</span>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing Payment</span>
                <Lightning size={16} className="text-primary animate-pulse" />
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {transaction && transaction.status === 'completed' && (
            <Alert className="border-success bg-success/10">
              <CheckCircle size={18} className="text-success" />
              <AlertDescription className="ml-2">
                <div className="space-y-1">
                  <p className="font-medium">Payment successful!</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    TX: {transaction.txHash}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {transaction && transaction.status === 'failed' && (
            <Alert className="border-destructive bg-destructive/10">
              <WarningCircle size={18} className="text-destructive" />
              <AlertDescription className="ml-2">
                <div className="space-y-1">
                  <p className="font-medium">Payment failed</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.error || 'Unknown error occurred'}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {skill.x402Enabled && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/10 border border-accent/20 rounded-lg p-2">
              <Lightning size={14} className="text-accent" />
              <span>
                x402 enabled: Instant, autonomous micropayments with automatic retry
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!wallet.isConnected ? (
            <Button 
              onClick={handleConnectWallet} 
              disabled={isConnecting}
              className="w-full gap-2"
            >
              {isConnecting ? (
                <>
                  <Clock size={18} className="animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet size={18} />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : transaction && transaction.status === 'failed' ? (
            <Button 
              onClick={handleRetry} 
              disabled={isProcessing || (transaction.retryCount || 0) >= 3}
              className="w-full gap-2"
              variant="default"
            >
              <ArrowsClockwise size={18} />
              Retry Payment
            </Button>
          ) : (
            <Button 
              onClick={handlePurchase} 
              disabled={isProcessing || !wallet.isConnected || wallet.balance < totalCost}
              className="w-full gap-2"
            >
              {isProcessing ? (
                <>
                  <Clock size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lightning size={18} />
                  Pay {x402Service.formatAmount(totalCost)}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
