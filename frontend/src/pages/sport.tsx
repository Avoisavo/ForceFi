import { useEffect, useState } from 'react';

const Sport = () => {
    const [data, setData] = useState<any>(null);
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

    return (
        <div style={{ padding: '2rem', color: 'white', minHeight: '100vh', background: '#000' }}>
            <h1>Player Ratings</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {data && (
                <pre style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default Sport;
