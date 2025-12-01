import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLinera } from '../contexts/LineraContext';
import { lineraAdapter } from '../lib/linera-adapter';
import bitcoinLogo from '../assets/bitcoinlogo.png';
import chainlinkLogo from '../assets/chainlinklogo.png';
import forceHero from '../assets/force_hero.png';

interface Market {
  id: number;
  question: string;
  imageUrl: string;
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

  // Unified color palette: Blue (#3b82f6) and Purple (#a78bfa) and White/Gray
  const PRIMARY_BLUE = "#3b82f6";
  const SECONDARY_PURPLE = "#a78bfa";

  const [markets] = useState<Market[]>([
    {
      id: 1,
      question: "Will Bitcoin hit $100K by end of 2025?",
      imageUrl: bitcoinLogo,
      options: [
        { name: "YES", odds: 65, color: PRIMARY_BLUE },
        { name: "NO", odds: 35, color: SECONDARY_PURPLE }
      ],
      totalPool: 125000,
      endTime: "Dec 31, 2025"
    },
    {
      id: 5,
      question: "US Presidential Election 2028",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/512px-Flag_of_the_United_States.svg.png",
      options: [
        { name: "DEMOCRAT", odds: 48, color: PRIMARY_BLUE },
        { name: "REPUBLICAN", odds: 47, color: SECONDARY_PURPLE },
        { name: "OTHER", odds: 5, color: "#94a3b8" }
      ],
      totalPool: 215000,
      endTime: "Nov 5, 2028"
    },
    {
      id: 6,
      question: "Will AI pass Turing Test by 2026?",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/8618/8618682.png",
      options: [
        { name: "YES", odds: 72, color: PRIMARY_BLUE },
        { name: "NO", odds: 28, color: SECONDARY_PURPLE }
      ],
      totalPool: 54000,
      endTime: "Dec 31, 2026"
    },
    {
      id: 7,
      question: "Total Crypto Market Cap EOY 2025",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/7024/7024046.png",
      options: [
        { name: ">$5T", odds: 35, color: PRIMARY_BLUE },
        { name: "$3-5T", odds: 45, color: SECONDARY_PURPLE },
        { name: "<$3T", odds: 20, color: "#94a3b8" }
      ],
      totalPool: 142000,
      endTime: "Dec 31, 2025"
    },
    {
      id: 8,
      question: "Will Tesla stock hit $500 in 2025?",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/512px-Tesla_Motors.svg.png",
      options: [
        { name: "YES", odds: 38, color: PRIMARY_BLUE },
        { name: "NO", odds: 62, color: SECONDARY_PURPLE }
      ],
      totalPool: 76000,
      endTime: "Dec 31, 2025"
    },
    {
      id: 9,
      question: "Next Bitcoin Halving Impact",
      imageUrl: bitcoinLogo,
      options: [
        { name: "BULLISH", odds: 68, color: PRIMARY_BLUE },
        { name: "BEARISH", odds: 18, color: SECONDARY_PURPLE },
        { name: "NEUTRAL", odds: 14, color: "#94a3b8" }
      ],
      totalPool: 187000,
      endTime: "May 1, 2028"
    },
    {
      id: 10,
      question: "Will global inflation drop below 2% in 2025?",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
      options: [
        { name: "YES", odds: 31, color: PRIMARY_BLUE },
        { name: "NO", odds: 69, color: SECONDARY_PURPLE }
      ],
      totalPool: 62000,
      endTime: "Dec 31, 2025"
    },
    {
      id: 11,
      question: "Web3 Gaming Market Size by 2026",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/3588/3588592.png",
      options: [
        { name: ">$100B", odds: 25, color: PRIMARY_BLUE },
        { name: "$50-100B", odds: 42, color: SECONDARY_PURPLE },
        { name: "<$50B", odds: 33, color: "#94a3b8" }
      ],
      totalPool: 45000,
      endTime: "Dec 31, 2026"
    },
    {
      id: 12,
      question: "Will Chainlink reach $100 in 2025?",
      imageUrl: chainlinkLogo,
      options: [
        { name: "YES", odds: 29, color: PRIMARY_BLUE },
        { name: "NO", odds: 71, color: SECONDARY_PURPLE }
      ],
      totalPool: 38000,
      endTime: "Dec 31, 2025"
    }
  ]);

  const handleBet = (market: Market, option: { name: string; odds: number; color: string }) => {
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

  useEffect(() => {
    const loadMarketsFromLinera = async () => {
      if (!isConnected || !lineraAdapter.isApplicationSet()) return;
      try {
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
      background: '#000000',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Image from Landing Page */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${forceHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.2,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Header />

        {/* Hero Section */}
        <div style={{
          padding: '3rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #fff 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Markets
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#94a3b8',
              fontWeight: '400',
              maxWidth: '600px'
            }}>
              Trade on the outcome of future events with instant settlement and zero gas fees.
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
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.3)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }}>

                {/* Header with Image */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                  alignItems: 'flex-start'
                }}>
                  <img
                    src={market.imageUrl}
                    alt={market.question}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      flexShrink: 0,
                      background: 'rgba(0,0,0,0.2)',
                      padding: '4px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  />
                  <h2 style={{
                    color: '#ffffff',
                    fontSize: '1.125rem',
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
                  gap: '0.75rem',
                  marginBottom: '1.25rem'
                }}>
                  {market.options.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => handleBet(market, option)}
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '10px',
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
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = option.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#e2e8f0' }}>{option.name}</span>
                      <span style={{
                        fontSize: '1rem',
                        color: option.color,
                        fontWeight: '700',
                        textShadow: `0 0 10px ${option.color}40`
                      }}>
                        {option.odds}%
                      </span>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#3b82f6',
                      display: 'inline-block',
                      boxShadow: '0 0 8px #3b82f6'
                    }} />
                    ${(market.totalPool / 1000).toFixed(0)}k Vol.
                  </span>
                  <span>
                    Ends {market.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}