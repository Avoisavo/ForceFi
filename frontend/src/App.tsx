import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Bet from './pages/bet';
import Sport from './pages/sport';
import SportMarket from './pages/sportMarket';
import Wannabet from './pages/wannabet';
import forceHero from './assets/force_hero.png';

function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      color: 'white'
    }}>
      {/* Hero Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${forceHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.8,
        zIndex: 0
      }} />

      {/* Gradient Overlay for Text Readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)',
        zIndex: 1
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 8%',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ animation: 'fadeIn 1s ease-out' }}>
          <p style={{
            fontSize: '1.25rem',
            color: '#a78bfa',
            marginBottom: '1.5rem',
            fontWeight: '500',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            Do you have the force to predict?
          </p>

          <h1 style={{
            fontSize: '6rem',
            fontWeight: '800',
            color: 'white',
            marginBottom: '2.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            maxWidth: '900px'
          }}>
            Ready to step in?
          </h1>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/markets" style={{
              padding: '1.25rem 2.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Start Building
            </a>
          </div>
        </div>
      </div>

      {/* Footer Section (Visual Only) */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '2rem 8%',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ maxWidth: '400px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1.25rem',
            fontWeight: '700'
          }}>
            <span style={{ color: '#a78bfa' }}>⚡</span> ForceFi
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
            © 2025 ForceFi. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Docs</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

import { MarketProvider } from './contexts/MarketContext';
import NewEvent from './components/newEvent';
import Judge from './pages/judge';

// ... imports ...

function App() {
  return (
    <MarketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/markets" element={<Dashboard />} />
          <Route path="/bet" element={<Bet />} />
          <Route path="/sports" element={<Sport />} />
          <Route path="/sports/:eventId" element={<SportMarket />} />
          <Route path="/wannabet" element={<Wannabet />} />
          <Route path="/new-event" element={<NewEvent />} />
          <Route path="/judge" element={<Judge />} />
        </Routes>
      </BrowserRouter>
    </MarketProvider>
  );
}

export default App;