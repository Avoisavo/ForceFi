import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { useLinera } from '../contexts/LineraContext';
import { lineraAdapter } from '../lib/linera-adapter';

interface Market {
  id: number;
  question: string;
  options: {
    name: string;
    odds: number;
    color: string;
  }[];
  totalPool: number;
  endTime: string;
}

export default function Dashboard() {
  const { isConnected } = useLinera();
  const [markets] = useState<Market[]>([
    {
      id: 1,
      question: "Will Bitcoin hit $100K by end of 2025?",
      options: [
        { name: "YES", odds: 65, color: "#00ff88" },
        { name: "NO", odds: 35, color: "#ff0055" }
      ],
      totalPool: 125000,
      endTime: "Dec 31, 2025"
    },
    {
      id: 2,
      question: "Next Fed Rate Decision",
      options: [
        { name: "CUT", odds: 45, color: "#00ddff" },
        { name: "HOLD", odds: 40, color: "#ffaa00" },
        { name: "RAISE", odds: 15, color: "#ff44aa" }
      ],
      totalPool: 89000,
      endTime: "Nov 15, 2025"
    },
    {
      id: 3,
      question: "ETH to flip BTC by market cap?",
      options: [
        { name: "2025", odds: 20, color: "#aa00ff" },
        { name: "2026", odds: 35, color: "#00ff88" },
        { name: "NEVER", odds: 45, color: "#ff0055" }
      ],
      totalPool: 67500,
      endTime: "Dec 31, 2026"
    }
  ]);

  const [selectedBets, setSelectedBets] = useState<{[key: number]: string}>({});
  const [betAmounts, setBetAmounts] = useState<{[key: number]: number}>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleBet = (marketId: number, option: string) => {
    setSelectedBets({...selectedBets, [marketId]: option});
  };

  const handleAmountChange = (marketId: number, amount: number) => {
    setBetAmounts({...betAmounts, [marketId]: amount});
  };

  // Example: Load markets from Linera (if you have a query endpoint)
  useEffect(() => {
    const loadMarketsFromLinera = async () => {
      if (!isConnected || !lineraAdapter.isApplicationSet()) return;

      try {
        // Example query - adjust based on your Linera application's GraphQL schema
        // const result = await lineraAdapter.queryApplication<{markets: Market[]}>({
        //   query: "query { markets { id question options totalPool endTime } }"
        // });
        // setMarkets(result.markets);
        
        console.log('📊 Would load markets from Linera here');
      } catch (error) {
        console.error('Failed to load markets:', error);
      }
    };

    loadMarketsFromLinera();
  }, [isConnected]);

  const placeBet = async (marketId: number) => {
    if (!isConnected) {
      alert('⚠️ Please connect your wallet first!');
      return;
    }

    const selectedOption = selectedBets[marketId];
    const amount = betAmounts[marketId] || 100;

    if (!selectedOption) {
      alert('⚠️ Please select an option first!');
      return;
    }

    setLoading(true);
    setSuccessMessage(null);

    try {
      // Example mutation - adjust based on your Linera application's schema
      // This is a placeholder - you'll need to implement your actual Linera betting contract
      console.log('🎯 Placing bet:', { marketId, selectedOption, amount });
      
      if (lineraAdapter.isApplicationSet()) {
        // Example mutation call
        // await lineraAdapter.mutateApplication({
        //   mutation: `mutation {
        //     placeBet(marketId: ${marketId}, option: "${selectedOption}", amount: ${amount}) {
        //       success
        //       transactionId
        //     }
        //   }`
        // });
        
        setSuccessMessage(`✅ Bet placed: ${amount} on ${selectedOption}!`);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        // Simulate bet placement without Linera app
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccessMessage(`🎮 Demo mode: Bet of ${amount} on ${selectedOption} recorded!`);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
      
      // Clear selection after successful bet
      const newSelectedBets = {...selectedBets};
      delete newSelectedBets[marketId];
      setSelectedBets(newSelectedBets);
      
      const newBetAmounts = {...betAmounts};
      delete newBetAmounts[marketId];
      setBetAmounts(newBetAmounts);
      
    } catch (error) {
      console.error('Failed to place bet:', error);
      alert('❌ Failed to place bet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #1a0033 0%, #0a1428 50%, #001a33 100%)',
    }}>
      <Header />
      
      {/* Hero Section */}
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(255,0,255,0.1) 0%, transparent 100%)',
        borderBottom: '2px solid #ff00ff'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #ff00ff, #00ffff, #ffff00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 30px rgba(255,0,255,0.5)',
          marginBottom: '1rem',
          fontFamily: 'monospace'
        }}>
          🎮 PREDICTION ARCADE 🎮
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#00ffff',
          textShadow: '0 0 10px rgba(0,255,255,0.5)'
        }}>
          Place your bets • Win big • Level up
        </p>
        
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: 'linear-gradient(135deg, rgba(0,255,136,0.9), rgba(0,221,255,0.9))',
          border: '2px solid #00ff88',
          borderRadius: '10px',
          padding: '1rem 1.5rem',
          color: 'white',
          fontWeight: 'bold',
          maxWidth: '350px',
          boxShadow: '0 0 30px rgba(0,255,136,0.5)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {successMessage}
        </div>
      )}

      <main style={{ 
        flex: 1,
        padding: '3rem 2rem',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Markets Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {markets.map((market) => (
            <div key={market.id} style={{
              background: 'rgba(0,0,0,0.6)',
              border: '3px solid #ff00ff',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: '0 0 20px rgba(255,0,255,0.3), inset 0 0 20px rgba(0,255,255,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 5px 30px rgba(255,0,255,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255,0,255,0.3)';
            }}>
              {/* Arcade Corner Decoration */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #ff00ff, #00ffff)',
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
              }}/>
              
              <h2 style={{
                color: '#ffff00',
                fontSize: '1.3rem',
                marginBottom: '1rem',
                textShadow: '0 0 10px rgba(255,255,0,0.5)',
                fontFamily: 'monospace'
              }}>
                {market.question}
              </h2>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                fontSize: '0.9rem'
              }}>
                <span style={{ color: '#00ffff' }}>
                  💰 Pool: ${market.totalPool.toLocaleString()}
                </span>
                <span style={{ color: '#ff00ff' }}>
                  ⏰ {market.endTime}
                </span>
              </div>

              {/* Betting Options */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {market.options.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => handleBet(market.id, option.name)}
                    style={{
                      background: selectedBets[market.id] === option.name 
                        ? `linear-gradient(135deg, ${option.color}, ${option.color}dd)`
                        : 'rgba(255,255,255,0.1)',
                      border: `2px solid ${option.color}`,
                      borderRadius: '10px',
                      padding: '1rem',
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: selectedBets[market.id] === option.name
                        ? `0 0 20px ${option.color}`
                        : 'none',
                      fontFamily: 'monospace',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedBets[market.id] !== option.name) {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${option.color}33, ${option.color}55)`;
                        e.currentTarget.style.boxShadow = `0 0 15px ${option.color}66`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedBets[market.id] !== option.name) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <span>{option.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{
                        fontSize: '0.9rem',
                        color: option.color,
                        textShadow: `0 0 5px ${option.color}`
                      }}>
                        {option.odds}%
                      </span>
                      {selectedBets[market.id] === option.name && (
                        <span style={{ fontSize: '1.5rem' }}>✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Bet Amount Input */}
              {selectedBets[market.id] && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={{
                    display: 'block',
                    color: '#00ffff',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                  }}>
                    💰 Bet Amount:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={betAmounts[market.id] || 100}
                    onChange={(e) => handleAmountChange(market.id, parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '2px solid #00ffff',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1.1rem',
                      fontFamily: 'monospace',
                      marginBottom: '1rem'
                    }}
                  />
                  <button 
                    onClick={() => placeBet(market.id)}
                    disabled={loading || !isConnected}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: loading || !isConnected 
                        ? 'rgba(128,128,128,0.5)' 
                        : 'linear-gradient(135deg, #ff00ff, #00ffff)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      cursor: loading || !isConnected ? 'not-allowed' : 'pointer',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      boxShadow: loading || !isConnected 
                        ? 'none' 
                        : '0 0 20px rgba(255,0,255,0.6)',
                      fontFamily: 'monospace',
                      animation: loading ? 'none' : 'pulse 2s infinite',
                      opacity: loading || !isConnected ? 0.6 : 1
                    }}
                  >
                    {loading 
                      ? '⏳ PLACING BET...' 
                      : !isConnected 
                        ? '🔒 CONNECT WALLET' 
                        : `🎯 PLACE BET ON ${selectedBets[market.id]} 🎯`}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}