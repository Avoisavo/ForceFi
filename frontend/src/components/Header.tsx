import { useEffect, useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { lineraAdapter } from '../lib/linera-adapter';

export default function Header() {
  const { primaryWallet, handleLogOut, setShowAuthFlow } = useDynamicContext();
  const [lineraBalance, setLineraBalance] = useState<string>('0.00');
  const [lineraChainId, setLineraChainId] = useState<string>('');
  const [isLineraConnected, setIsLineraConnected] = useState(false);

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
          {primaryWallet && isLineraConnected ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(59, 130, 246, 0.1)', // bg-blue-500/10
                border: '1px solid rgba(59, 130, 246, 0.3)', // border-blue-500/30
                borderRadius: '0.5rem',
                color: '#60a5fa', // text-blue-400
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                Dynamic: {primaryWallet.address.slice(0, 6)}...{primaryWallet.address.slice(-4)}
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(34, 197, 94, 0.1)', // bg-green-500/10
                border: '1px solid rgba(34, 197, 94, 0.3)', // border-green-500/30
                borderRadius: '0.5rem',
                color: '#4ade80', // text-green-400
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                Linera Chain: {lineraChainId.slice(0, 6)}...
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(168, 85, 247, 0.1)', // bg-purple-500/10
                border: '1px solid rgba(168, 85, 247, 0.3)', // border-purple-500/30
                borderRadius: '0.5rem',
                color: '#c084fc', // text-purple-400
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                Balance: {lineraBalance}
              </div>
              <button
                onClick={handleLogOut}
                style={{
                  marginTop: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Disconnect
              </button>
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


