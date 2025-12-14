import Header from '../components/Header';
import forceHero from '../assets/force_hero.png';

const Judge = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#000000',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden',
            color: 'white'
        }}>
            {/* Background Image */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${forceHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.2,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Header />

                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Judge Page</h1>
                    <p style={{ fontSize: '1.2rem', color: '#ccc' }}>This is the judging interface for the market.</p>
                </div>
            </div>
        </div>
    );
};

export default Judge;
