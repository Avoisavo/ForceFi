import { Outlet } from 'react-router-dom';
import Header from './Header';
import forceHero from '../assets/force_hero.png';

export default function Layout() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#000000',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Image - Shared across all authenticated pages */}
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
                <Outlet />
            </div>
        </div>
    );
}
