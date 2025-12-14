#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};
use prediction_market::Operation;
use self::state::{Market, PredictionMarketState};

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
        self.runtime.application_parameters();
        self.state.next_market_id.set(0);
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::CreateMarket { title, end_time } => {
                let judge = self.runtime.authenticated_signer().expect("Authentication required");
                let current_time = self.runtime.system_time().micros();
                
                if end_time <= current_time { panic!("End time must be in the future"); }

                let market_id = *self.state.next_market_id.get();
                let market = Market {
                    id: market_id,
                    title,
                    judge,
                    end_time,
                    total_pool: 0,
                    winning_outcome: 0,
                    resolved: false,
                };

                self.state.markets.insert(&market_id, market).expect("Failed to insert market");
                self.state.next_market_id.set(market_id + 1);
            }

            Operation::Bet { market_id, outcome, amount } => {
                let owner = self.runtime.authenticated_signer().expect("Authentication required");
                
                if outcome != 0 && outcome != 1 { panic!("Outcome must be 0 or 1"); }
                if amount == 0 { panic!("Amount must be positive"); }

                let mut market = self.state.markets.get(&market_id)
                    .await
                    .expect("Failed to get market")
                    .expect("Market not found");

                let current_time = self.runtime.system_time().micros();
                if current_time >= market.end_time { panic!("Market has ended"); }
                if market.resolved { panic!("Market is resolved"); }

                // bets[marketId][msg.sender][outcome] += msg.value;
                let bet_key = (market_id, owner, outcome);
                let current_bet = self.state.bets.get(&bet_key).await.expect("Failed to get bet").unwrap_or(0);
                self.state.bets.insert(&bet_key, current_bet + amount).expect("Failed to update bet");

                // pool[marketId][outcome] += msg.value;
                let pool_key = (market_id, outcome);
                let current_pool = self.state.pool.get(&pool_key).await.expect("Failed to get pool").unwrap_or(0);
                self.state.pool.insert(&pool_key, current_pool + amount).expect("Failed to update pool");

                // markets[marketId].totalPool += msg.value;
                market.total_pool += amount;
                self.state.markets.insert(&market_id, market).expect("Failed to update market");
            }

            Operation::Resolve { market_id, winning_outcome } => {
                let sender = self.runtime.authenticated_signer().expect("Authentication required");
                
                let mut market = self.state.markets.get(&market_id)
                    .await
                    .expect("Failed to get market")
                    .expect("Market not found");

                if sender != market.judge { panic!("Only judge can resolve"); }
                if market.resolved { panic!("Market already resolved"); }
                if winning_outcome != 0 && winning_outcome != 1 { panic!("Outcome must be 0 or 1"); }

                market.winning_outcome = winning_outcome;
                market.resolved = true;
                self.state.markets.insert(&market_id, market).expect("Failed to resolve market");
            }

            Operation::Claim { market_id } => {
                let sender = self.runtime.authenticated_signer().expect("Authentication required");
                
                let market = self.state.markets.get(&market_id)
                    .await
                    .expect("Failed to get market")
                    .expect("Market not found");

                if !market.resolved { panic!("Market not resolved"); }

                let winning_outcome = market.winning_outcome;
                let bet_key = (market_id, sender, winning_outcome);
                let user_bet = self.state.bets.get(&bet_key).await.expect("Failed to get bet").unwrap_or(0);

                if user_bet == 0 { panic!("No bet to claim"); }

                let pool_key = (market_id, winning_outcome);
                let pool_winning_outcome = self.state.pool.get(&pool_key).await.expect("Failed to get pool").unwrap_or(0);

                // payout = (userBet * m.totalPool) / pool[marketId][m.winningOutcome];
                // Use u128 to prevent overflow before division
                let payout = (user_bet as u128 * market.total_pool as u128) / pool_winning_outcome as u128;

                // bets[marketId][msg.sender][m.winningOutcome] = 0;
                self.state.bets.insert(&bet_key, 0).expect("Failed to reset bet");

                // payable(msg.sender).transfer(payout);
                // Note: Actual token transfer would require a Fungible Token application or similar mechanism.
                // For this logic-only port, we calculate the payout.
            }
        }
        Self::Response::default()
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
