# ForceFi ⚡

> A real-time, microchain-based prediction market platform built on Linera blockchain

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Linera](https://img.shields.io/badge/Built%20on-Linera-purple)
![Rust](https://img.shields.io/badge/Smart%20Contracts-Rust-orange)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)

## 🎯 What it does

ForceFi is a real-time, microchain-based prediction market built on Linera that aggregates market data from multiple Web3 platforms into one unified interface. It collects and compares odds, liquidity, and market depth using subgraphs, allowing users to view and interact with diverse markets in real time. 

Through automated smart contract workflows, users can place bets, track outcomes, and settle results seamlessly. By deploying each bet on its own microchain, ForceFi eliminates gas congestion and ensures scalable, low-latency execution for thousands of parallel markets.

## 🔧 The problem it solves

- **Fragmented prediction markets**: Current Web3 prediction markets operate in isolated ecosystems, making it difficult for users to compare odds, liquidity, and market conditions across platforms.

- **High gas fees and latency**: Existing systems that rely on shared global chains suffer from congestion, slow confirmations, and expensive gas costs for every bet or market resolution.

- **Lack of real-time execution**: Users cannot interact with prediction markets in real time, and settlement processes often involve delays or manual verification steps.

- **Limited interoperability**: Cross-platform liquidity and data aggregation are difficult to achieve without a unified infrastructure that supports seamless communication between markets.

## 🛠️ Technologies Used

### Blockchain & Smart Contracts
- **Linera**: Microchain infrastructure for parallelized and scalable market deployment
- **Rust**: Smart contract development language with Linera SDK
- **WebAssembly**: Compilation target for on-chain execution
- **GraphQL**: Query layer for application state and data retrieval
- **BCS**: Binary serialization format for contract operations

### Frontend
- **React 19**: Modern UI library for interactive user interfaces
- **TypeScript**: Type-safe frontend development
- **Vite**: Lightning-fast build tool and dev server
- **React Router**: Client-side routing and navigation
- **Dynamic Labs**: Wallet connectivity and user authentication

### Data & Integration
- **async-graphql**: GraphQL server implementation for service queries
- **Subgraphs**: Aggregating markets, liquidity, and odds across platforms

## 🔌 Linera SDK & Protocol Features

### State Management (Views)
- **`RegisterView<u64>`**: Stores market ID counter
- **`MapView<u64, Market>`**: Stores all prediction markets
- **`MapView<PositionKey, u64>`**: Tracks user positions across markets
- **`RootView`**: Automatic state persistence and loading

```rust
#[derive(RootView)]
pub struct PredictionMarketState {
    pub next_market_id: RegisterView<u64>,
    pub markets: MapView<u64, Market>,
    pub positions: MapView<PositionKey, u64>,
}
```

### Contract Operations
```rust
#[derive(GraphQLMutationRoot)]
pub enum Operation {
    CreateMarket { question: String, outcomes: Vec<String> },
    BuyShares { market_id: u64, outcome: usize, shares: u64 },
    ResolveMarket { market_id: u64, winning_outcome: usize },
}
```

### Key SDK Features Used
- **Contract/Service Separation**: Contract handles state mutations, Service provides GraphQL queries
- **BCS Serialization**: Binary encoding for operations and chain identity
- **Runtime Context**: `runtime.chain_id()` for user identification, `runtime.application_parameters()` for validation
- **async-graphql**: Native GraphQL support via `GraphQLMutationRoot` derive macro

### Linera Benefits
- Microchain-per-market isolation for parallel execution
- No gas congestion or variable fees
- Instant finality for bet placement and resolution
- Gas-free GraphQL queries

## 🏗️ How we built it

1. **Architecture design**: Defined the microchain-per-bet architecture to isolate each market for independent execution and scaling.

2. **Factory contract**: Implemented a Rust-based contract that dynamically deploys microchains for each new market instance.

3. **Subgraph integration**: Built subgraphs to aggregate data from external prediction markets and provide unified odds and liquidity feeds.

4. **Automated workflow**: Developed secure smart contract workflows for bet placement, execution, and settlement using Linera SDK.

5. **Frontend development**: Built an interactive dashboard displaying live odds, market data, and real-time resolution updates with React and TypeScript.

## 🚧 Challenges We Ran Into

- **Factory contract scalability**: Designing a scalable factory contract to handle thousands of parallel microchains for different bets.

- **Cross-microchain messaging**: Managing communication between microchains for features like leaderboards, aggregated liquidity, and global analytics.

- **Oracle synchronization**: Ensuring consistent and low-latency oracle data updates across markets to prevent mismatched results or delayed resolutions.

## 📚 What we learned

- **Microchain scaling**: Linera's architecture allows true horizontal scaling, with each market operating independently without impacting others.

- **Cross-chain interoperability**: Managing shared state and data across microchains requires new design paradigms compared to traditional monolithic contracts.

- **Real-time performance**: Building near-instant settlement and odds updates requires tightly optimized messaging and oracle integration.

## 🚀 What's next

- **Expand market coverage**: Integrate more Web3 prediction platforms and subgraphs for broader data aggregation.

- **AI-driven odds engine**: Introduce algorithmic market making and real-time odds optimization using AI models.

- **Decentralized dispute resolution**: Implement a trustless, community-driven verification system for market outcomes.

- **Mobile integration**: Launch a lightweight mobile interface for real-time bet tracking and instant notifications.

- **Public testnet deployment**: Deploy ForceFi on Linera testnet for community testing and performance benchmarking.

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

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👥 Team

Tan Zhi Wei (@zhiweavo )

---

**Note**: This project is currently in active development. Features and documentation may change.

