# ForceFi ⚡

> A real-time, microchain-based prediction market platform built on Linera blockchain

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Linera](https://img.shields.io/badge/Built%20on-Linera-purple)
![Rust](https://img.shields.io/badge/Smart%20Contracts-Rust-orange)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)

## 🎯 What It Does
ForceFi is a high-speed prediction market platform that brings social betting to the Linera blockchain. It combines the thrill of skin-in-the-game wagers with the instant finality of microchains. Users can launch their own markets, challenge friends, and define custom terms—wager amount, opponent, and a mutual judge—without worrying about high gas fees. Once a bet is accepted, funds are locked on-chain. When the event ends, the designated judge resolves the outcome with a single click, and the smart contract automatically transfers the pot to the winner.

## 🔧 The Problem It Solves
*   **High Gas Fees & Latency**: Traditional blockchain betting is slow and expensive. ForceFi uses Linera's microchains to eliminate gas congestion and ensure instant trade execution.
*   **Lack of Social Interaction**: Most prediction markets are impersonal. ForceFi enables direct, peer-to-peer social betting with trusted judges.
*   **Complex User Experience**: We abstract away the blockchain complexity, offering a simple interface for creating and resolving bets.
*   **Trust & Settlement**: Informal bets often face settlement issues. ForceFi locks funds on-chain, ensuring the winner always gets paid.

## 🛠️ Technologies I Used
*   **Blockchain**: Linera Protocol (Rust SDK, WebAssembly) for microchain-based smart contracts.
*   **Frontend**: React 19, TypeScript, Vite for a high-performance user interface.
*   **Authentication**: Dynamic Labs (Ethereum Signer) for seamless wallet connection and user auth.
*   **Data Integration**: Custom Sports API for aggregating live market data.
*   **State Management**: `async-graphql` for efficient data querying and Linera Views for scalable on-chain storage.

## 🏗️ How We Built It
We built ForceFi by leveraging Linera's unique microchain architecture. Each market or user interaction can operate on its own lightweight chain, allowing for parallel processing and infinite scalability.
1.  **Smart Contracts**: We developed Rust-based contracts to handle market creation, betting logic, and judge resolution.
2.  **Frontend Integration**: The React frontend interacts directly with these contracts via GraphQL, providing real-time updates without page reloads.
3.  **Social Layer**: We implemented a "Judge" system where a third party is cryptographically authorized to resolve markets, bridging the gap between social trust and on-chain enforcement.

## 🌊 Wave 4 Development: Smart Contract Enhancements
In this wave, we significantly upgraded the smart contract capabilities to support user-generated markets:
*   **Dynamic Market Creation**: Users can now deploy new market instances with custom parameters (Title, Opponent, Wager, Judge) directly from the UI.
*   **Judge Authority**: Implemented a permissioned resolution logic where only the designated wallet address (Judge) can trigger the `Resolve` operation.
*   **Secure Fund Locking**: Enhanced the `Bet` and `Claim` operations to ensure funds are securely held in the contract until resolution, then trustlessly distributed to the winner.

## 🚀 What's Next for Wave 5
*   **AI-Driven Odds**: Integrating AI agents to provide real-time odds and market insights.
*   **Mobile Integration**: Launching a mobile-first interface for betting on the go.
*   **Decentralized Dispute Resolution**: Expanding the judge system to include community voting or oracle-based resolution for public markets.

## 🔮 Long-Term Vision
ForceFi aims to become the global liquidity layer for social and event-based wagering. We envision a future where anyone can spin up a prediction market for any event—from global sports to local friendly wagers—with zero friction, instant settlement, and complete transparency. We want to make on-chain betting as fast, fair, and social as sending a text message.

## 🚧 Technical Challenges Overcome
*   **Microchain State Management**: Mastering Linera's `View` system to handle state across multiple microchains efficiently.
*   **Judge Authentication**: Ensuring that only the specific judge address could resolve a market, preventing unauthorized settlements.
*   **Real-Time Synchronization**: Syncing on-chain state (bets, resolutions) with the frontend in real-time to provide a "web2-like" snappy experience.

## 📦 Project Structure

```
hansolo/
├── prediction-market/       # Linera smart contracts (Rust)
│   ├── src/
│   │   ├── contract.rs     # Contract logic and operations
│   │   ├── service.rs      # GraphQL service interface
│   │   ├── state.rs        # Application state management
│   │   └── lib.rs          # ABI definitions
│   └── Cargo.toml          # Rust dependencies
│
└── frontend/ForceFi/        # React frontend application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Page components (Dashboard, Bet)
    │   ├── contexts/       # React contexts (Linera)
    │   └── lib/            # Utility libraries
    └── package.json        # Node dependencies
```

## 🏃 Quick Start

### Prerequisites
- Rust (latest stable)
- Node.js 18+
- Linera CLI tools

### Smart Contract Development

```bash
cd prediction-market

# Build the contract
cargo build --release --target wasm32-unknown-unknown

# Run tests
cargo test
```

### Frontend Development

```bash
cd frontend/ForceFi

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Deploy to Linera

```bash
# Initialize Linera wallet (local testnet)
linera wallet init --faucet https://faucet.testnet-conway.linera.net

# Publish and create application
linera publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_{contract,service}.wasm \
  --json-argument "initial_config"
```

## 👥 Team

Tan Zhi Wei (@zhiweavo )

---

**Note**: This project is currently in active development. Features and documentation may change.
