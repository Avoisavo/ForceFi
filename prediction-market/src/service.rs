#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use std::sync::Arc;

use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{
    graphql::GraphQLMutationRoot, linera_base_types::WithServiceAbi, views::View, Service,
    ServiceRuntime,
};

use prediction_market::Operation;

use self::state::PredictionMarketState;

pub struct PredictionMarketService {
    state: PredictionMarketState,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(PredictionMarketService);

impl WithServiceAbi for PredictionMarketService {
    type Abi = prediction_market::PredictionMarketAbi;
}

impl Service for PredictionMarketService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = PredictionMarketState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        PredictionMarketService {
            state,
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, query: Self::Query) -> Self::QueryResponse {
        // Collect all markets upfront to avoid lifetime issues
        let mut all_markets: Vec<state::Market> = Vec::new();
        self.state.markets.for_each_index_value(|_key, market| {
            all_markets.push(market.clone().into_owned());
            Ok(())
        }).await.expect("Failed to get markets");
        
        Schema::build(
            QueryRoot {
                markets: all_markets,
            },
            Operation::mutation_root(self.runtime.clone()),
            EmptySubscription,
        )
        .finish()
        .execute(query)
        .await
    }
}

struct QueryRoot {
    markets: Vec<state::Market>,
}

#[Object]
impl QueryRoot {
    /// Get all markets
    async fn markets(&self) -> Vec<state::Market> {
        self.markets.clone()
    }
    
    /// Get a specific market by ID
    async fn market(&self, id: u64) -> Option<state::Market> {
        self.markets.iter().find(|m| m.id == id).cloned()
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use async_graphql::{Request, Response, Value};
    use futures::FutureExt as _;
    use linera_sdk::{util::BlockingWait, views::View, Service, ServiceRuntime};
    use serde_json::json;

    use super::{PredictionMarketService, PredictionMarketState};

    #[test]
    fn query() {
        let value = 60u64;
        let runtime = Arc::new(ServiceRuntime::<PredictionMarketService>::new());
        let mut state = PredictionMarketState::load(runtime.root_view_storage_context())
            .blocking_wait()
            .expect("Failed to read from mock key value store");
        state.value.set(value);

        let service = PredictionMarketService { state, runtime };
        let request = Request::new("{ value }");

        let response = service
            .handle_query(request)
            .now_or_never()
            .expect("Query should not await anything");

        let expected = Response::new(Value::from_json(json!({"value": 60})).unwrap());

        assert_eq!(response, expected)
    }
}
