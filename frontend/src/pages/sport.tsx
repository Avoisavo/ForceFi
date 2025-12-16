import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Team {
    name: string;
    slug: string;
    shortName: string;
}

interface Score {
    current: number;
    display: number;
}

interface Tournament {
    name: string;
    slug: string;
}

interface Event {
    id: number;
    slug: string;
    startTimestamp: number;
    homeTeam: Team;
    awayTeam: Team;
    homeScore?: Score;
    awayScore?: Score;
    tournament: Tournament;
}

interface SeasonRating {
    eventId: number;
    event: Event;
    rating: number;
    startTimestamp: number;
}

interface ApiResponse {
    seasonRatings: SeasonRating[];
}

interface GroupedEvent {
    event: Event;
    ratings: number[];
}



// ... existing interfaces ...

const Sport = () => {
    const [groupedEvents, setGroupedEvents] = useState<GroupedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // ... existing fetchData logic ...
        const fetchData = () => {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === this.DONE) {
                    try {
                        const responseData: ApiResponse = JSON.parse(this.responseText);

                        // Group by event ID
                        const groups: { [key: number]: GroupedEvent } = {};
                        responseData.seasonRatings?.forEach((item) => {
                            if (!groups[item.eventId]) {
                                groups[item.eventId] = {
                                    event: item.event,
                                    ratings: []
                                };
                            }
                            groups[item.eventId].ratings.push(item.rating);
                        });

                        setGroupedEvents(Object.values(groups));
                        setLoading(false);
                    } catch (err) {
                        setError('Failed to parse response');
                        setLoading(false);
                    }
                }
            });

            xhr.open('GET', 'https://sportapi7.p.rapidapi.com/api/v1/player/817181/unique-tournament/132/season/65360/ratings');
            xhr.setRequestHeader('x-rapidapi-key', '0a7e774b90mshe4032d7225fd6a3p10ba76jsn5cbeb1146f2d');
            xhr.setRequestHeader('x-rapidapi-host', 'sportapi7.p.rapidapi.com');

            xhr.send(null);
        };

        fetchData();
    }, []);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleCardClick = (group: GroupedEvent) => {
        navigate(`/sports/${group.event.id}`, {
            state: {
                eventData: {
                    event: group.event,
                    ratings: group.ratings
                }
            }
        });
    };



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
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>

                {/* Hero Section */}
                <div style={{
                    padding: '3rem 2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <h1 style={{
                            fontSize: '3rem',
                            fontWeight: '700',
                            color: '#ffffff',
                            marginBottom: '1rem',
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(90deg, #fff 0%, #a78bfa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Player Ratings Markets
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#94a3b8',
                            fontWeight: '400',
                            maxWidth: '600px'
                        }}>
                            Trade on player performance ratings with instant settlement.
                        </p>
                    </div>
                </div>

                <div style={{
                    flex: 1,
                    padding: '2rem',
                    width: '100%',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    {loading && <div style={{ color: '#888' }}>Loading markets...</div>}
                    {error && <div style={{ color: '#ff4444' }}>{error}</div>}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {groupedEvents.map((group) => (
                            <div key={group.event.id}
                                onClick={() => handleCardClick(group)}
                                style={{
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
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            color: '#aaa'
                                        }}>
                                            NBA
                                        </span>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: '#666'
                                        }}>
                                            {formatDate(group.event.startTimestamp)}
                                        </span>
                                    </div>

                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        marginBottom: '1rem',
                                        lineHeight: '1.4'
                                    }}>
                                        Will {group.event.homeTeam.shortName} win against {group.event.awayTeam.shortName}?
                                    </h3>

                                    {/* Prediction Bar */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        {(() => {
                                            const yes = 30 + (group.event.id * 7 % 41);
                                            const no = 100 - yes;
                                            return (
                                                <>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        <span style={{ color: '#3b82f6' }}>YES {yes}%</span>
                                                        <span style={{ color: '#a78bfa' }}>NO {no}%</span>
                                                    </div>
                                                    <div style={{
                                                        height: '8px',
                                                        width: '100%',
                                                        background: '#333',
                                                        borderRadius: '4px',
                                                        overflow: 'hidden',
                                                        display: 'flex'
                                                    }}>
                                                        <div style={{ width: `${yes}%`, background: '#3b82f6' }} />
                                                        <div style={{ width: `${no}%`, background: '#a78bfa' }} />
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    <p style={{ color: '#888', fontSize: '0.875rem' }}>
                                        {group.ratings.length > 1 ? `${group.ratings.length} Ratings Available` : `Rating: ${group.ratings[0]}`}
                                    </p>
                                </div>

                                <div style={{
                                    marginTop: '1rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #222',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ color: '#666', fontSize: '0.875rem' }}>Resolution Date</span>
                                    <span style={{ color: '#fff', fontWeight: '500' }}>
                                        {formatDate(group.event.startTimestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sport;
