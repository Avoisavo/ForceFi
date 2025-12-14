// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimplePredictionMarket {
    struct Market {
        string title; // "Will Joshua get an A?"
        address judge;
        uint256 endTime;
        uint256 totalPool;
        uint256 winningOutcome;
        bool resolved;
    }

    Market[] public markets;

    // marketId => outcome (0 or 1) => total bet
    mapping(uint256 => mapping(uint256 => uint256)) public pool;

    // marketId => user => outcome => amount
    mapping(uint256 => mapping(address => mapping(uint256 => uint256)))
        public bets;

    // -------------------------
    // CREATE MARKET (JUDGE)
    // -------------------------
    function createMarket(string calldata title, uint256 endTime) external {
        require(endTime > block.timestamp);

        markets.push(
            Market({
                title: title,
                judge: msg.sender,
                endTime: endTime,
                totalPool: 0,
                winningOutcome: 0,
                resolved: false
            })
        );
    }

    // -------------------------
    // BET (0 = NO, 1 = YES)
    // -------------------------
    function bet(uint256 marketId, uint256 outcome) external payable {
        require(outcome == 0 || outcome == 1);
        require(block.timestamp < markets[marketId].endTime);
        require(!markets[marketId].resolved);
        require(msg.value > 0);

        bets[marketId][msg.sender][outcome] += msg.value;
        pool[marketId][outcome] += msg.value;
        markets[marketId].totalPool += msg.value;
    }

    // -------------------------
    // RESOLVE (JUDGE ONLY)
    // -------------------------
    function resolve(uint256 marketId, uint256 winningOutcome) external {
        Market storage m = markets[marketId];
        require(msg.sender == m.judge);
        require(!m.resolved);
        require(winningOutcome == 0 || winningOutcome == 1);

        m.winningOutcome = winningOutcome;
        m.resolved = true;
    }

    // -------------------------
    // CLAIM WINNINGS
    // -------------------------
    function claim(uint256 marketId) external {
        Market storage m = markets[marketId];
        require(m.resolved);

        uint256 userBet = bets[marketId][msg.sender][m.winningOutcome];
        require(userBet > 0);

        uint256 payout = (userBet * m.totalPool) /
            pool[marketId][m.winningOutcome];

        bets[marketId][msg.sender][m.winningOutcome] = 0;

        payable(msg.sender).transfer(payout);
    }
}
