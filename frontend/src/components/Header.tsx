import { useEffect, useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { lineraAdapter } from '../lib/linera-adapter';

interface HeaderProps {
  rightContent?: React.ReactNode;
}

export default function Header({ rightContent }: HeaderProps) {
  const { primaryWallet, handleLogOut, setShowAuthFlow } = useDynamicContext();
  const [lineraBalance, setLineraBalance] = useState<string>('0.00');
  const [lineraChainId, setLineraChainId] = useState<string>('');
  const [isLineraConnected, setIsLineraConnected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const connectLinera = async () => {
      if (primaryWallet) {
        try {
          // Connect to Linera Testnet
          // Use the testnet faucet URL
          const FAUCET_URL = "https://faucet.testnet-conway.linera.net";
          const provider = await lineraAdapter.connect(primaryWallet, FAUCET_URL);
          setIsLineraConnected(true);
          setLineraChainId(provider.chainId);

          // Fetch initial balance with retry logic
          let balance = "0";
          try {
            balance = await lineraAdapter.client.balance();
          } catch (e) {
            console.warn("Failed to fetch initial balance, retrying in 1s...", e);
            await new Promise(r => setTimeout(r, 1000));
            try {
              balance = await lineraAdapter.client.balance();
            } catch (e2) {
              console.error("Failed to fetch balance after retry:", e2);
              // Continue with 0 balance rather than failing connection
            }
          }
          setLineraBalance(balance.toString());

        } catch (error) {
          console.error("Failed to connect to Linera:", error);
        }
      } else {
        setIsLineraConnected(false);
        setLineraBalance('0.00');
        setLineraChainId('');
      }
    };

    connectLinera();
  }, [primaryWallet]);

  // Poll for balance updates
  useEffect(() => {
    if (!isLineraConnected) return;

    const interval = setInterval(async () => {
      try {
        const provider = lineraAdapter.getProvider();
        const balance = await provider.client.balance();
        setLineraBalance(balance.toString());
      } catch (error) {
        console.error("Failed to poll balance:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLineraConnected]);

  return (
    <header style={{
      padding: '1.5rem 2rem',
      backgroundColor: 'rgba(10, 11, 13, 0.8)',
      backdropFilter: 'blur(12px)',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <h1 style={{
        margin: 0,
        fontSize: '1.5rem',
        background: 'linear-gradient(90deg, #fff 0%, #a78bfa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: "'Inter', sans-serif",
        fontWeight: '700',
        letterSpacing: '-0.02em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ fontSize: '1.25rem' }}>⚡</span> ForceFi
      </h1>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <ul style={{
          display: 'flex',
          gap: '2rem',
          listStyle: 'none',
          margin: 0,
          padding: 0
        }}>
          <li>
            <a href="/" style={{
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'color 0.2s',
              fontSize: '0.9375rem',
              fontWeight: '500'
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              Home
            </a>
          </li>
          <li>
            <a href="/markets" style={{
              color: 'white',
              textDecoration: 'none',
              transition: 'color 0.2s',
              fontSize: '0.9375rem',
              fontWeight: '500'
            }}>
              Markets
            </a>
          </li>
        </ul>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {rightContent}
          {primaryWallet && isLineraConnected ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '0.5rem',
                  color: '#a78bfa',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)';
                }}
              >
                <span style={{ opacity: 0.7 }}>Connected:</span> {primaryWallet.address.slice(0, 6)}...{primaryWallet.address.slice(-4)}
                <span style={{ fontSize: '0.75rem', opacity: 0.5, transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
              </button>

              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  width: '240px',
                  backgroundColor: 'rgba(17, 17, 20, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                  zIndex: 100
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Linera Chain ID</span>
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '0.8125rem',
                      color: '#e2e8f0',
                      wordBreak: 'break-all',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.5rem',
                      borderRadius: '0.375rem'
                    }}>
                      {lineraChainId ? lineraChainId.slice(0, 16) + '...' : 'Loading...'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Balance</span>
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                      color: '#a78bfa',
                      fontWeight: '600'
                    }}>
                      {lineraBalance} <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>LINERA</span>
                    </div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '0.25rem 0' }} />

                  <button
                    onClick={handleLogOut}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '0.375rem',
                      color: '#f87171',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    }}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthFlow(true)}
              style={{
                padding: '0.5rem 1rem',
                background: '#7c3aed',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#6d28d9'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#7c3aed'}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}


