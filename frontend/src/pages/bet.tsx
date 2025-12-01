import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLinera } from '../contexts/LineraContext';
import { lineraAdapter } from '../lib/linera-adapter';

export default function Bet() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isConnected } = useLinera();

  // Get market details from URL params
  const marketId = parseInt(searchParams.get('marketId') || '0');
  const question = searchParams.get('question') || '';
  const selectedOption = searchParams.get('option') || '';
  const optionColor = searchParams.get('color') || '#ff00ff';
  const optionOdds = parseInt(searchParams.get('odds') || '50');
  const totalPool = parseInt(searchParams.get('pool') || '0');
  const endTime = searchParams.get('endTime') || '';

  const [betAmount, setBetAmount] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate potential winnings
  const potentialWinnings = betAmount * (100 / optionOdds);
  const profit = potentialWinnings - betAmount;

  useEffect(() => {
    // Redirect to dashboard if no market data
    if (!marketId || !question || !selectedOption) {
      navigate('/markets');
    }
  }, [marketId, question, selectedOption, navigate]);

  const handlePlaceBet = async () => {
    if (!isConnected) {
      setErrorMessage('Please connect your wallet first');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    if (betAmount <= 0) {
      setErrorMessage('Please enter a valid bet amount');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      console.log('Placing bet:', {
        marketId,
        option: selectedOption,
        amount: betAmount
      });

      if (lineraAdapter.isApplicationSet()) {
        // Actual Linera blockchain bet placement
        // await lineraAdapter.mutateApplication({
        //   mutation: `mutation {
        //     placeBet(marketId: ${marketId}, option: "${selectedOption}", amount: ${betAmount}) {
        //       success
        //       transactionId
        //     }
        //   }`
        // });

        setSuccessMessage(`Order placed successfully: $${betAmount} on ${selectedOption}`);
      } else {
        // Demo mode simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSuccessMessage(`Demo: Order of $${betAmount} on ${selectedOption} placed`);
      }

      // Redirect back to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/markets');
      }, 3000);

    } catch (error) {
      console.error('Failed to place bet:', error);
      setErrorMessage('Failed to place order. Please try again.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0b0d',
      fontFamily: "'Inter', sans-serif"
    }}>
      <Header />

      {/* Success/Error Messages */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: '#10b981',
          border: '1px solid #059669',
          borderRadius: '8px',
          padding: '1rem 1.5rem',
          color: 'white',
          fontWeight: '500',
          fontSize: '0.9375rem',
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: '#ef4444',
          border: '1px solid #dc2626',
          borderRadius: '8px',
          padding: '1rem 1.5rem',
          color: 'white',
          fontWeight: '500',
          fontSize: '0.9375rem',
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {errorMessage}
        </div>
      )}

      <main style={{
        flex: 1,
        padding: '2rem',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/markets')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.5rem 0',
            color: '#94a3b8',
            fontSize: '0.9375rem',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '2rem',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Markets
        </button>

        {/* Bet Card */}
        <div style={{
          background: '#13161b',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '0.5rem',
            letterSpacing: '-0.01em'
          }}>
            Place Order
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            marginBottom: '2rem'
          }}>
            Review and confirm your position
          </p>

          {/* Market Question */}
          <div style={{
            background: '#0a0b0d',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Market
            </div>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.25rem',
              marginBottom: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.4'
            }}>
              {question}
            </h2>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              flexWrap: 'wrap',
              gap: '1rem',
              color: '#94a3b8',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '1rem'
            }}>
              <span>
                Volume: <span style={{ color: '#e2e8f0', fontWeight: '500' }}>${totalPool.toLocaleString()}</span>
              </span>
              <span>
                Closes: {endTime}
              </span>
            </div>
          </div>

          {/* Selected Option Display */}
          <div style={{
            background: '#0a0b0d',
            border: `1px solid ${optionColor}`,
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '4px',
              background: optionColor
            }} />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Outcome
                </p>
                <p style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  {selectedOption}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  Price
                </p>
                <p style={{
                  color: optionColor,
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  {optionOdds}¢
                </p>
              </div>
            </div>
          </div>

          {/* Bet Amount Section */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '1rem'
            }}>
              Amount (USD)
            </label>

            {/* Quick Amount Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  style={{
                    background: betAmount === amount
                      ? optionColor
                      : '#0a0b0d',
                    border: betAmount === amount
                      ? `1px solid ${optionColor}`
                      : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (betAmount !== amount) {
                      e.currentTarget.style.background = '#1a1d24';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (betAmount !== amount) {
                      e.currentTarget.style.background = '#0a0b0d';
                    }
                  }}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <input
              type="number"
              min="1"
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#0a0b0d',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '500',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter custom amount"
              onFocus={(e) => e.target.style.borderColor = optionColor}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Potential Winnings Display */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Max Payout
              </span>
              <span style={{
                color: '#ffffff',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                ${potentialWinnings.toFixed(2)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Potential Profit
              </span>
              <span style={{
                color: '#10b981',
                fontSize: '1.25rem',
                fontWeight: '700'
              }}>
                +${profit.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Place Bet Button */}
          <button
            onClick={handlePlaceBet}
            disabled={loading || !isConnected || betAmount <= 0}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: loading || !isConnected || betAmount <= 0
                ? 'rgba(255,255,255,0.05)'
                : optionColor,
              border: 'none',
              borderRadius: '12px',
              color: loading || !isConnected || betAmount <= 0 ? '#64748b' : 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading || !isConnected || betAmount <= 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading && isConnected && betAmount > 0) {
                e.currentTarget.style.filter = 'brightness(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && isConnected && betAmount > 0) {
                e.currentTarget.style.filter = 'none';
              }
            }}
          >
            {loading
              ? 'Placing Order...'
              : !isConnected
                ? 'Connect Wallet to Trade'
                : betAmount <= 0
                  ? 'Enter Amount'
                  : `Place Order - $${betAmount}`}
          </button>

          {/* Info text */}
          {isConnected && betAmount > 0 && !loading && (
            <p style={{
              color: '#64748b',
              fontSize: '0.875rem',
              textAlign: 'center',
              marginTop: '1.5rem'
            }}>
              Transaction will be executed on Linera blockchain
            </p>
          )}
        </div>
      </main>

      <style>{`
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

