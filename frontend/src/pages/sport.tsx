import { useEffect, useState } from 'react';

interface Team {
    name: string;
    slug: string;
    shortName: string;
}

interface Event {
    id: number;
    slug: string;
    startTimestamp: number;
    homeTeam: Team;
    awayTeam: Team;
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

const Sport = () => {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = () => {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === this.DONE) {
                    try {
                        const responseData = JSON.parse(this.responseText);
                        setData(responseData);
                        setLoading(false);
                    } catch (err) {
                        setError('Failed to parse response');
                        setLoading(false);
                    }
                }
            });

            xhr.open('GET', 'https://sportapi7.p.rapidapi.com/api/v1/player/817181/unique-tournament/132/season/65360/ratings');
            xhr.setRequestHeader('x-rapidapi-key', '6edb283a6cmshee06689689cfd50p13b4c8jsnf64bdb417da6');
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

    return (
        <div style={{
            padding: '2rem',
            color: 'white',
            minHeight: '100vh',
            background: '#000',
            fontFamily: "'Inter', sans-serif"
        }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                borderBottom: '1px solid #333',
                paddingBottom: '1rem'
            }}>
                Player Ratings Markets
            </h1>

            {loading && <div style={{ color: '#888' }}>Loading markets...</div>}
            {error && <div style={{ color: '#ff4444' }}>{error}</div>}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {data?.seasonRatings?.map((item) => (
                    <div key={item.eventId} style={{
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
                                    {formatDate(item.event.startTimestamp)}
                                </span>
                            </div>

                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                lineHeight: '1.4'
                            }}>
                                {item.event.homeTeam.shortName} vs {item.event.awayTeam.shortName}
                            </h3>

                            <p style={{ color: '#888', fontSize: '0.875rem' }}>
                                Player Rating: {item.rating}
                            </p>
                        </div>

                        <div style={{
                            marginTop: '1.5rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid #222',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: '#666', fontSize: '0.875rem' }}>Resolution Date</span>
                            <span style={{ color: '#fff', fontWeight: '500' }}>
                                {formatDate(item.event.startTimestamp)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sport;
