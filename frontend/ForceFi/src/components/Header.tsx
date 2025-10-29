export default function Header() {
  // Hard-coded wallet address and balance
  const WALLET_ADDRESS = '994f5f68464920468ca5c3d23a860a69ce0383f049c14cc9d803fd673113233e';
  const WALLET_BALANCE = '945.00';

  return (
    <header style={{
      padding: '1rem 2rem',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid #ff00ff',
      boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)'
    }}>
      <h1 style={{ 
        margin: 0, 
        fontSize: '1.8rem',
        background: 'linear-gradient(90deg, #ff00ff, #00ffff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'monospace',
        fontWeight: 'bold'
      }}>
        ⚡ ForceFi
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
              color: '#00ffff', 
              textDecoration: 'none',
              transition: 'all 0.3s',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
            }}>
              Home
            </a>
          </li>
          <li>
            <a href="/hallo" style={{ 
              color: '#00ffff', 
              textDecoration: 'none',
              transition: 'all 0.3s',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
            }}>
              Markets
            </a>
          </li>
        </ul>

        <div style={{
          padding: '0.7rem 1.5rem',
          background: 'linear-gradient(135deg, #ffaa00, #ff6600)',
          borderRadius: '10px',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          boxShadow: '0 0 15px rgba(255, 170, 0, 0.5)'
        }}>
          💰 {WALLET_BALANCE} LINERA
        </div>

        <div style={{
          padding: '0.7rem 1.5rem',
          background: 'linear-gradient(135deg, #00ff88, #00ddff)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)'
        }}>
          ✅ {WALLET_ADDRESS.slice(0, 6)}...{WALLET_ADDRESS.slice(-4)}
        </div>
      </nav>
    </header>
  );
}

