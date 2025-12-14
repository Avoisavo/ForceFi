# Linera Documentation

## Overview

[Linera](https://linera.dev) is a decentralized protocol for real-time Web3 applications. It is designed to be the first blockchain capable of running a virtually unlimited number of chains in parallel, including one dedicated user chain per user wallet.

### Key Features

*   **Microchains**: Linera uses a multi-chain protocol where users have their own "microchains". This allows for parallel execution and horizontal scaling.
*   **Real-time**: Finality time is under 0.5 seconds for most blocks.
*   **Elastic Validators**: Validators can scale elastically by adding or removing internal workers, similar to regular web services.
*   **Web2-like Experience**: Supports push notifications and reactive programming.

### How it Works

*   **User Chains**: Users propose blocks directly to their own chains.
*   **Validators**: Ensure all blocks are validated and finalized across all chains.
*   **Communication**: Microchains communicate efficiently using the internal networks of validators.

## Getting Started

### Installation

To develop on Linera, you need the Linera toolchain.

**Prerequisites:**
*   Rust and Wasm
*   Protoc

**Install from Crates.io:**

```bash
cargo install --locked linera-storage-service
cargo install --locked linera-service
cargo add linera-sdk
```

### Hello Linera

**1. Create a Wallet on Testnet**

To interact with the testnet, initialize a wallet and request a chain from the faucet:

```bash
linera wallet init --faucet https://faucet.testnet-conway.linera.net
linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net
```

**2. Local Development Network**

Alternatively, you can run a local network:

```bash
linera net up --with-faucet --faucet-port 8080
```

Then initialize a wallet for the local network:

```bash
linera wallet init --faucet http://localhost:8080
linera wallet request-chain --faucet http://localhost:8080
```

**3. Check Balance**

```bash
linera sync
linera query-balance
```

### Building and Publishing an Application

**1. Build**

Navigate to your project directory (e.g., `examples/counter`) and build:

```bash
cargo build --release --target wasm32-unknown-unknown
```

**2. Publish**

Publish the bytecode and create the application:

```bash
linera publish-and-create \
  ../target/wasm32-unknown-unknown/release/counter_{contract,service}.wasm \
  --json-argument "42"
```

**3. Query**

Run the service to expose GraphQL APIs:

```bash
linera service --port 8080
```

Visit `http://localhost:8080` to use the GraphiQL IDE.

## Resources

*   [Official Website](https://linera.dev)
*   [GitHub Repository](https://github.com/linera-io/linera-protocol)
*   [Developer Manual](https://linera.dev/developers/getting_started.html)
