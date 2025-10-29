'use client';

import { useState } from 'react';
import Header from '@/components/header';

interface Market {
  id: number;
  question: string;
  options: {
    name: string;
    odds: number;
    votes: number;
  }[];
  totalPool: number;
  endDate: string;
  category: string;
}

export default function ArcadePredictionMarket() {
  const [coins, setCoins] = useState(1000);
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState('');

  const [markets, setMarkets] = useState<Market[]>([
    {
      id: 1,
      question: 'Will AI achieve AGI by 2030?',
      options: [
        { name: 'YES', odds: 2.5, votes: 400 },
        { name: 'NO', odds: 1.8, votes: 600 },
      ],
      totalPool: 1000,
      endDate: '2030-01-01',
      category: 'TECH',
    },
    {
      id: 2,
      question: 'Bitcoin price above $100K in 2026?',
      options: [
        { name: 'YES', odds: 2.2, votes: 550 },
        { name: 'NO', odds: 2.0, votes: 450 },
      ],
      totalPool: 1000,
      endDate: '2026-12-31',
      category: 'CRYPTO',
    },
    {
      id: 3,
      question: 'First human on Mars before 2035?',
      options: [
        { name: 'YES', odds: 3.5, votes: 300 },
        { name: 'NO', odds: 1.4, votes: 700 },
      ],
      totalPool: 1000,
      endDate: '2035-01-01',
      category: 'SPACE',
    },
    {
      id: 4,
      question: 'Global temperature rise > 2°C by 2040?',
      options: [
        { name: 'YES', odds: 1.6, votes: 650 },
        { name: 'NO', odds: 2.8, votes: 350 },
      ],
      totalPool: 1000,
      endDate: '2040-12-31',
      category: 'CLIMATE',
    },
  ]);

  const placeBet = () => {
    if (selectedMarket === null || selectedOption === null || !betAmount) return;
    
    const amount = parseInt(betAmount);
    if (amount <= 0 || amount > coins) return;

    setCoins(coins - amount);
    
    setMarkets(markets.map(market => {
      if (market.id === selectedMarket) {
        const newOptions = [...market.options];
        newOptions[selectedOption].votes += amount;
        const newTotalPool = market.totalPool + amount;
        
        // Recalculate odds
        newOptions.forEach((opt, idx) => {
          newOptions[idx].odds = parseFloat((newTotalPool / opt.votes).toFixed(2));
        });
        
        return { ...market, options: newOptions, totalPool: newTotalPool };
      }
      return market;
    }));

    setBetAmount('');
    setSelectedMarket(null);
    setSelectedOption(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      TECH: 'from-cyan-500 to-blue-500',
      CRYPTO: 'from-yellow-500 to-orange-500',
      SPACE: 'from-purple-500 to-pink-500',
      CLIMATE: 'from-green-500 to-emerald-500',
    };
    return colors[category] || 'from-gray-500 to-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,255,0.3),transparent_50%)] animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(0,255,255,0.3),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <Header coins={coins} />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {markets.map((market) => (
            <div
              key={market.id}
              className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-md rounded-xl border-4 border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,255,255,0.5)] transition-all duration-300 overflow-hidden"
            >
              {/* Market Header */}
              <div className={`bg-gradient-to-r ${getCategoryColor(market.category)} px-4 py-3 border-b-4 border-cyan-500`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white bg-black/40 px-3 py-1 rounded-full border-2 border-white">
                    {market.category}
                  </span>
                  <span className="text-xs text-white font-mono bg-black/40 px-3 py-1 rounded-full">
                    Pool: 💎 {market.totalPool.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Question */}
              <div className="px-6 py-4 border-b-2 border-cyan-800">
                <h3 className="text-xl font-bold text-cyan-300 mb-2">
                  {market.question}
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Ends: {new Date(market.endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Options */}
              <div className="p-6 space-y-4">
                {market.options.map((option, optIdx) => {
                  const percentage = ((option.votes / market.totalPool) * 100).toFixed(1);
                  const isSelected = selectedMarket === market.id && selectedOption === optIdx;
                  
                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        setSelectedMarket(market.id);
                        setSelectedOption(optIdx);
                      }}
                      className={`w-full relative overflow-hidden rounded-lg border-4 transition-all duration-300 ${
                        isSelected
                          ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.6)] scale-105'
                          : 'border-cyan-600 hover:border-cyan-400'
                      }`}
                    >
                      {/* Progress bar */}
                      <div
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${
                          optIdx === 0 ? 'from-green-500/30 to-green-600/30' : 'from-red-500/30 to-red-600/30'
                        } transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                      
                      <div className="relative px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold ${
                            optIdx === 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {option.name}
                          </span>
                          <span className="text-sm text-gray-400">
                            {percentage}%
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Odds</div>
                          <div className="text-2xl font-bold text-yellow-400 font-mono">
                            {option.odds}x
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Betting Panel */}
        {selectedMarket !== null && selectedOption !== null && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-purple-900 to-transparent border-t-4 border-cyan-500 p-6 shadow-[0_-10px_50px_rgba(0,255,255,0.3)] animate-[slideUp_0.3s_ease-out]">
            <div className="container mx-auto max-w-4xl">
              <div className="bg-black/80 backdrop-blur-md rounded-xl border-4 border-yellow-400 p-6 shadow-[0_0_40px_rgba(255,215,0,0.4)]">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-cyan-400 mb-1">SELECTED BET:</div>
                    <div className="text-xl font-bold text-white">
                      {markets.find(m => m.id === selectedMarket)?.question}
                    </div>
                    <div className="text-lg text-yellow-400 mt-1">
                      Choice: <span className="font-bold">
                        {markets.find(m => m.id === selectedMarket)?.options[selectedOption].name}
                      </span>
                      {' '}@ {markets.find(m => m.id === selectedMarket)?.options[selectedOption].odds}x
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-xs text-cyan-400 block mb-2">BET AMOUNT</label>
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        placeholder="Enter coins"
                        className="w-40 px-4 py-3 bg-purple-900 border-4 border-cyan-500 rounded-lg text-white text-xl font-bold font-mono text-center focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                        max={coins}
                        min={1}
                      />
                    </div>
                    
                    <button
                      onClick={placeBet}
                      disabled={!betAmount || parseInt(betAmount) <= 0 || parseInt(betAmount) > coins}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-8 py-4 rounded-lg border-4 border-yellow-300 text-black font-bold text-xl shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:shadow-[0_0_50px_rgba(255,215,0,0.8)] transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      🎯 PLACE BET
                    </button>
                  </div>
                </div>
                
                {betAmount && parseInt(betAmount) > 0 && parseInt(betAmount) <= coins && (
                  <div className="mt-4 p-4 bg-green-900/30 border-2 border-green-500 rounded-lg">
                    <div className="text-sm text-green-400">
                      Potential Win: <span className="text-2xl font-bold text-green-300 ml-2">
                        💰 {(parseInt(betAmount) * (markets.find(m => m.id === selectedMarket)?.options[selectedOption].odds || 0)).toFixed(0)} coins
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Retro Stats Panel */}
        <div className="mt-8 bg-black/50 backdrop-blur-md rounded-xl border-4 border-pink-500 p-6 shadow-[0_0_30px_rgba(255,0,255,0.3)]">
          <h2 className="text-2xl font-bold text-pink-400 mb-4 font-mono">
            📊 MARKET STATS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-cyan-900 to-blue-900 p-4 rounded-lg border-2 border-cyan-500">
              <div className="text-xs text-cyan-400">TOTAL MARKETS</div>
              <div className="text-3xl font-bold text-white">{markets.length}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-4 rounded-lg border-2 border-pink-500">
              <div className="text-xs text-pink-400">TOTAL POOL</div>
              <div className="text-3xl font-bold text-white">
                {markets.reduce((acc, m) => acc + m.totalPool, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900 to-orange-900 p-4 rounded-lg border-2 border-yellow-500">
              <div className="text-xs text-yellow-400">YOUR BALANCE</div>
              <div className="text-3xl font-bold text-white">{coins.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-green-900 to-emerald-900 p-4 rounded-lg border-2 border-green-500">
              <div className="text-xs text-green-400">ACTIVE BETS</div>
              <div className="text-3xl font-bold text-white">0</div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

