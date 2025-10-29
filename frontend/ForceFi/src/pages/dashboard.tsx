import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLinera } from '../contexts/LineraContext';
import { lineraAdapter } from '../lib/linera-adapter';
import bitcoinLogo from '../assets/bitcoinlogo.png';
import chainlinkLogo from '../assets/chainlinklogo.png';

interface Market {
  id: number;
  question: string;
  imageUrl: string;  // Add image URL for each market
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
      imageUrl: bitcoinLogo,
      options: [
        { name: "YES", odds: 65, color: "#00ff88" },
        { name: "NO", odds: 35, color: "#ff0055" }
      ],
      totalPool: 125000,
      endTime: "Dec 31, 2025"
    },
    {
      id: 5,
      question: "US Presidential Election 2028",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/512px-Flag_of_the_United_States.svg.png",
      options: [
        { name: "DEMOCRAT", odds: 48, color: "#00ddff" },
        { name: "REPUBLICAN", odds: 47, color: "#ff0055" },
        { name: "OTHER", odds: 5, color: "#ffaa00" }
      ],
      totalPool: 215000,
      endTime: "Nov 5, 2028"
    },
    {
      id: 6,
      question: "Will AI pass Turing Test by 2026?",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/8618/8618682.png",
      options: [
        { name: "YES", odds: 72, color: "#00ff88" },
        { name: "NO", odds: 28, color: "#ff0055" }
      ],
      totalPool: 54000,
      endTime: "Dec 31, 2026"
    },
    {
      id: 7,
      question: "Total Crypto Market Cap EOY 2025",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/7024/7024046.png",
      options: [
        { name: ">$5T", odds: 35, color: "#00ff88" },
        { name: "$3-5T", odds: 45, color: "#ffaa00" },
        { name: "<$3T", odds: 20, color: "#ff0055" }
      ],
      totalPool: 142000,
      endTime: "Dec 31, 2025"
    },
    {
      id: 8,
      question: "Will Tesla stock hit $500 in 2025?",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/512px-Tesla_Motors.svg.png",
      options: [
        { name: "YES", odds: 38, color: "#00ff88" },
        { name: "NO", odds: 62, color: "#ff0055" }
      ],
      totalPool: 76000,
      endTime: "Dec 31, 2025"
    },
    {
      id: 9,
      question: "Next Bitcoin Halving Impact",
      imageUrl: bitcoinLogo,
      options: [
        { name: "BULLISH", odds: 68, color: "#00ff88" },
        { name: "BEARISH", odds: 18, color: "#ff0055" },
        { name: "NEUTRAL", odds: 14, color: "#ffaa00" }
      ],
      totalPool: 187000,
      endTime: "May 1, 2028"
    },
    {
      id: 10,
      question: "Will global inflation drop below 2% in 2025?",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
      options: [
        { name: "YES", odds: 31, color: "#00ff88" },
        { name: "NO", odds: 69, color: "#ff0055" }
      ],
      totalPool: 62000,
      endTime: "Dec 31, 2025"
    },
    {
      id: 11,
      question: "Web3 Gaming Market Size by 2026",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/3588/3588592.png",
      options: [
        { name: ">$100B", odds: 25, color: "#aa00ff" },
        { name: "$50-100B", odds: 42, color: "#00ddff" },
        { name: "<$50B", odds: 33, color: "#ffaa00" }
      ],
      totalPool: 45000,
      endTime: "Dec 31, 2026"
    },
    {
      id: 12,
      question: "Will Chainlink reach $100 in 2025?",
      imageUrl: chainlinkLogo,
      options: [
        { name: "YES", odds: 29, color: "#00ff88" },
        { name: "NO", odds: 71, color: "#ff0055" }
      ],
      totalPool: 38000,
      endTime: "Dec 31, 2025"
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
              padding: '1.25rem',
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
              
              {/* Header with Image */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1rem',
                alignItems: 'flex-start'
              }}>
                <img 
                  src={market.imageUrl} 
                  alt={market.question}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    flexShrink: 0,
                    background: '#0f1419',
                    padding: '4px'
                  }}
                />
                <h2 style={{
                  color: '#ffffff',
                  fontSize: '1rem',
                  margin: 0,
                  fontWeight: '600',
                  lineHeight: '1.4',
                  flex: 1
                }}>
                  {market.question}
                </h2>
              </div>

              {/* Betting Options */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1rem'
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
                        padding: '0.75rem 1rem',
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
                      <span style={{ fontWeight: '600' }}>{option.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{
                          fontSize: '1.125rem',
                          color: professionalColor,
                          fontWeight: '700'
                        }}>
                          {option.odds}%
                        </span>
                        <div style={{
                          display: 'flex',
                          gap: '0.5rem'
                        }}>
                          <button style={{
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.375rem 0.875rem',
                            color: 'white',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}>
                            Yes
                          </button>
                          <button style={{
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.375rem 0.875rem',
                            color: 'white',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}>
                            No
                          </button>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer with Volume and Icons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.5)',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255,255,255,0.05)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                    ${(market.totalPool / 1000).toFixed(0)}k Vol.
                  </span>
                </span>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </button>
                  <button style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>

    </div>
  );
}