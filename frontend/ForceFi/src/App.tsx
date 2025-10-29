import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Header from './components/Header';

function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1a0033 0%, #0a1428 50%, #001a33 100%)',
    }}>
      <Header />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #ff00ff, #00ffff, #ffff00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '2rem',
          fontFamily: 'monospace'
        }}>
          ⚡ Welcome to ForceFi
        </h1>
        <p style={{
          fontSize: '1.5rem',
          color: '#00ffff',
          marginBottom: '3rem',
          maxWidth: '600px'
        }}>
          The future of decentralized prediction markets powered by Linera blockchain
        </p>
        <a href="/hallo" style={{
          padding: '1.5rem 3rem',
          background: 'linear-gradient(135deg, #ff00ff, #00ffff)',
          border: 'none',
          borderRadius: '15px',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textDecoration: 'none',
          display: 'inline-block',
          boxShadow: '0 0 30px rgba(255,0,255,0.6)',
          fontFamily: 'monospace',
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🎮 Enter Markets
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hallo" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;