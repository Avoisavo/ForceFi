
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Wannabet = () => {
    const navigate = useNavigate();

    const markets = [
        {
            id: 1,
            title: "Will Daniel get A for finals?",
            resolutionDate: "Dec 20, 2025",
            volume: "$1,234",
            chance: "45%"
        },
        {
            id: 2,
            title: "Will it rain tomorrow?",
            resolutionDate: "Dec 16, 2025",
            volume: "$567",
            chance: "80%"
        },
        {
            id: 3,
            title: "Will the bus be late?",
            resolutionDate: "Dec 16, 2025",
            volume: "$890",
            chance: "20%"
        },
        {
            id: 4,
            title: "Will Joshua go to eat McD today?",
            resolutionDate: "Dec 15, 2025",
            volume: "$120",
            chance: "60%"
        },
        {
            id: 5,
            title: "Will Sarah finish her project on time?",
            resolutionDate: "Dec 18, 2025",
            volume: "$340",
            chance: "75%"
        },
        {
            id: 6,
            title: "Will the coffee shop run out of croissants?",
            resolutionDate: "Dec 16, 2025",
            volume: "$45",
            chance: "30%"
        },
        {
            id: 7,
            title: "Will the gym be crowded at 6 PM?",
            resolutionDate: "Dec 15, 2025",
            volume: "$210",
            chance: "90%"
        },
        {
            id: 8,
            title: "Will my favorite team win the match?",
            resolutionDate: "Dec 17, 2025",
            volume: "$5,600",
            chance: "50%"
        },
        {
            id: 9,
            title: "Will the stock market go up today?",
            resolutionDate: "Dec 15, 2025",
            volume: "$10,230",
            chance: "55%"
        },
        {
            id: 10,
            title: "Will I wake up before my alarm?",
            resolutionDate: "Dec 16, 2025",
            volume: "$15",
            chance: "10%"
        },
        {
            id: 11,
            title: "Will the new movie get a rating above 8.0?",
            resolutionDate: "Dec 19, 2025",
            volume: "$890",
            chance: "40%"
        }
    ];

    const newEventButton = (
        <button
            style={{
                padding: '0.5rem 1rem',
                background: '#a78bfa',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
                fontSize: '0.875rem'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = '#a78bfa';
            }}
        >
            + New Event
        </button>
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: '#000',
            fontFamily: "'Inter', sans-serif"
        }}>
            <Header rightContent={newEventButton} />

            <div style={{ padding: '2rem', color: 'white' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        borderBottom: '1px solid #333',
                        paddingBottom: '1rem'
                    }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
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
                            ← Back to Home
                        </button>

                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            margin: 0
                        }}>
                            Casual Markets
                        </h1>

                        <div style={{ width: '100px' }}></div> {/* Spacer for alignment */}
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {markets.map((market) => (
                            <div key={market.id} style={{
                                background: '#111',
                                border: '1px solid #333',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                transition: 'transform 0.2s, border-color 0.2s',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '180px'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#666';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#333';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <span style={{
                                            background: 'rgba(167, 139, 250, 0.1)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            color: '#a78bfa'
                                        }}>
                                            Casual
                                        </span>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: '#666'
                                        }}>
                                            Ends {market.resolutionDate}
                                        </span>
                                    </div>

                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        marginBottom: '1rem',
                                        lineHeight: '1.4'
                                    }}>
                                        {market.title}
                                    </h3>
                                </div>

                                <div style={{
                                    marginTop: 'auto',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #222',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Volume</div>
                                        <div style={{ color: '#fff' }}>{market.volume}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Chance</div>
                                        <div style={{ color: '#a78bfa', fontWeight: 'bold' }}>{market.chance}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wannabet;
