import { useLocation, useParams } from 'react-router-dom';

const SportMarket = () => {
    const { eventId } = useParams();
    const location = useLocation();
    const eventData = location.state?.eventData;

    if (!eventData) {
        return (
            <div style={{ padding: '2rem', color: 'white', minHeight: '100vh', background: '#000' }}>
                <h1>Event Not Found</h1>
                <p>No data available for event ID: {eventId}</p>
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

    return (
        <div style={{
            padding: '2rem',
            color: 'white',
            minHeight: '100vh',
            background: '#000',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
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
                </div>
            </div>
        </div>
    );
};

export default SportMarket;
