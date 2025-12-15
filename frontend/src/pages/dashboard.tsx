import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLinera } from '../contexts/LineraContext';
import { lineraAdapter } from '../lib/linera-adapter';


import { useMarkets } from '../contexts/MarketContext';


// ... imports ...

export default function Dashboard() {
  const navigate = useNavigate();
  const { isConnected } = useLinera();
  const { markets } = useMarkets();
  // const { primaryWallet } = useDynamicContext();

  // Unified color palette: Blue (#3b82f6) and Purple (#a78bfa) and White/Gray
  // const PRIMARY_BLUE = "#3b82f6";
  // const SECONDARY_PURPLE = "#a78bfa";

  // Removed local markets state as it's now in context

  const handleBet = (market: any, option: { name: string; odds: number; color: string }) => {
    if (market.question === "Did Alice or Bella finish her project on time?") {
      navigate('/judge');
      return;
    }

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



  const handleCardClick = (market: any) => {
    console.log('Card clicked:', market.id, market.question);
    // if (market.id === 5 || market.question === "Did Alice or Bella finish her project on time?" || market.question === "Will Sarah finish her project on time?") {
    //   navigate('/judge');
    // }
  };

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
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>

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
                onClick={() => handleCardClick(market)}
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



                {/* Real Judge Indicator & Resolve Button - Showing on all active markets as per user request */}
                {!market.resolved && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 10,
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      background: '#fbbf24',
                      color: '#000',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      You are the judge
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/resolve');
                      }}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      Resolve
                    </button>
                  </div>
                )}

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
                    flex: 1,
                    paddingRight: '220px'
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBet(market, option);
                      }}
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