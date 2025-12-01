# ⚡ ForceFi - Decentralized Prediction Markets

A beautiful, modern prediction market platform powered by **Linera blockchain** with **Dynamic Labs** wallet authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- A Linera node running (or access to Linera testnet)
- Dynamic Labs account (free at [dynamic.xyz](https://app.dynamic.xyz/))

### Setup in 3 Steps

1. **Get Your Dynamic Environment ID**
   ```bash
   # Visit https://app.dynamic.xyz/
   # Sign up → Create project → Copy Environment ID
   ```

2. **Configure Environment**
   ```bash
   cd frontend/ForceFi
   cp .env.example .env
   # Edit .env and add your Dynamic Environment ID
   ```

3. **Run the App**
   ```bash
   npm run dev
   ```

That's it! Open your browser and connect your wallet.

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Fast-track guide (5 minutes)
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical overview

## ✨ Features

- 🔐 **Wallet Authentication** - Connect with MetaMask, WalletConnect, and 300+ wallets via Dynamic
- ⛓️ **Linera Integration** - Native blockchain integration with custom signer
- 🎨 **Beautiful UI** - Cyberpunk-themed arcade interface
- 📊 **Real-time Updates** - Live connection status and transaction confirmations
- 🎯 **Prediction Markets** - Place bets on various outcomes

## 🏗️ Architecture

```
┌─────────────────┐
│  User's Wallet  │ (MetaMask, Coinbase, etc.)
└────────┬────────┘
         ↓
┌─────────────────┐
│  Dynamic Labs   │ Authentication & Signing
└────────┬────────┘
         ↓
┌─────────────────┐
│ DynamicSigner   │ Custom bridge for Linera
└────────┬────────┘
         ↓
┌─────────────────┐
│ Linera Adapter  │ Connection management
└────────┬────────┘
         ↓
┌─────────────────┐
│ Linera Network  │ Your blockchain
└─────────────────┘
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── dynamic-signer.ts      # Dynamic ↔ Linera bridge
│   └── linera-adapter.ts      # Linera connection manager
├── contexts/
│   └── LineraContext.tsx      # React context for state
├── components/
│   └── Header.tsx             # Wallet connection UI
├── pages/
│   └── dashboard.tsx          # Prediction markets
└── main.tsx                   # App entry point
```

## 🔧 Configuration

### Environment Variables

```bash
# .env file
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id
VITE_LINERA_RPC_URL=http://localhost:8080
```

### Linera Application

To connect to your Linera application:

```typescript
import { useLinera } from './contexts/LineraContext';

function YourComponent() {
  const { setAppId } = useLinera();
  
  useEffect(() => {
    setAppId('YOUR_LINERA_APP_ID');
  }, []);
}
```

## 🎮 Usage

1. Click **"Connect Wallet"** in the header
2. Choose your wallet and authenticate
3. Click **"Connect to Linera"** to initialize blockchain connection
4. Navigate to markets and start betting!

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Customization

### Update Linera RPC URL

Edit `src/contexts/LineraContext.tsx`:

```typescript
const DEFAULT_LINERA_RPC_URL = 'YOUR_RPC_URL_HERE';
```

### Adjust API Calls

The Linera SDK integration uses placeholder calls. Update based on your actual API:

- `src/lib/linera-adapter.ts` - Connection setup
- `src/pages/dashboard.tsx` - Query and mutation calls

### Theme Customization

All components use inline styles with a cyberpunk theme. To customize:

1. Update gradient colors
2. Change fonts (currently monospace)
3. Modify animations

## 🧪 Testing

```bash
# Test wallet connection
1. Run app → Connect wallet → Verify connection

# Test Linera integration
1. Connect wallet → Connect to Linera → Check chain ID display

# Test betting
1. Navigate to markets → Select option → Enter amount → Place bet
```

## 🐛 Troubleshooting

### "Wallet connector not available"
- Ensure Dynamic Environment ID is set in `.env`
- Clear browser cache and reload

### "Failed to connect to Linera"
- Verify Linera node is running
- Check RPC URL in `.env`
- Review browser console for errors

### TypeScript errors during build
- Run `npm run build` to verify
- Check `SETUP_GUIDE.md` for API adjustments

## 📦 Dependencies

### Core
- `react` - UI framework
- `react-router-dom` - Routing
- `vite` - Build tool

### Blockchain
- `@linera/client` - Linera SDK
- `@dynamic-labs/sdk-react-core` - Wallet authentication
- `@dynamic-labs/ethereum` - Ethereum wallet connectors

## 🚢 Deployment

### Build

```bash
npm run build
```

### Deploy

Deploy the `dist/` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting

### Environment Variables

Don't forget to set production environment variables:

```bash
VITE_DYNAMIC_ENVIRONMENT_ID=prod_environment_id
VITE_LINERA_RPC_URL=https://your-production-rpc.com
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🎯 Next Steps

- [ ] Deploy your Linera prediction market contract
- [ ] Update query/mutation calls with real contract
- [ ] Add transaction history
- [ ] Implement user profiles
- [ ] Add market creation UI
- [ ] Deploy to production

## 🔗 Resources

- [Dynamic Labs Docs](https://docs.dynamic.xyz/)
- [Linera Documentation](https://linera.io/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 💬 Support

Need help? Check out:
- `QUICK_START.md` for fast setup
- `SETUP_GUIDE.md` for detailed instructions
- `IMPLEMENTATION_SUMMARY.md` for technical details

---

Built with ⚡ by the ForceFi Team

**Dynamic + Linera + React = The Future of Prediction Markets**
