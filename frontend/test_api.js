import https from 'https';

const options = {
    hostname: 'sportapi7.p.rapidapi.com',
    path: '/api/v1/player/817181/unique-tournament/132/season/65360/ratings',
    method: 'GET',
    headers: {
        'x-rapidapi-key': '0a7e774b90mshe4032d7225fd6a3p10ba76jsn5cbeb1146f2d',
        'x-rapidapi-host': 'sportapi7.p.rapidapi.com'
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('BODY:');
        console.log(data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
