import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lineraAdapter } from '../lib/linera-adapter';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { CONTRACTS_APP_ID } from '../constants';

interface Market {
    id: number;
    title: string;
    judge: string;
    opponent: string | null;
    betAmount: number;
    endTime: number;
    imageUrl: string;
    resolved: boolean;
    winningOutcome: number;
}

const ResolvePage = () => {
    const navigate = useNavigate();
    const { primaryWallet } = useDynamicContext();
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState<number | null>(null);

    useEffect(() => {
        const fetchMarkets = async () => {
            if (!primaryWallet) return;

            try {
                if (!lineraAdapter.isApplicationSet()) {
                    await lineraAdapter.setApplication(CONTRACTS_APP_ID);
                }

                const query = `query { markets { id title judge opponent betAmount endTime imageUrl resolved winningOutcome } }`;
                const result = await lineraAdapter.queryApplication<{ markets: any[] }>(query);

                // Filter markets where the current user is the judge
                const myJudgeMarkets = result.markets.filter((m: any) =>
                    m.judge.toLowerCase() === primaryWallet.address.toLowerCase() && !m.resolved
                ).map((m: any) => ({
                    ...m,
                    // No need to remap if we use camelCase everywhere, assuming query returns camelCase
                }));

                setMarkets(myJudgeMarkets);
            } catch (error) {
                console.error("Failed to fetch markets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkets();
    }, [primaryWallet]);

    const handleResolve = async (marketId: number, outcome: number) => {
        if (resolving !== null) return;
        setResolving(marketId);

        try {
            const mutation = `mutation {
                resolve(marketId: ${marketId}, winningOutcome: ${outcome})
            }`;

            await lineraAdapter.mutate(mutation);

            // Remove from list
            setMarkets(prev => prev.filter(m => m.id !== marketId));
            alert("Market resolved successfully!");
        } catch (error: any) {
            console.error("Failed to resolve:", error);
            alert(`Failed to resolve: ${error.message}`);
        } finally {
            setResolving(null);
        }
    };

    if (!primaryWallet) {
        return (
            <div style={{ padding: '2rem', color: 'white', textAlign: 'center', background: '#000', minHeight: '100vh' }}>
                Please connect your wallet to view markets to judge.
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: '2rem', color: 'white', textAlign: 'center', background: '#000', minHeight: '100vh' }}>
                Loading markets...
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#000000',
            fontFamily: "'Inter', sans-serif",
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/markets')}
                    style={{
                        background: 'transparent',
                        border: '1px solid #333',
                        color: '#888',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#666';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#333';
                        e.currentTarget.style.color = '#888';
                    }}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {markets.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888' }}>
                    No active markets found where you are the judge.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '600px' }}>
                    {markets.map(market => (
                        <ResolveCard key={market.id} market={market} onResolve={handleResolve} resolving={resolving} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ResolveCard = ({ market, onResolve, resolving }: { market: Market, onResolve: (id: number, outcome: number) => void, resolving: number | null }) => {
    const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);

    // Format dates
    const createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const expiresDate = market.endTime;

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            position: 'relative'
        }}>
            {/* Active Badge */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                background: '#fbbf24',
                color: '#000',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                Active
            </div>

            {/* Title */}
            <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '2.5rem',
                paddingRight: '80px', // Space for badge
                lineHeight: '1.3'
            }}>
                {market.title}
            </h2>

            {/* VS Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2.5rem',
                padding: '0 1rem'
            }}>
                {/* Creator (Left) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}>
                        <img src={market.imageUrl || "https://cryptologos.cc/logos/linera-logo.png"} alt="Creator" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '1.1rem' }}>Creator</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'monospace' }}>0x716B...9A81</span>
                </div>

                {/* VS Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '1.1rem' }}>vs</span>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold',
                        color: '#e2e8f0'
                    }}>
                        🔗 {market.betAmount} Linera
                    </div>
                </div>

                {/* Opponent (Right) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '1.1rem' }}>{market.opponent || 'Open'}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'monospace' }}>0x2aEc...A782</span>
                </div>
            </div>

            {/* Select Winner Section */}
            <div style={{
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                background: 'rgba(0,0,0,0.2)',
                marginBottom: '2rem'
            }}>
                <h3 style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Select the winner
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setSelectedOutcome(0)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '12px',
                            border: selectedOutcome === 0 ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                            background: selectedOutcome === 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            color: 'white'
                        }}
                    >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', overflow: 'hidden' }}>
                            <img src={market.imageUrl} alt="Yes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>YES</span>
                    </button>
                    <button
                        onClick={() => setSelectedOutcome(1)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '12px',
                            border: selectedOutcome === 1 ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                            background: selectedOutcome === 1 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            color: 'white'
                        }}
                    >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>NO</span>
                    </button>
                </div>
            </div>

            {/* Resolve Button */}
            <button
                onClick={() => selectedOutcome !== null && onResolve(market.id, selectedOutcome)}
                disabled={selectedOutcome === null || resolving === market.id}
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: selectedOutcome === null ? '#333' : '#fbbf24',
                    color: selectedOutcome === null ? '#666' : '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: selectedOutcome === null || resolving === market.id ? 'not-allowed' : 'pointer',
                    marginBottom: '2rem',
                    transition: 'all 0.2s'
                }}
            >
                {resolving === market.id ? 'Resolving...' : 'Resolve Market'}
            </button>

            {/* Judge Info */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>⚖️</div>
                <span style={{ color: '#94a3b8' }}>Judge:</span>
                <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{market.judge.substring(0, 10)}...</span>
            </div>

            {/* Contract Info */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <span>Contract</span>
                    <span style={{ fontFamily: 'monospace' }}>{CONTRACTS_APP_ID.substring(0, 10)}... <span style={{ fontSize: '0.8rem' }}>🔗</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <span>Created</span>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>{createdDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <span>Expires</span>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>{expiresDate}</span>
                </div>
            </div>
        </div>
    );
};

export default ResolvePage;
