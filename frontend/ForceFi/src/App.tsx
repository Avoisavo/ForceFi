import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Bet from './pages/bet';

function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0a0015 0%, #1a0033 25%, #0a1428 50%, #001a33 75%, #000a1a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background circles */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,0,255,0.15) 0%, transparent 70%)',
        top: '-200px',
        left: '-200px',
        animation: 'float 20s ease-in-out infinite',
        filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,255,0.15) 0%, transparent 70%)',
        bottom: '-150px',
        right: '-150px',
        animation: 'float 15s ease-in-out infinite reverse',
        filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,0,0.1) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'pulse 10s ease-in-out infinite',
        filter: 'blur(80px)'
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 30px) scale(1.1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255,0,255,0.6)) drop-shadow(0 0 40px rgba(0,255,255,0.4)); }
          50% { filter: drop-shadow(0 0 30px rgba(255,0,255,0.8)) drop-shadow(0 0 60px rgba(0,255,255,0.6)); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          animation: 'slideUp 1s ease-out, glow 3s ease-in-out infinite',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '6rem',
            fontWeight: '900',
            background: 'linear-gradient(90deg, #ff00ff 0%, #00ffff 25%, #ffff00 50%, #00ffff 75%, #ff00ff 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            animation: 'gradientShift 6s ease infinite',
            textShadow: '0 0 80px rgba(255,0,255,0.5)',
            lineHeight: '1.2'
          }}>
            ⚡ Welcome to ForceFi
          </h1>
        </div>

        <p style={{
          fontSize: '1.8rem',
          color: '#00ffff',
          marginBottom: '4rem',
          maxWidth: '700px',
          lineHeight: '1.6',
          fontWeight: '300',
          textShadow: '0 0 20px rgba(0,255,255,0.5)',
          animation: 'slideUp 1.2s ease-out',
          opacity: 0.95
        }}>
          The future of decentralized prediction markets powered by Linera blockchain
        </p>

        <div style={{ animation: 'slideUp 1.4s ease-out' }}>
          <a href="/hallo" style={{
            padding: '1.8rem 4rem',
            background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
            backgroundSize: '200% auto',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            color: 'white',
            fontSize: '1.6rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 0 40px rgba(255,0,255,0.6), 0 0 60px rgba(0,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.1)',
            fontFamily: 'monospace',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
            overflow: 'hidden',
            letterSpacing: '0.05em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 0 60px rgba(255,0,255,0.8), 0 0 80px rgba(0,255,255,0.6), inset 0 0 30px rgba(255,255,255,0.2)';
            e.currentTarget.style.backgroundPosition = '100% 0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(255,0,255,0.6), 0 0 60px rgba(0,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.1)';
            e.currentTarget.style.backgroundPosition = '0% 0';
          }}
          >
            🎮 Enter Markets
          </a>
        </div>
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
        <Route path="/bet" element={<Bet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;