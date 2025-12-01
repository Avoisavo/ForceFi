# ForceFi - Dynamic + Linera Integration Setup Guide

Complete guide for integrating Dynamic Labs wallet authentication with Linera blockchain in your Vite + React application.

## 🎯 What's Implemented

- ✅ **Dynamic Labs Integration**: Wallet authentication and connection
- ✅ **Linera Adapter**: Custom bridge between Dynamic and Linera
- ✅ **Custom Signer**: DynamicSigner that implements Linera's signing interface
- ✅ **React Context**: LineraContext for managing connection state
- ✅ **UI Components**: Header with wallet connection + Dashboard with betting interface

## 📁 Project Structure

```
frontend/ForceFi/src/
├── lib/
│   ├── dynamic-signer.ts      # Bridge between Dynamic and Linera signing
│   └── linera-adapter.ts      # Main Linera integration adapter
├── contexts/
│   └── LineraContext.tsx      # React context for Linera connection state
├── components/
│   └── Header.tsx             # Header with wallet connection button
├── pages/
│   └── dashboard.tsx          # Betting dashboard with Linera integration
└── main.tsx                   # App entry with Dynamic + Linera providers
```

## 🚀 Setup Instructions

### 1. Get Your Dynamic Environment ID

1. Go to [Dynamic.xyz](https://app.dynamic.xyz/)
2. Sign up or log in
3. Create a new project (or use existing)
4. Go to **Settings** → **API**
5. Copy your **Environment ID**

### 2. Configure Environment Variables

Create a `.env` file in `/frontend/ForceFi/`:

```bash
# Dynamic Labs Environment ID (from Step 1)
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here

# Linera RPC URL (adjust based on your setup)
VITE_LINERA_RPC_URL=http://localhost:8080
```

### 3. Update Linera Context with Your RPC URL

Edit `src/contexts/LineraContext.tsx`:

```typescript
// Replace with your Linera RPC URL or use env variable
const DEFAULT_LINERA_RPC_URL = import.meta.env.VITE_LINERA_RPC_URL || 'http://localhost:8080';
```

### 4. Install Dependencies (Already Done)

```bash
cd frontend/ForceFi
npm install
```

Dependencies installed:
- `@dynamic-labs/sdk-react-core` - Dynamic Labs React SDK
- `@dynamic-labs/ethereum` - Ethereum wallet connectors for Dynamic
- `@linera/client` - Linera blockchain client

### 5. Adjust Linera API Calls

**IMPORTANT**: The Linera SDK API in the current implementation uses placeholders. You'll need to adjust based on the actual Linera SDK documentation:

#### In `src/lib/linera-adapter.ts`:

```typescript
// Current (placeholder):
const faucet = new Faucet(rpcUrl);
const wallet = faucet.createWallet() as any as Wallet;
const chainId = await (faucet as any).claimChain(wallet, address);

// Adjust based on actual Linera SDK:
// - Check if methods are async/sync
// - Verify parameter count and types
// - Update constructor calls
```

#### In `src/lib/dynamic-signer.ts`:

```typescript
// Current implementation uses a generic approach
// You may need to adjust the signMessage call based on
// how your Dynamic wallet connector exposes signing
```

## 🎮 Usage

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Connect Wallet Flow

1. Click **"🔗 Connect Wallet"** button in header
2. Dynamic modal appears - select your wallet (MetaMask, WalletConnect, etc.)
3. Authenticate with your wallet
4. Click **"🔗 Connect to Linera"** to initialize Linera connection
5. Once connected, you'll see your address and chain ID

### 3. Place Bets

1. Navigate to `/hallo` (Markets page)
2. Select an option in any market
3. Enter bet amount (default: 100)
4. Click **"🎯 PLACE BET"**
5. Transaction will be processed through Linera (currently in demo mode)

## 🔧 Integration with Your Linera Application

### Set Application ID

Once you have your Linera application deployed, set it in your dashboard:

```typescript
import { useLinera } from '../contexts/LineraContext';

function YourComponent() {
  const { setAppId } = useLinera();
  
  useEffect(() => {
    // Set your Linera application ID
    setAppId('YOUR_LINERA_APP_ID_HERE');
  }, []);
}
```

### Query Linera Application

```typescript
import { lineraAdapter } from '../lib/linera-adapter';

// Query example
const result = await lineraAdapter.queryApplication({
  query: "query { markets { id question options } }"
});
```

### Mutate Linera Application

```typescript
import { lineraAdapter } from '../lib/linera-adapter';

// Mutation example
const result = await lineraAdapter.mutateApplication({
  mutation: `mutation {
    placeBet(marketId: 1, option: "YES", amount: 100) {
      success
      transactionId
    }
  }`
});
```

## 📝 Key Files to Customize

### 1. `src/lib/linera-adapter.ts`

Adjust the Linera SDK API calls based on documentation:
- `connect()` method - Faucet and wallet creation
- `setApplication()` - Application initialization
- `queryApplication()` / `mutateApplication()` - Data operations

### 2. `src/lib/dynamic-signer.ts`

Customize signing based on your wallet requirements:
- Message format (hex, base64, etc.)
- Signature format
- Public key retrieval

### 3. `src/pages/dashboard.tsx`

Update betting logic:
- Connect to real Linera betting contract
- Load markets from blockchain
- Handle transaction confirmations

## 🔍 Troubleshooting

### TypeScript Errors

Some type mismatches may occur due to:
1. Linera SDK types not matching exact API
2. Dynamic connector types varying by version

**Solutions**:
- Check Linera SDK documentation for correct types
- Use `as any` temporarily to bypass type checks (fix later)
- Update `@linera/client` to latest version

### Connection Errors

**"Not connected to Linera"**:
- Ensure wallet is connected first via Dynamic
- Click "Connect to Linera" button after wallet connection
- Check Linera RPC URL is accessible

**"Failed to initialize WASM"**:
- Clear browser cache and reload
- Check browser console for specific WASM errors
- Ensure Linera client is compatible with browser

### Signing Errors

**"Failed to sign message"**:
- Ensure wallet is unlocked
- Check wallet has permissions to sign
- Verify message format matches wallet expectations

## 🌐 Deploying to Production

### 1. Update Environment Variables

For production, use your production Linera RPC and Dynamic Environment ID:

```bash
VITE_DYNAMIC_ENVIRONMENT_ID=prod_environment_id
VITE_LINERA_RPC_URL=https://your-production-linera-rpc.com
```

### 2. Build

```bash
npm run build
```

### 3. Deploy

Deploy the `dist/` folder to your hosting provider (Vercel, Netlify, etc.)

## 📚 Resources

- [Dynamic Labs Docs](https://docs.dynamic.xyz/)
- [Linera Documentation](https://linera.io/docs)
- [React Context API](https://react.dev/reference/react/useContext)

## 🎨 Customization

The UI uses inline styles with a cyberpunk/arcade theme. To customize:

1. **Colors**: Update gradient colors in components
2. **Fonts**: Change `fontFamily: 'monospace'` to your preference
3. **Animations**: Modify `@keyframes` in dashboard styles

## 💡 Next Steps

1. **Deploy Linera Betting Contract**: Create and deploy your prediction market contract
2. **Update API Calls**: Replace placeholder queries/mutations with real contract calls
3. **Add Error Handling**: Implement robust error handling for blockchain transactions
4. **Testing**: Test with real Linera testnet
5. **User Feedback**: Add loading states, transaction confirmations, and error messages

## 🤝 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure Linera RPC is accessible
4. Check Dynamic dashboard for wallet connection issues

---

Built with ⚡ by ForceFi Team

