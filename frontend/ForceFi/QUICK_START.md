# 🚀 Quick Start Guide

## Using Your Existing Linera Wallet

Based on your terminal output, you already have a Linera wallet set up with these chains:

```
Child Chain [DEFAULT]
  Chain ID: 994f5f68464920468ca5c3d23a860a69ce0383f049c14cc9d803fd673113233e
  Owner:    0x4a66619916f9b4c33cefbba1ca644b2bc37fcf451c820282bf082e013a94ee96
```

## Steps to Connect

### 1. Get Dynamic Environment ID

1. Visit [https://app.dynamic.xyz/](https://app.dynamic.xyz/)
2. Sign up / Log in
3. Create a project
4. Copy your **Environment ID** from Settings → API

### 2. Create `.env` File

In `/frontend/ForceFi/` create a `.env` file:

```bash
VITE_DYNAMIC_ENVIRONMENT_ID=paste_your_environment_id_here
VITE_LINERA_RPC_URL=http://localhost:8080
```

### 3. Update Linera RPC URL

If your Linera node is running on a different port, update the RPC URL in `.env`

Check your Linera configuration:
```bash
linera wallet show
# Look for RPC endpoint in your Linera config
```

### 4. Run the App

```bash
cd frontend/ForceFi
npm run dev
```

### 5. Connect Your Wallet

1. Open http://localhost:5173 (or the URL shown)
2. Click **"🔗 Connect Wallet"**
3. Choose your wallet (MetaMask, Coinbase, etc.)
4. Approve connection
5. Click **"🔗 Connect to Linera"**
6. Your Linera chain will be initialized!

## 🔗 How It Works

### Dynamic + Linera Architecture

```
┌─────────────────┐
│  Dynamic Labs   │ ← Your wallet (MetaMask, etc.)
│   (Auth Layer)  │
└────────┬────────┘
         │
         │ Sign transactions
         ▼
┌─────────────────┐
│ DynamicSigner   │ ← Bridges Dynamic to Linera
│  (Our Bridge)   │
└────────┬────────┘
         │
         │ Linera SDK calls
         ▼
┌─────────────────┐
│ Linera Adapter  │ ← Manages Linera connection
│   (Singleton)   │
└────────┬────────┘
         │
         │ RPC calls
         ▼
┌─────────────────┐
│ Linera Network  │ ← Your local/testnet Linera node
│  (Blockchain)   │
└─────────────────┘
```

### Key Components

1. **DynamicSigner** (`src/lib/dynamic-signer.ts`)
   - Implements Linera's Signer interface
   - Uses your Dynamic wallet to sign Linera transactions

2. **LineraAdapter** (`src/lib/linera-adapter.ts`)
   - Singleton instance managing Linera connection
   - Provides methods to query and mutate Linera applications

3. **LineraContext** (`src/contexts/LineraContext.tsx`)
   - React context for accessing Linera throughout the app
   - Manages connection state

## 📝 Using Your Wallet Address

The wallet address shown in your terminal:
```
Owner: 0x4a66619916f9b4c33cefbba1ca644b2bc37fcf451c820282bf082e013a94ee96
```

This will be automatically used when:
1. You connect your Dynamic wallet (with same address)
2. The Linera adapter creates a chain for you
3. Transactions are signed with your wallet

## 🎯 Next: Deploy Your Betting Application

### 1. Create Linera Application

```bash
# In your linera project directory
linera project new my-betting-app
cd my-betting-app
# ... implement your betting contract
linera project publish
```

### 2. Get Application ID

After publishing, you'll get an Application ID like:
```
e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000000000000
```

### 3. Set Application ID in Your Frontend

Edit `src/pages/dashboard.tsx`:

```typescript
useEffect(() => {
  const initApp = async () => {
    if (isConnected) {
      try {
        // Replace with your actual application ID
        await setAppId('YOUR_APPLICATION_ID_HERE');
        console.log('✅ App connected!');
      } catch (error) {
        console.error('Failed to set app:', error);
      }
    }
  };
  initApp();
}, [isConnected, setAppId]);
```

### 4. Update Query/Mutation Calls

Replace the demo placeholders in `dashboard.tsx` with real GraphQL queries based on your Linera application's schema.

## 🐛 Troubleshooting

### "Failed to connect to Linera"
- Check if Linera node is running: `linera service`
- Verify RPC URL in `.env` matches your node
- Check browser console for detailed errors

### "Wallet connector not available"
- Ensure you clicked "Connect Wallet" first (Dynamic)
- Then click "Connect to Linera"
- Order matters!

### TypeScript Errors
- Some Linera SDK methods may have different signatures
- Check `SETUP_GUIDE.md` for how to adjust API calls
- Use `as any` temporarily if needed

## 📚 Files You'll Edit Most

1. **`.env`** - Configuration
2. **`src/pages/dashboard.tsx`** - Add your app ID and queries
3. **`src/lib/linera-adapter.ts`** - Adjust SDK calls if needed
4. **`src/contexts/LineraContext.tsx`** - Update RPC URL

## ✨ Ready to Go!

Your setup:
- ✅ Dependencies installed
- ✅ Dynamic provider configured
- ✅ Linera adapter implemented
- ✅ UI components ready
- ⏳ Just need: `.env` file + your Dynamic Environment ID

Get your Environment ID and you're ready to roll! 🚀

---

Questions? Check `SETUP_GUIDE.md` for detailed documentation.

