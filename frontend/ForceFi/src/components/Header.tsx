export default function Header() {
  return (
    <header style={{
      padding: '1rem 2rem',
      backgroundColor: '#333',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>ForceFi</h1>
      <nav>
        <ul style={{ 
          display: 'flex', 
          gap: '2rem', 
          listStyle: 'none',
          margin: 0,
          padding: 0
        }}>
          <li><a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
          <li><a href="/hallo" style={{ color: 'white', textDecoration: 'none' }}>Hallo</a></li>
        </ul>
      </nav>
    </header>
  );
}

