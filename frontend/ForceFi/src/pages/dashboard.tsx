import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  const handleBet = (market: Market, option: { name: string; odds: number; color: string }) => {
    // Navigate to bet page with market details
    const params = new URLSearchParams({
      marketId: market.id.toString(),
      question: market.question,
      option: option.name,
      odds: option.odds.toString(),
      color: option.color,
      pool: market.totalPool.toString(),
      endTime: market.endTime
    });
    navigate(`/bet?${params.toString()}`);
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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      background: '#0f1419',
    }}>
      <Header />
      
      {/* Hero Section */}
      <div style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(180deg, #1a1f2e 0%, #0f1419 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Prediction Markets
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.6)',
            fontWeight: '400'
          }}>
            Trade on the outcome of future events
          </p>
        </div>
      </div>
      
      <main style={{ 
        flex: 1,
        padding: '2rem',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Markets Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {markets.map((market) => (
            <div key={market.id} style={{
              background: '#1a1f2e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              
              <h2 style={{
                color: '#ffffff',
                fontSize: '1.125rem',
                marginBottom: '1rem',
                fontWeight: '600',
                lineHeight: '1.5'
              }}>
                {market.question}
              </h2>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.5)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Volume</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                    ${market.totalPool.toLocaleString()}
                  </span>
                </span>
                <span>
                  {market.endTime}
                </span>
              </div>

              {/* Betting Options */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {market.options.map((option) => {
                  // Map colors to more professional ones
                  const colorMap: {[key: string]: string} = {
                    '#00ff88': '#10b981',
                    '#ff0055': '#ef4444',
                    '#00ddff': '#3b82f6',
                    '#ffaa00': '#f59e0b',
                    '#ff44aa': '#ec4899',
                    '#aa00ff': '#8b5cf6'
                  };
                  const professionalColor = colorMap[option.color] || '#3b82f6';
                  
                  return (
                    <button
                      key={option.name}
                      onClick={() => handleBet(market, option)}
                      style={{
                        background: '#0f1419',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        padding: '0.875rem 1rem',
                        color: 'white',
                        fontSize: '0.9375rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1a1f2e';
                        e.currentTarget.style.borderColor = professionalColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0f1419';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                      }}
                    >
                      <span>{option.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                          fontSize: '1rem',
                          color: professionalColor,
                          fontWeight: '600'
                        }}>
                          {option.odds}¢
                        </span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.5 }}>
                          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      </main>

    </div>
  );
}