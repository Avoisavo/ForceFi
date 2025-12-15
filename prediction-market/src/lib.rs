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
    CreateMarket {
        title: String,
        opponent: Option<String>,
        judge: String,
        bet_amount: u64,
        end_time: u64,
        image_url: String,
    },
    Bet {
        market_id: u64,
        outcome: u64,
        amount: u64,
    },
    Resolve {
        market_id: u64,
        winning_outcome: u64,
    },
    Claim {
        market_id: u64,
    },
}
