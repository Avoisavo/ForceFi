#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};
use serde::{Deserialize, Serialize};

use prediction_market::Operation;

use self::state::PredictionMarketState;

pub struct PredictionMarketContract {
    state: PredictionMarketState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(PredictionMarketContract);

impl WithContractAbi for PredictionMarketContract {
    type Abi = prediction_market::PredictionMarketAbi;
}

impl Contract for PredictionMarketContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = PredictionMarketState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        PredictionMarketContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        // validate that the application parameters were configured correctly.
        self.runtime.application_parameters();
        self.state.next_market_id.set(0);
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        use crate::state::Market;
        
        match operation {
            Operation::CreateMarket { question, outcomes } => {
                let market_id = *self.state.next_market_id.get();
                let total_shares = vec![0u64; outcomes.len()];
                
                let market = Market {
                    id: market_id,
                    question,
                    outcomes,
                    total_shares,
                    resolved: false,
                    winning_outcome: None,
                };
                
                self.state.markets.insert(&market_id, market).expect("Failed to insert market");
                self.state.next_market_id.set(market_id + 1);
            }
            
            Operation::BuyShares { market_id, outcome, shares } => {
                use crate::state::PositionKey;
                
                let mut market = self.state.markets.get(&market_id)
                    .await
                    .expect("Failed to get market")
                    .expect("Market not found");
                
                // Update total shares
                market.total_shares[outcome] += shares;
                self.state.markets.insert(&market_id, market).expect("Failed to update market");
                
                // Update user position - use chain_id as owner identifier
                let owner = bcs::to_bytes(&self.runtime.chain_id())
                    .expect("Failed to serialize chain_id");
                
                let position_key = PositionKey {
                    owner,
                    market_id,
                    outcome,
                };
                
                let current_shares = self.state.positions.get(&position_key)
                    .await
                    .expect("Failed to get shares")
                    .unwrap_or(0);
                
                self.state.positions.insert(&position_key, current_shares + shares)
                    .expect("Failed to update shares");
            }
            
            Operation::ResolveMarket { market_id, winning_outcome } => {
                let mut market = self.state.markets.get(&market_id)
                    .await
                    .expect("Failed to get market")
                    .expect("Market not found");
                
                market.resolved = true;
                market.winning_outcome = Some(winning_outcome);
                self.state.markets.insert(&market_id, market).expect("Failed to resolve market");
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

#[cfg(test)]
mod tests {
    use futures::FutureExt as _;
    use linera_sdk::{util::BlockingWait, views::View, Contract, ContractRuntime};

    use prediction_market::Operation;

    use super::{PredictionMarketContract, PredictionMarketState};

    #[test]
    fn operation() {
        let initial_value = 10u64;
        let mut app = create_and_instantiate_app(initial_value);

        let increment = 10u64;

        let _response = app
            .execute_operation(Operation::Increment { value: increment })
            .now_or_never()
            .expect("Execution of application operation should not await anything");

        assert_eq!(*app.state.value.get(), initial_value + increment);
    }

    fn create_and_instantiate_app(initial_value: u64) -> PredictionMarketContract {
        let runtime = ContractRuntime::new().with_application_parameters(());
        let mut contract = PredictionMarketContract {
            state: PredictionMarketState::load(runtime.root_view_storage_context())
                .blocking_wait()
                .expect("Failed to read from mock key value store"),
            runtime,
        };

        contract
            .instantiate(initial_value)
            .now_or_never()
            .expect("Initialization of application state should not await anything");

        assert_eq!(*contract.state.value.get(), initial_value);

        contract
    }
}
