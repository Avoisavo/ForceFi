import Header from '../components/Header';

export default function hallo() {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0
      }}>
        <Header />
        <main style={{ 
          flex: 1,
          padding: '2rem',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1>Your Page Title</h1>
          <p>Page content here</p>
        </main>
      </div>
    );
  }