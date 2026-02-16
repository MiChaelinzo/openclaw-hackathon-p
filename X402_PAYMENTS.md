# x402 Micropayment Integration

AgentDev Studio integrates x402 micropayments to enable frictionless purchases of premium skills using USDC on Base network.

## Overview

x402 is a protocol for autonomous micropayments that enables:
- **Instant payments**: No confirmation delays, instant skill access
- **Automatic retry**: Failed payments automatically retry with exponential backoff
- **Low fees**: Minimal network fees on Base L2
- **USDC payments**: Stable, predictable pricing

## Features

### For Users

1. **One-Click Purchases**
   - Connect wallet once
   - Purchase premium skills instantly
   - Automatic installation after payment

2. **Transparent Pricing**
   - Clear price display in USDC
   - Network fee estimation
   - Total cost breakdown

3. **Safe & Secure**
   - Non-custodial: You control your wallet
   - On-chain verification
   - Transaction receipts for every purchase

4. **Automatic Retry**
   - Failed payments retry automatically (up to 3 times)
   - Clear error messages
   - Manual retry option

### For Skill Creators

1. **Monetize Skills**
   - Set skill prices in USDC
   - Receive payments directly to your wallet
   - Transparent revenue tracking

2. **x402 Integration**
   - Enable x402 for autonomous payments
   - Automatic payment processing
   - Built-in retry logic

## How It Works

### User Purchase Flow

```
1. Browse Marketplace
   ↓
2. Click "Install" on Premium Skill
   ↓
3. Payment Dialog Opens
   ↓
4. Connect Wallet (if not connected)
   ↓
5. Review Transaction Details
   - Skill price
   - Network fees
   - Total cost
   ↓
6. Confirm Payment
   ↓
7. Transaction Processing
   - Initialize payment
   - Execute on-chain
   - Verify completion
   ↓
8. Skill Installed ✓
```

### Technical Implementation

The payment flow uses:
- **x402 Protocol**: For micropayment orchestration
- **USDC on Base**: For stable, low-fee payments
- **Smart retry logic**: Automatic failure recovery
- **Transaction tracking**: Full payment history

## Wallet Connection

### Supported Wallets

Currently simulated for demonstration. In production, supports:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow

### Network

- **Mainnet**: Base (Ethereum L2)
- **Currency**: USDC
- **Gas**: Paid in ETH (automatically estimated)

## Payment States

### Status Types

1. **Pending**: Payment initialized, awaiting execution
2. **Processing**: Transaction submitted to network
3. **Completed**: Payment successful, skill installed
4. **Failed**: Payment failed, retry available
5. **Refunded**: Payment refunded (rare)

### Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| Insufficient balance | Not enough USDC | Add USDC to wallet |
| Network error | RPC/network issues | Automatic retry |
| Gas too low | Network congestion | Wait and retry |
| User rejected | User cancelled | Try again |

## Premium Skills

### Skill Properties

Premium skills have:
- `isPremium: true`
- `price: number` (in USDC)
- `x402Enabled: true` (optional)
- `paymentAddress: string` (creator wallet)

### Example

```typescript
{
  id: 'mp-002',
  name: 'Smart Email Responder',
  isPremium: true,
  price: 9.99,
  x402Enabled: true,
  paymentAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  // ... other properties
}
```

## Transaction History

All payments are tracked in localStorage:
- Transaction ID
- Skill purchased
- Amount paid
- Timestamp
- Transaction hash
- Status

Access your transaction history in the app settings (coming soon).

## Security

### Best Practices

1. **Never share private keys**
2. **Verify transaction details** before confirming
3. **Check creator addresses** for verified skills
4. **Monitor transaction history** regularly

### Smart Contract Security

- Payments go directly to skill creators
- No intermediary custody
- On-chain verification
- Transparent transaction history

## Fees

### Cost Breakdown

```
Skill Price:    $9.99 USDC
Network Fee:    ~$0.01 USD (in ETH)
──────────────────────────
Total Cost:     ~$10.00
```

Fees are estimated and may vary based on network congestion.

## FAQs

**Q: What if my payment fails?**
A: Payments automatically retry up to 3 times. If still failing, check your wallet balance and network connection.

**Q: Can I get a refund?**
A: Contact the skill creator directly. Refunds are handled off-platform.

**Q: Is my wallet information stored?**
A: No. We never store private keys or seed phrases. You maintain full control of your wallet.

**Q: What networks are supported?**
A: Currently Base mainnet. More networks coming soon.

**Q: How do I become a creator?**
A: Create skills in the Skill Library, set pricing, and add your payment address.

## Developer API

### X402PaymentService

```typescript
import { x402Service } from '@/lib/x402Payment'

// Initialize payment
const tx = await x402Service.initializePayment(skill, userAddress)

// Execute payment
const result = await x402Service.executePayment(tx)

// Retry failed payment
const retried = await x402Service.retryPayment(tx)

// Verify payment
const verified = await x402Service.verifyPayment(txHash)
```

### useWallet Hook

```typescript
import { useWallet } from '@/hooks/use-wallet'

const {  
  wallet,
  isConnecting,
  connectWallet,
  disconnectWallet
} = useWallet()
```

## Roadmap

### Coming Soon

- [ ] Multi-network support (Optimism, Arbitrum)
- [ ] Alternative payment tokens (ETH, DAI)
- [ ] Subscription models
- [ ] Skill bundles
- [ ] Revenue analytics for creators
- [ ] Transaction export
- [ ] Dispute resolution

## Support

Having issues with payments?

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review transaction on [Basescan](https://basescan.org)
3. Contact support: support@agentdev.studio

## Resources

- [x402 Protocol Documentation](https://x402.io/docs)
- [Base Network](https://base.org)
- [USDC on Base](https://www.centre.io/usdc)
- [OpenClaw Documentation](./OPENCLAW.md)
