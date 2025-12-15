import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarkets } from '../contexts/MarketContext';
import { lineraAdapter } from '../lib/linera-adapter';
import { CONTRACTS_APP_ID } from '../constants';

const NewEvent = () => {
    const navigate = useNavigate();
    const { addMarket } = useMarkets();
    const [step, setStep] = useState(1);
    const [busy, setBusy] = useState(false);

    const [formData, setFormData] = useState({
        opponent: '',
        judge: '',
        betAmount: '',
        endDate: '',
        imageUrl: '',
        title: ''
    });

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const MEME_LOGOS = [
        "https://cryptologos.cc/logos/pepe-pepe-logo.png",
        "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
        "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
        "https://cryptologos.cc/logos/bonk-bonk-logo.png",
        "https://cryptologos.cc/logos/floki-inu-floki-logo.png",
        "https://cryptologos.cc/logos/dogwifhat-wif-logo.png",
        "https://cryptologos.cc/logos/apecoin-ape-logo.png",
        "https://cryptologos.cc/logos/mog-coin-mog-logo.png",
        "https://cryptologos.cc/logos/brett-brett-logo.png",
        "https://cryptologos.cc/logos/book-of-meme-bome-logo.png",
        "https://cryptologos.cc/logos/popcat-popcat-logo.png"
    ];

    const handleSubmit = async () => {
        if (busy) return;
        setBusy(true);

        try {
            // Ensure application is set
            if (!lineraAdapter.isApplicationSet()) {
                await lineraAdapter.setApplication(CONTRACTS_APP_ID);
            }

            const endTimeMicros = new Date(formData.endDate).getTime() * 1000;
            const betAmount = parseFloat(formData.betAmount) || 0;
            // Note: In a real app, we'd need to resolve the judge and opponent to Owner IDs.
            // For this demo, we'll assume the user inputs a valid Owner ID string or we use a placeholder.
            // Since the contract expects Owner, we need to be careful. 
            // If the input is not a valid Owner, this mutation will fail.
            // For now, let's assume the user enters a valid Owner ID for the judge.
            // If opponent is empty, we pass null (which becomes None in Rust).

            const opponentArg = formData.opponent ? `"${formData.opponent}"` : "null";
            const judgeArg = `"${formData.judge}"`;

            const mutation = `mutation { 
                createMarket(
                    title: "${formData.title}", 
                    opponent: ${opponentArg}, 
                    judge: ${judgeArg}, 
                    betAmount: ${betAmount}, 
                    endTime: ${endTimeMicros},
                    imageUrl: "${formData.imageUrl}"
                ) 
            }`;

            await lineraAdapter.mutate(mutation);

            // Optimistic update (optional, but good for UX)
            const randomLogo = formData.imageUrl || MEME_LOGOS[Math.floor(Math.random() * MEME_LOGOS.length)];
            addMarket({
                question: formData.title,
                imageUrl: randomLogo,
                options: [
                    { name: "YES", odds: 50, color: "#3b82f6" },
                    { name: "NO", odds: 50, color: "#a78bfa" }
                ],
                totalPool: betAmount,
                endTime: formData.endDate
            });

            navigate('/markets');
        } catch (err: any) {
            console.error("Failed to create market:", err);
            alert(`Failed to create market: ${err.message || JSON.stringify(err)}`);
        } finally {
            setBusy(false);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate('/markets');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#000',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                background: '#111',
                border: '1px solid #333',
                borderRadius: '16px',
                padding: '2rem',
                width: '100%',
                maxWidth: '500px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create a New Bet</h2>

                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{
                            height: '4px',
                            width: '40px',
                            background: s <= step ? '#fbbf24' : '#333',
                            borderRadius: '2px'
                        }} />
                    ))}
                </div>

                {step === 1 && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '1.1rem', fontWeight: '500' }}>Who are you betting?</label>
                            <div style={{
                                background: '#fbbf24', // Yellow background like image
                                borderRadius: '12px',
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                border: '1px solid #fbbf24',
                                color: 'black'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        flexShrink: 0
                                    }}>
                                        👤
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.opponent}
                                        onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                                        placeholder="Enter opponent's name"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'black',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            width: '100%',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                                Leave empty to allow anyone to accept
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '1.1rem', fontWeight: '500' }}>Who should judge? *</label>
                            <div style={{
                                background: '#fbbf24', // Yellow background like image
                                borderRadius: '12px',
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                border: '1px solid #fbbf24',
                                color: 'black'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        flexShrink: 0
                                    }}>
                                        ⚖️
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.judge}
                                        onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
                                        placeholder="Enter judge's name"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'black',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            width: '100%',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                                Pick someone both parties trust to decide the outcome
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Bet Amount (Testnet Tokens)</label>
                            <input
                                type="number"
                                value={formData.betAmount}
                                onChange={(e) => setFormData({ ...formData, betAmount: e.target.value })}
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: '#222',
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>When will this bet end?</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: '#222',
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Image URL (Optional)</label>
                            <input
                                type="text"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://example.com/image.png"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: '#222',
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>What is the bet?</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Will it rain tomorrow?"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: '#222',
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        onClick={handleBack}
                        disabled={busy}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: 'transparent',
                            color: '#888',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
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
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={busy}
                        style={{
                            flex: 2,
                            padding: '1rem',
                            background: busy ? '#666' : '#fbbf24',
                            color: 'black',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: busy ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {busy ? 'Creating...' : (step === 3 ? 'Create Bet' : 'Next')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewEvent;
