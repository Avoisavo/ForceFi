use linera_sdk::views::{
    linera_views, MapView, RegisterView, RootView, ViewStorageContext,
};
use serde::{Deserialize, Serialize};
use linera_sdk::linera_base_types::AccountOwner as Owner;

#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Market {
    pub id: u64,
    pub title: String,
    pub judge: String,
    pub opponent: Option<String>,
    pub bet_amount: u64,
    pub end_time: u64,
    pub image_url: String,
    pub total_pool: u64,
    pub winning_outcome: u64,
    pub resolved: bool,
}

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct PredictionMarketState {
    pub markets: MapView<u64, Market>,
    // marketId => outcome (0 or 1) => total bet
    pub pool: MapView<(u64, u64), u64>,
    // marketId => user => outcome => amount
    pub bets: MapView<(u64, Owner, u64), u64>,
    // To emulate push behavior
    pub next_market_id: RegisterView<u64>,
}
