use linera_sdk::views::{
    linera_views, MapView, RegisterView, RootView, ViewStorageContext,
};
use serde::{Deserialize, Serialize};

/// A prediction market
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Market {
    pub id: u64,
    pub question: String,
    pub outcomes: Vec<String>,
    pub total_shares: Vec<u64>,  // Total shares for each outcome
    pub resolved: bool,
    pub winning_outcome: Option<usize>,
}

/// A user's position in a market - uses composite key (owner, market_id, outcome)
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Position {
    pub market_id: u64,
    pub outcome: usize,
    pub shares: u64,
}

/// Composite key for user positions
#[derive(Debug, Clone, Serialize, Deserialize, Hash, Eq, PartialEq)]
pub struct PositionKey {
    pub owner: Vec<u8>,
    pub market_id: u64,
    pub outcome: usize,
}

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct PredictionMarketState {
    /// Counter for market IDs
    pub next_market_id: RegisterView<u64>,
    
    /// All markets (market_id -> Market)
    pub markets: MapView<u64, Market>,
    
    /// User positions with composite key
    pub positions: MapView<PositionKey, u64>,
}
