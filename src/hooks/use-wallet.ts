import { useState, useEffect } from 'react'
import type { WalletState } from '@/lib/types'

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: 0,
    isConnected: false,
    network: undefined
  })

  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockAddress = `0x${Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`
      
      setWallet({
        address: mockAddress,
        balance: 100 + Math.random() * 900,
        isConnected: true,
        network: 'Base Mainnet'
      })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet({
      address: null,
      balance: 0,
      isConnected: false,
      network: undefined
    })
  }

  return {
    wallet,
    isConnecting,
    connectWallet,
    disconnectWallet
  }
}
