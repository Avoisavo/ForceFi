use async_graphql::{Request, Response};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct PredictionMarketAbi;

impl ContractAbi for PredictionMarketAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for PredictionMarketAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    /// Create a new prediction market
    CreateMarket {
        question: String,
        outcomes: Vec<String>,
    },
    /// Buy shares for a specific outcome
    BuyShares {
        market_id: u64,
        outcome: usize,
        shares: u64,
    },
    /// Resolve a market with the winning outcome
    ResolveMarket {
        market_id: u64,
        winning_outcome: usize,
    },
}
