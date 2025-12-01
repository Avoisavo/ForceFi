export default function Header() {
  // Hard-coded wallet address and balance
  const WALLET_ADDRESS = '994f5f68464920468ca5c3d23a860a69ce0383f049c14cc9d803fd673113233e';
  const WALLET_BALANCE = '945.00';

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
          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: '#3b82f6' }}>💰</span> {WALLET_BALANCE} LINERA
          </div>

          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            borderRadius: '8px',
            color: '#a78bfa',
            fontSize: '0.875rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            {WALLET_ADDRESS.slice(0, 6)}...{WALLET_ADDRESS.slice(-4)}
          </div>
        </div>
      </nav>
    </header>
  );
}

