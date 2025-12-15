import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLinera } from '../contexts/LineraContext';
import { lineraAdapter } from '../lib/linera-adapter';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const SportMarket = () => {
    const { eventId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const eventData = location.state?.eventData;
    const { isConnected } = useLinera();
    const { setShowAuthFlow } = useDynamicContext();

    const [betAmount, setBetAmount] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<'YES' | 'NO'>('YES');
    const [isProcessing, setIsProcessing] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    if (!eventData) {
        return (
            <div style={{ padding: '2rem', color: 'white', minHeight: '100vh', background: '#000' }}>
                <h1>Event Not Found</h1>
                <p>No data available for event ID: {eventId}</p>
                <button
                    onClick={() => navigate('/sports')}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        background: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    const { event, ratings } = eventData;

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const [odds, setOdds] = useState({ yes: 50, no: 50 });

    // Generate deterministic mock odds based on eventId
    useState(() => {
        if (event) {
            // Simple hash of eventId to get a number between 30 and 70
            const idNum = parseInt(eventId || '0', 10);
            const yes = 30 + (idNum * 7 % 41); // 30 + (0..40) = 30..70
            setOdds({ yes, no: 100 - yes });
        }
    });

    const handleBet = async () => {
        if (!isConnected) {
            setShowAuthFlow(true);
            return;
        }

        if (!betAmount || parseFloat(betAmount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        setIsProcessing(true);
        setTxHash(null);

        try {
            const amount = betAmount; // Pass as string
            const outcomeIndex = selectedOption === 'YES' ? 0 : 1;

            console.log(`Placing sports bet on event ${eventId}: ${selectedOption} (${outcomeIndex}) for ${amount}`);

            const mutation = `
                mutation {
                    sportsBet(
                        eventId: "${eventId}",
                        outcome: ${outcomeIndex},
                        amount: "${amount}"
                    )
                }
            `;

            const result = await lineraAdapter.mutate(mutation);
            console.log("Bet result:", result);

            // In a real scenario, we'd get the certificate hash from the result or the adapter
            const hash = "Tx-" + Date.now();
            setTxHash(hash);

            alert(`Bet Placed Successfully! \nTransaction Signed.`);
            setBetAmount('');

        } catch (error: any) {
            console.error("Betting failed:", error);
            alert(`Failed to place bet: ${error.message || error}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const currentOdds = selectedOption === 'YES' ? odds.yes : odds.no;
    const multiplier = (100 / currentOdds);
    const potentialReturn = betAmount ? (parseFloat(betAmount) * multiplier).toFixed(2) : "0.00";

    return (
        <div style={{
            padding: '2rem',
            color: 'white',
            minHeight: '100vh',
            background: '#000',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/sports')}
                    style={{
                        marginBottom: '1rem',
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        color: '#aaa',
                        border: '1px solid #333',
                        borderRadius: '6px',
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
                        e.currentTarget.style.color = '#aaa';
                    }}
                >
                    ← Back to Menu
                </button>

                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                }}>
                    {event.homeTeam.name} vs {event.awayTeam.name}
                </h1>

                <div style={{
                    background: '#111',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    padding: '2rem',
                    marginTop: '2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '2rem',
                        borderBottom: '1px solid #222',
                        paddingBottom: '1rem'
                    }}>
                        <div>
                            <h2 style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Tournament</h2>
                            <p style={{ fontSize: '1.125rem' }}>{event.tournament.name}</p>
                        </div>
                        <div>
                            <h2 style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Date</h2>
                            <p style={{ fontSize: '1.125rem' }}>{formatDate(event.startTimestamp)}</p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1rem' }}>Player Ratings</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {ratings && ratings.map((rating: number, index: number) => (
                                <div key={index} style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: '#a78bfa',
                                    background: 'rgba(167, 139, 250, 0.1)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(167, 139, 250, 0.2)'
                                }}>
                                    {rating}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ marginBottom: '1rem', color: '#888' }}>Home Team</h3>
                            <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{event.homeTeam.name}</div>
                            <div style={{ color: '#666' }}>Score: {event.homeScore?.current}</div>
                        </div>
                        <div>
                            <h3 style={{ marginBottom: '1rem', color: '#888' }}>Away Team</h3>
                            <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{event.awayTeam.name}</div>
                            <div style={{ color: '#666' }}>Score: {event.awayScore?.current}</div>
                        </div>
                    </div>

                    {/* Mock Betting Section */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Place Your Bet</h3>

                        {/* Prediction Bar */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}>
                                <span style={{ color: '#3b82f6' }}>YES {odds.yes}%</span>
                                <span style={{ color: '#a78bfa' }}>NO {odds.no}%</span>
                            </div>
                            <div style={{
                                height: '8px',
                                width: '100%',
                                background: '#333',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                display: 'flex'
                            }}>
                                <div style={{ width: `${odds.yes}%`, background: '#3b82f6' }} />
                                <div style={{ width: `${odds.no}%`, background: '#a78bfa' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => setSelectedOption('YES')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: selectedOption === 'YES' ? '2px solid #3b82f6' : '1px solid #333',
                                    background: selectedOption === 'YES' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Buy YES ({odds.yes}%)
                            </button>
                            <button
                                onClick={() => setSelectedOption('NO')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: selectedOption === 'NO' ? '2px solid #a78bfa' : '1px solid #333',
                                    background: selectedOption === 'NO' ? 'rgba(167, 139, 250, 0.2)' : 'transparent',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Buy NO ({odds.no}%)
                            </button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.875rem' }}>
                                Amount (Linera)
                            </label>
                            <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(e.target.value)}
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: '#000',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1.125rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '8px'
                        }}>
                            <div>
                                <div style={{ color: '#aaa', fontSize: '0.875rem', marginBottom: '0.25rem' }}>After Win</div>
                                <div style={{ color: '#10b981', fontWeight: 'bold' }}>{potentialReturn} Linera</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#aaa', fontSize: '0.875rem', marginBottom: '0.25rem' }}>After Lose</div>
                                <div style={{ color: '#ef4444', fontWeight: 'bold' }}>0.00 Linera</div>
                            </div>
                        </div>

                        <button
                            onClick={handleBet}
                            disabled={isProcessing}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: isProcessing ? '#333' : '#fff',
                                color: isProcessing ? '#888' : '#000',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.125rem',
                                fontWeight: 'bold',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isProcessing ? 'Processing...' : `Place Bet on ${selectedOption}`}
                        </button>

                        {txHash && (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bet Placed Successfully!</div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SportMarket;
