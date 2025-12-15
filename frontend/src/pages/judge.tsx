import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const Judge = () => {
    const navigate = useNavigate();
    const [winner, setWinner] = useState<string | null>(null);

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
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>

                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '2rem',
                    maxWidth: '600px',
                    margin: '0 auto',
                    width: '100%'
                }}>
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            alignSelf: 'flex-start',
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        ← Back
                    </button>

                    {/* Main Card */}
                    <div style={{
                        background: '#fffbf0', // Light yellow background
                        borderRadius: '24px',
                        padding: '2rem',
                        width: '100%',
                        color: '#1a1a1a',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                                Did Alice or Bella finish her project on time?
                            </h2>
                            <span style={{
                                background: '#fbbf24',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}>
                                Active
                            </span>
                        </div>

                        {/* Players */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: '2rem 0'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: '#e2e8f0',
                                    margin: '0 auto 0.5rem',
                                    overflow: 'hidden'
                                }}>
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" alt="Alice" style={{ width: '100%', height: '100%' }} />
                                </div>
                                <div style={{ fontWeight: '700' }}>Alice</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>0x716B...9A81</div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '0.875rem' }}>VS</div>
                                <div style={{
                                    background: '#f1f5f9',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontWeight: '600',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    0.1 linera
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: '#e2e8f0',
                                    margin: '0 auto 0.5rem',
                                    overflow: 'hidden'
                                }}>
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" alt="Bella" style={{ width: '100%', height: '100%' }} />
                                </div>
                                <div style={{ fontWeight: '700' }}>Bella</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>0x2aEc...A782</div>
                            </div>
                        </div>

                        {/* Winner Selection */}
                        <div style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            background: '#fff'
                        }}>
                            <h3 style={{
                                textAlign: 'center',
                                fontSize: '1rem',
                                color: '#64748b',
                                marginBottom: '1rem'
                            }}>
                                Select the winner
                            </h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setWinner('Alice')}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: winner === 'Alice' ? '2px solid #fbbf24' : '1px solid #e2e8f0',
                                        background: winner === 'Alice' ? '#fffbeb' : 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" alt="Alice" style={{ width: '100%', height: '100%' }} />
                                    </div>
                                    <span style={{ fontWeight: '600' }}>Alice</span>
                                </button>

                                <button
                                    onClick={() => setWinner('Bella')}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: winner === 'Bella' ? '2px solid #fbbf24' : '1px solid #e2e8f0',
                                        background: winner === 'Bella' ? '#fffbeb' : 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" alt="Bella" style={{ width: '100%', height: '100%' }} />
                                    </div>
                                    <span style={{ fontWeight: '600' }}>Bella</span>
                                </button>
                            </div>
                        </div>

                        {/* Judge Info */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '2rem',
                            fontSize: '0.875rem',
                            color: '#64748b'
                        }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', background: '#e2e8f0' }}>
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Judge" alt="Judge" style={{ width: '100%', height: '100%' }} />
                            </div>
                            <span>Judge: <strong>You</strong></span>
                        </div>

                        {/* Footer Info */}
                        <div style={{
                            marginTop: '2rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid #e2e8f0',
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Contract</span>
                                <span style={{ fontFamily: 'monospace' }}>0xE7f9...8f31 ↗</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Created</span>
                                <span>DEC 15, 2025</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Expires</span>
                                <span>Jan 26, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Judge;
